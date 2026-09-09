"use client";

import { useEffect } from "react";

import {
  buildWholesaleQuoteWhatsAppUrl,
  type WholesaleQuoteWhatsAppInput,
} from "@/features/institutional/utils/build-whatsapp-wholesale-quote";

interface InstitutionalHtmlContentProps {
  html: string;
  slug: string;
}

async function submitJson(path: string, payload: unknown) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = (await response.json().catch(() => ({}))) as {
    message?: string;
    error?: string;
    receiptNumber?: string;
    quoteNumber?: string;
  };
  if (!response.ok) {
    throw new Error(body.error ?? "No pudimos procesar tu solicitud.");
  }
  return body;
}

function readWholesaleFormInput(form: HTMLFormElement): WholesaleQuoteWhatsAppInput {
  const formData = new FormData(form);

  return {
    businessName: String(formData.get("nm_wholesale_business") ?? ""),
    contactName: String(formData.get("nm_wholesale_contact") ?? ""),
    phone: String(formData.get("nm_wholesale_phone") ?? ""),
    city: String(formData.get("nm_wholesale_city") ?? ""),
    businessType: String(formData.get("nm_wholesale_business_type") ?? ""),
    productLines: String(formData.get("nm_wholesale_lines") ?? "") || undefined,
    estimatedUnits: String(formData.get("nm_wholesale_units") ?? "") || undefined,
    message: String(formData.get("nm_wholesale_message") ?? ""),
  };
}

function syncWholesaleWhatsAppLinks(root: HTMLElement, input: WholesaleQuoteWhatsAppInput) {
  const href = buildWholesaleQuoteWhatsAppUrl(input);

  for (const selector of [
    "#nm-wholesale-whatsapp-link",
    "#nm-wholesale-whatsapp-form-link",
    "#nm-wholesale-whatsapp-cta",
  ]) {
    const link = root.querySelector<HTMLAnchorElement>(selector);
    if (link) {
      link.href = href;
    }
  }
}

