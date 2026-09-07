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

export class CulqiCheckoutCancelledError extends Error {
  constructor(
    message = "Cancelaste el pago. Tu pedido fue anulado y puedes intentarlo de nuevo.",
  ) {
    super(message);
    this.name = "CulqiCheckoutCancelledError";
  }
}

function isCulqiModalOpen(): boolean {
  const overlay = document.getElementById("culqi-js");
  if (overlay) {
    const style = window.getComputedStyle(overlay);
    if (style.display !== "none" && style.visibility !== "hidden") {
      return true;
    }
  }

  const checkout = document.querySelector(".culqi_checkout");
  if (!checkout) {
    return false;
  }

  const style = window.getComputedStyle(checkout);
  return style.display !== "none" && style.visibility !== "hidden";
}

function watchCulqiModalDismiss(onDismiss: () => void): () => void {
  let modalWasOpen = false;

  const check = () => {
    if (isCulqiModalOpen()) {
      modalWasOpen = true;
      return;
    }

    if (modalWasOpen) {
      cleanup();
      onDismiss();
    }
  };

  const intervalId = window.setInterval(check, 250);
  const observer = new MutationObserver(check);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["style", "class", "hidden"],
  });

  const cleanup = () => {
    window.clearInterval(intervalId);
    observer.disconnect();
  };

  return cleanup;
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

function resolveCulqiLogoUrl(): string {
  const configured = process.env.NEXT_PUBLIC_CULQI_LOGO_URL?.trim();
  if (configured) {
    return configured;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");
  if (appUrl) {
    return `${appUrl}/logo.png`;
  }

  return "https://novedadesmaritex.net.pe/logo.png";
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

    let settled = false;
    let stopWatching: (() => void) | null = null;

    const settle = (handler: () => void) => {
      if (settled) return;
      settled = true;
      stopWatching?.();
      handler();
    };

    stopWatching = watchCulqiModalDismiss(() => {
      settle(() => reject(new CulqiCheckoutCancelledError()));
    });

    window.culqi = () => {
      const tokenId = window.Culqi?.token?.id;
      if (tokenId) {
        window.Culqi?.close?.();
        settle(() => resolve(tokenId));
        return;
      }

      window.Culqi?.close?.();
      const message =
        window.Culqi?.error?.user_message ??
        window.Culqi?.error?.merchant_message ??
        "No pudimos procesar el pago.";
      settle(() => reject(new Error(message)));
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
      style: {
        logo: resolveCulqiLogoUrl(),
      },
    });

    window.Culqi.open();
  });
}
