import { HomeHeroSlider } from "@/features/home/components/hero/HomeHeroSlider";
import type { HomeHeroSlide } from "@/features/home/types/hero.types";

interface HomeHeroSectionProps {
  slides: HomeHeroSlide[];
}

export function HomeHeroSection({ slides }: HomeHeroSectionProps) {
  if (slides.length === 0) {
    return null;
  }

  return (
    <section className="layout-7 p-0">
      <div className="home-slider">
        <HomeHeroSlider slides={slides} />
      </div>
    </section>
  );
}
