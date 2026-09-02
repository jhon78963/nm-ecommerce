"use client";

import { useEffect } from "react";

interface InstitutionalHtmlContentProps {
  html: string;
  slug: string;
}

function bindInstitutionalForms(root: HTMLElement) {
  const contactForm = root.querySelector<HTMLFormElement>("#nm-contact-form");
  if (contactForm && !contactForm.dataset.bound) {
    contactForm.dataset.bound = "true";
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const message = root.querySelector<HTMLElement>("#nm-contact-msg");
      if (message) {
        message.hidden = false;
        message.textContent =
          "Gracias por escribirnos. Te responderemos a la brevedad en el correo indicado.";
        message.classList.add("nm-inst-contact-form__msg--success");
      }
      contactForm.reset();
    });
  }

  const libroForm = root.querySelector<HTMLFormElement>("#nm-libro-form");
  if (libroForm && !libroForm.dataset.bound) {
    libroForm.dataset.bound = "true";
    libroForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const message = root.querySelector<HTMLElement>("#nm-libro-msg");
      if (message) {
        message.hidden = false;
        message.textContent =
          "Tu reclamo o queja fue registrado. Conserva este comprobante y te responderemos en un plazo máximo de 15 días hábiles.";
        message.classList.add("nm-libro-form__msg--success");
      }
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
