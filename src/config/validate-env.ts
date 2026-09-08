function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

interface EnvRule {
  name: string;
  requiredInProduction?: boolean;
  requiredAlways?: boolean;
}

const ENV_RULES: EnvRule[] = [
  { name: "STORE_WAREHOUSE_ID", requiredAlways: true },
  { name: "API_BASE_URL", requiredInProduction: true },
  { name: "ECOMMERCE_SERVICE_URL", requiredInProduction: true },
  { name: "NEXT_PUBLIC_APP_URL", requiredInProduction: true },
];

export function validateEnv(): void {
  const missingAlways: string[] = [];
  const missingProduction: string[] = [];

  for (const rule of ENV_RULES) {
    if (rule.requiredAlways && !readEnv(rule.name)) {
      missingAlways.push(rule.name);
    }

    if (rule.requiredInProduction && isProduction() && !readEnv(rule.name)) {
      missingProduction.push(rule.name);
    }
  }

  const missing = [...missingAlways, ...missingProduction.filter((name) => !missingAlways.includes(name))];

  if (missing.length === 0) {
    return;
  }

  const message = [
    "[nm-ecommerce] Variables de entorno faltantes:",
    ...missing.map((name) => `  - ${name}`),
    "",
    "Consulta .env.example y configura .env.local antes de continuar.",
  ].join("\n");

  if (isProduction() || missingAlways.length > 0) {
    throw new Error(message);
  }

  console.warn(message);
}
