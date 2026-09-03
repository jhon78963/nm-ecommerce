import { cookies } from "next/headers";

const ACCESS_TOKEN_KEY = "nm_customer_access_token";
const REFRESH_TOKEN_KEY = "nm_customer_refresh_token";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

export async function setCustomerAuthTokens(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_KEY, accessToken, cookieOptions);
  cookieStore.set(REFRESH_TOKEN_KEY, refreshToken, cookieOptions);
}

export async function clearCustomerAuthTokens() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_KEY);
  cookieStore.delete(REFRESH_TOKEN_KEY);
}

export async function getCustomerAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_KEY)?.value;
}

export async function getCustomerRefreshToken() {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_KEY)?.value;
}
