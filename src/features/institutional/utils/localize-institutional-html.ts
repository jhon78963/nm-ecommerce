import { SUPPORT_EMAIL } from "@/features/institutional/constants/support-contact";

const WORDPRESS_ORIGINS = [
  "https://novedadesmaritex.net.pe",
  "https://tienda.novedadesmaritex.net.pe",
  "http://novedadesmaritex.net.pe",
  "http://tienda.novedadesmaritex.net.pe",
];

const CLOUDFLARE_EMAIL_LINK =
  /<a href="\/cdn-cgi\/l\/email-protection[^"]*">[\s\S]*?<\/a>/g;

export function localizeInstitutionalHtml(html: string): string {
  let localized = html;

  for (const origin of WORDPRESS_ORIGINS) {
    localized = localized.replaceAll(`${origin}/`, "/");
  }

  return localized
    .replace(/^\s*<main[^>]*>/, "")
    .replace(/<\/main>\s*$/, "")
    .replace(/<input type="hidden"[^>]*>/g, "")
    .replace(
      CLOUDFLARE_EMAIL_LINK,
      `<a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>`,
    )
    .trim();
}
