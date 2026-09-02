import Image from "next/image";
import Link from "next/link";

import type { HomeHeroSlide } from "@/features/home/constants/home-hero.defaults";

interface HomeSliderSlideProps {
  slide: HomeHeroSlide;
  priority?: boolean;
}

function isExternalHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

export function HomeSliderSlide({ slide, priority = false }: HomeSliderSlideProps) {
  const image = (
    <Image
      src={slide.imageUrl}
      alt={slide.alt}
      fill
      priority={priority}
      sizes="100vw"
      className="home-slide-img object-cover"
    />
  );

  if (isExternalHref(slide.href)) {
    return (
      <a
        href={slide.href}
        target="_blank"
        rel="noopener noreferrer"
        className="home-slide-link block h-full w-full"
      >
        {image}
      </a>
    );
  }

  return (
    <Link href={slide.href} className="home-slide-link block h-full w-full">
      {image}
    </Link>
  );
}
