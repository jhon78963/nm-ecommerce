"use client";

import type { FormEvent } from "react";

import { RECAPTCHA_ACTIONS } from "@/lib/recaptcha/constants";
import { executeRecaptcha } from "@/lib/recaptcha/client";

export async function appendRecaptchaToken(
  formData: FormData,
  action: (typeof RECAPTCHA_ACTIONS)[keyof typeof RECAPTCHA_ACTIONS],
): Promise<FormData> {
  const token = await executeRecaptcha(action);
  if (token) {
    formData.set("captchaToken", token);
  }
  return formData;
}

export async function handleFormWithRecaptcha(
  event: FormEvent<HTMLFormElement>,
  action: (typeof RECAPTCHA_ACTIONS)[keyof typeof RECAPTCHA_ACTIONS],
  submit: (formData: FormData) => void,
  onError?: (message: string) => void,
) {
  event.preventDefault();
  const form = event.currentTarget;

  try {
    const formData = await appendRecaptchaToken(new FormData(form), action);
    submit(formData);
  } catch {
    onError?.("No pudimos verificar la seguridad del formulario. Intenta de nuevo.");
  }
}
