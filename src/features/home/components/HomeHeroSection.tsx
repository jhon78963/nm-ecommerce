import { DEFAULT_HOME_HERO_SLIDES } from "@/features/home/constants/home-hero.defaults";
import { HomeHeroSlider } from "@/features/home/components/HomeHeroSlider";

export function HomeHeroSection() {
  return (
    <section className="layout-7 p-0">
      <div className="home-slider">
        <HomeHeroSlider slides={DEFAULT_HOME_HERO_SLIDES} />
      </div>
    </section>
  );
}
