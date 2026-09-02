import { ThemeSocialMedia } from "@/features/home/components/social-media/ThemeSocialMedia";
import type { HomeSocialMediaConfig } from "@/features/home/types/home-social-media.types";

interface HomeSocialMediaSectionProps {
  socialMedia: HomeSocialMediaConfig | null;
}

export function HomeSocialMediaSection({ socialMedia }: HomeSocialMediaSectionProps) {
  if (!socialMedia || socialMedia.banners.length === 0) {
    return null;
  }

  return (
    <section className="home-social-media-section instagram ratio_square">
      <ThemeSocialMedia config={socialMedia} />
    </section>
  );
}
