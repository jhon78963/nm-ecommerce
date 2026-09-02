const apiBaseUrl = process.env.API_BASE_URL ?? "http://localhost:3000/api/v1";
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3012";

export const env = {
  apiBaseUrl,
  apiAccessToken: process.env.API_ACCESS_TOKEN,
  appUrl,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
} as const;
