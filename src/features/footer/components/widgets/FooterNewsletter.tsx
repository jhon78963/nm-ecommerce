"use client";

import { useState, type FormEvent } from "react";

import type { StoreFooterConfig } from "@/features/footer/types/footer.types";

interface FooterNewsletterProps {
  title: StoreFooterConfig["newsletterTitle"];
  subtitle: StoreFooterConfig["newsletterSubtitle"];
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function FooterNewsletter({ title, subtitle }: FooterNewsletterProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    setError(null);

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Email is required.");
      return;
    }

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setError("Invalid email.");
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      setIsSubmitted(true);
      setEmail("");
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
                  {isSubmitted ? (
                    <p className="footer-newsletter-success">Thanks for subscribing!</p>
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
                      placeholder="Enter Email Address"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        if (error) {
                          setError(null);
                        }
                        if (isSubmitted) {
                          setIsSubmitted(false);
                        }
                      }}
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? "footer-newsletter-error" : undefined}
                    />
                  </div>
                  <button type="submit" className="btn-solid" disabled={isSubmitting}>
                    {isSubmitting ? "..." : "Subscribe"}
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