function bindInstitutionalForms(root: HTMLElement) {
  const contactForm = root.querySelector<HTMLFormElement>("#nm-contact-form");
  if (contactForm && !contactForm.dataset.bound) {
    contactForm.dataset.bound = "true";
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const message = root.querySelector<HTMLElement>("#nm-contact-msg");
      const formData = new FormData(contactForm);

      void submitJson("/api/institutional/contact", {
        name: String(formData.get("nm_contact_name") ?? ""),
        email: String(formData.get("nm_contact_email") ?? ""),
        phone: String(formData.get("nm_contact_phone") ?? "") || undefined,
        subject: String(formData.get("nm_contact_subject") ?? ""),
        message: String(formData.get("nm_contact_message") ?? ""),
      })
        .then((result) => {
          if (message) {
            message.hidden = false;
            message.textContent = result.message ?? "Mensaje enviado.";
            message.classList.add("nm-inst-contact-form__msg--success");
          }
          contactForm.reset();
        })
        .catch((error: unknown) => {
          if (message) {
            message.hidden = false;
            message.textContent =
              error instanceof Error ? error.message : "No pudimos enviar tu mensaje.";
            message.classList.remove("nm-inst-contact-form__msg--success");
          }
        });
    });
  }

  const wholesaleForm = root.querySelector<HTMLFormElement>("#nm-wholesale-quote-form");
  if (wholesaleForm && !wholesaleForm.dataset.bound) {
    wholesaleForm.dataset.bound = "true";

    const refreshWhatsappLinks = () => {
      syncWholesaleWhatsAppLinks(root, readWholesaleFormInput(wholesaleForm));
    };

    refreshWhatsappLinks();
    wholesaleForm.addEventListener("input", refreshWhatsappLinks);

    wholesaleForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const message = root.querySelector<HTMLElement>("#nm-wholesale-msg");
      const formData = new FormData(wholesaleForm);
      const whatsappInput = readWholesaleFormInput(wholesaleForm);

      void submitJson("/api/institutional/wholesale-quote", {
        businessName: String(formData.get("nm_wholesale_business") ?? ""),
        contactName: String(formData.get("nm_wholesale_contact") ?? ""),
        email: String(formData.get("nm_wholesale_email") ?? ""),
        phone: String(formData.get("nm_wholesale_phone") ?? ""),
        city: String(formData.get("nm_wholesale_city") ?? ""),
        businessType: String(formData.get("nm_wholesale_business_type") ?? ""),
        productLines: String(formData.get("nm_wholesale_lines") ?? "") || undefined,
        estimatedUnits: String(formData.get("nm_wholesale_units") ?? "") || undefined,
        message: String(formData.get("nm_wholesale_message") ?? ""),
      })
        .then((result) => {
          const quoteNumber =
            typeof result.quoteNumber === "string" ? result.quoteNumber : undefined;

          if (message) {
            message.hidden = false;
            message.textContent = quoteNumber
              ? `${result.message ?? "Solicitud registrada."} Referencia: ${quoteNumber}.`
              : (result.message ?? "Solicitud registrada.");
            message.classList.add("nm-inst-contact-form__msg--success");
          }

          syncWholesaleWhatsAppLinks(root, {
            ...whatsappInput,
            quoteNumber,
          });
        })
        .catch((error: unknown) => {
          if (message) {
            message.hidden = false;
            message.textContent =
              error instanceof Error ? error.message : "No pudimos registrar tu solicitud.";
            message.classList.remove("nm-inst-contact-form__msg--success");
          }
        });
    });
  } else if (root.querySelector("#nm-wholesale-whatsapp-link")) {
    syncWholesaleWhatsAppLinks(root, {});
  }

  const libroForm = root.querySelector<HTMLFormElement>("#nm-libro-form");
  if (libroForm && !libroForm.dataset.bound) {
    libroForm.dataset.bound = "true";
    libroForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const message = root.querySelector<HTMLElement>("#nm-libro-msg");
      const receipt = root.querySelector<HTMLElement>("#nm-libro-receipt");
      const receiptContent = root.querySelector<HTMLElement>("#nm-libro-receipt-content");
      const formData = new FormData(libroForm);
      const tipo = String(formData.get("nm_libro_tipo") ?? "");

      void submitJson("/api/institutional/libro-reclamaciones", {
        tipo,
        nombre: String(formData.get("nm_libro_nombre") ?? ""),
        documento: String(formData.get("nm_libro_documento") ?? ""),
        domicilio: String(formData.get("nm_libro_domicilio") ?? ""),
        telefono: String(formData.get("nm_libro_telefono") ?? ""),
        email: String(formData.get("nm_libro_email") ?? ""),
        producto: String(formData.get("nm_libro_producto") ?? ""),
        monto: String(formData.get("nm_libro_monto") ?? "") || undefined,
        detalle: String(formData.get("nm_libro_detalle") ?? ""),
        pedido: String(formData.get("nm_libro_pedido") ?? ""),
        conforme: formData.get("nm_libro_conforme") === "on",
      })
        .then((result) => {
          if (message) {
            message.hidden = false;
            message.textContent = result.message ?? "Registro completado.";
            message.classList.add("nm-libro-form__msg--success");
          }
          if (receipt && receiptContent && result.receiptNumber) {
            receiptContent.innerHTML = `
              <p><strong>N° de registro:</strong> ${result.receiptNumber}</p>
              <p>Conserva este número como comprobante de tu ${tipo === "queja" ? "queja" : "reclamo"}.</p>
            `;
            receipt.hidden = false;
          }
        })
        .catch((error: unknown) => {
          if (message) {
            message.hidden = false;
            message.textContent =
              error instanceof Error ? error.message : "No pudimos registrar tu reclamo.";
            message.classList.remove("nm-libro-form__msg--success");
          }
        });
    });
  }
}

export function InstitutionalHtmlContent({ html, slug }: InstitutionalHtmlContentProps) {
  useEffect(() => {
    const root = document.getElementById(`nm-institucional-${slug}`);
    if (root) {
      bindInstitutionalForms(root);
    }
  }, [html, slug]);

  return (
    <main
      id={`nm-institucional-${slug}`}
      className={`nm-institucional nm-institucional--${slug}`}
      role="main"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
