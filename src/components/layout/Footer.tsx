import { FooterOne } from "@/features/footer/components/FooterOne";
import { getStoreFooterConfig } from "@/features/footer/services/footer.service";

export async function Footer() {
  const config = await getStoreFooterConfig();

  return <FooterOne config={config} />;
}
