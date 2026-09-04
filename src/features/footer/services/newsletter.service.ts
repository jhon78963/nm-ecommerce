import { apiPost } from "@/services/http-client";

export interface SubscribeNewsletterResponse {
  success: boolean;
  alreadySubscribed?: boolean;
  message: string;
}

export async function subscribeToNewsletter(email: string): Promise<SubscribeNewsletterResponse> {
  return apiPost<SubscribeNewsletterResponse>("ecommerce/newsletter/subscribe", {
    email,
    source: "footer",
  });
}
