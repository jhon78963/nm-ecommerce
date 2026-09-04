"use client";

import { useState, type FormEvent } from "react";

import { subscribeToNewsletter } from "@/features/footer/services/newsletter.service";
import type { StoreFooterConfig } from "@/features/footer/types/footer.types";

interface FooterNewsletterProps {
  title: StoreFooterConfig["newsletterTitle"];
  subtitle: StoreFooterConfig["newsletterSubtitle"];
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NEWSLETTER_COPY = {
  emailPlaceholder: "Ingresa tu correo electrónico",
  submit: "Suscribirse",
  submitting: "Enviando...",
  success: "¡Gracias por suscribirte!",
  emailRequired: "El correo es obligatorio.",
  emailInvalid: "Correo electrónico inválido.",
  submitError: "No pudimos completar tu suscripción. Intenta nuevamente.",
} as const;

export function FooterNewsletter({ title, subtitle }: FooterNewsletterProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    setError(null);

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError(NEWSLETTER_COPY.emailRequired);
      return;
    }

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setError(NEWSLETTER_COPY.emailInvalid);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await subscribeToNewsletter(trimmedEmail);
      setIsSubmitted(true);
      setSuccessMessage(response.message);
      setEmail("");
    } catch {
      setError(NEWSLETTER_COPY.submitError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="light-layout">
      <div className="container">
        <section className="small-section border-section border-top-0">
          <div className="footer-newsletter-row">
            <div className="footer-newsletter-col">
              <div className="subscribe">
                <div>
                  <h4>{title}</h4>
                  <p>{subtitle}</p>
                  {isSubmitted && successMessage ? (
                    <p className="footer-newsletter-success">{successMessage}</p>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="footer-newsletter-col">
              <form className="subscribe-form" onSubmit={handleSubmit} noValidate>
                <div className="subscribe-form__fields">
                  <div className="form-group">
                    <input
                      type="email"
                      className="form-control"
                      placeholder={NEWSLETTER_COPY.emailPlaceholder}
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        if (error) {
                          setError(null);
                        }
                        if (isSubmitted) {
                          setIsSubmitted(false);
                          setSuccessMessage(null);
                        }
                      }}
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? "footer-newsletter-error" : undefined}
                    />
                  </div>
                  <button type="submit" className="btn-solid" disabled={isSubmitting}>
                    {isSubmitting ? NEWSLETTER_COPY.submitting : NEWSLETTER_COPY.submit}
                  </button>
                </div>
                {error ? (
                  <span id="footer-newsletter-error" className="invalid-feedback" role="alert">
                    {error}
                  </span>
                ) : null}
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
