const SCRIPT_ID = "culqi-checkout-v4";
const SCRIPT_3DS_ID = "culqi-3ds";

declare global {
  interface Window {
    Culqi?: {
      publicKey?: string;
      token?: { id: string };
      error?: { merchant_message?: string; user_message?: string; type?: string };
      settings: (options: Record<string, unknown>) => void;
      options: (options: Record<string, unknown>) => void;
      open: () => void;
      close: () => void;
    };
    Culqi3DS?: {
      publicKey?: string;
    };
    culqi?: () => void;
  }
}

export interface OpenCulqiCheckoutParams {
  amountInCentimos: number;
  email: string;
  culqiOrderId: string;
  rsaId: string;
  rsaPublicKey: string;
  title?: string;
}

export function isCulqiConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY?.trim());
}

function getPublicKey(): string {
  const publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY?.trim();
  if (!publicKey) {
    throw new Error("Culqi no está configurado.");
  }

  return publicKey;
}

function loadScript(id: string, src: string): Promise<void> {
  const existing = document.getElementById(id);
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("No se pudo cargar Culqi.")), {
        once: true,
      });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("No se pudo cargar Culqi."));
    document.body.appendChild(script);
  });
}

function loadCulqiScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Culqi solo está disponible en el navegador."));
  }

  if (window.Culqi) {
    return Promise.resolve();
  }

  return loadScript(SCRIPT_3DS_ID, "https://3ds.culqi.com")
    .then(() => loadScript(SCRIPT_ID, "https://checkout.culqi.com/js/v4"))
    .then(() => {
      const publicKey = getPublicKey();
      if (window.Culqi3DS) {
        window.Culqi3DS.publicKey = publicKey;
      }
    });
}

export async function openCulqiCheckout(params: OpenCulqiCheckoutParams): Promise<string> {
  await loadCulqiScript();

  const publicKey = getPublicKey();

  return new Promise((resolve, reject) => {
    if (!window.Culqi) {
      reject(new Error("Culqi no está disponible."));
      return;
    }

    window.culqi = () => {
      if (window.Culqi?.token?.id) {
        window.Culqi.close();
        resolve(window.Culqi.token.id);
        return;
      }

      window.Culqi?.close?.();
      const message =
        window.Culqi?.error?.user_message ??
        window.Culqi?.error?.merchant_message ??
        "No pudimos procesar el pago.";
      reject(new Error(message));
    };

    window.Culqi.publicKey = publicKey;
    window.Culqi.settings({
      title: params.title ?? "Novedades Maritex",
      currency: "PEN",
      amount: params.amountInCentimos,
      order: params.culqiOrderId,
      email: params.email,
      xculqirsaid: params.rsaId,
      rsapublickey: params.rsaPublicKey,
    });
    window.Culqi.options({
      lang: "es",
      modal: true,
      paymentMethods: {
        tarjeta: true,
        yape: true,
        billetera: false,
        bancaMovil: false,
        agente: false,
        cuotealo: false,
      },
    });

    window.Culqi.open();
  });
}
