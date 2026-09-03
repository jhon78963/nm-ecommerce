import { cookies } from "next/headers";

const ACCESS_TOKEN_KEY = "nm_customer_access_token";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

export async function setCustomerAccessToken(accessToken: string) {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_KEY, accessToken, cookieOptions);
}

export async function clearCustomerAccessToken() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_KEY);
}

export async function getCustomerAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_KEY)?.value;
}
