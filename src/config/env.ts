function readEnv(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim() !== "" ? value : undefined;
}

export const env = {
  get apiBaseUrl(): string {
    return readEnv("API_BASE_URL") ?? "http://localhost:3000/api/v1";
  },
  get apiAccessToken(): string | undefined {
    return readEnv("API_ACCESS_TOKEN");
  },
  get storeWarehouseId(): string | undefined {
    return readEnv("STORE_WAREHOUSE_ID");
  },
  get appUrl(): string {
    return readEnv("NEXT_PUBLIC_APP_URL") ?? "http://localhost:3012";
  },
  get googleClientId(): string | undefined {
    return readEnv("GOOGLE_CLIENT_ID");
  },
  get googleClientSecret(): string | undefined {
    return readEnv("GOOGLE_CLIENT_SECRET");
  },
} as const;
