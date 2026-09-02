"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useState } from "react";

import type { HomeHeroSlide } from "@/features/home/types/hero.types";
import { HomeSliderSlide } from "@/features/home/components/HomeSliderSlide";

interface HomeHeroSliderProps {
  slides: HomeHeroSlide[];
}

export function HomeHeroSlider({ slides }: HomeHeroSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultipleSlides = slides.length > 1;

  const goToPrevious = useCallback(() => {
    setActiveIndex((current) => (current === 0 ? slides.length - 1 : current - 1));
  }, [slides.length]);

  const goToNext = useCallback(() => {
    setActiveIndex((current) => (current === slides.length - 1 ? 0 : current + 1));
  }, [slides.length]);

  if (slides.length === 0) {
    return null;
  }

  if (!hasMultipleSlides) {
    return (
      <div className="home-slide home">
        <HomeSliderSlide slide={slides[0]} priority />
      </div>
    );
  }

  return (
    <div className="home-slider-carousel group relative">
      <div
        className="home-slider-track flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={slide.id} className="home-slide home w-full shrink-0">
            <HomeSliderSlide slide={slide} priority={index === 0} />
          </div>
        ))}
      </div>

      <button
        type="button"
        className="home-slider-nav home-slider-nav-prev"
        onClick={goToPrevious}
        aria-label="Slide anterior"
      >
        <ChevronLeft className="size-4" strokeWidth={2.5} />
      </button>

      <button
        type="button"
        className="home-slider-nav home-slider-nav-next"
        onClick={goToNext}
        aria-label="Slide siguiente"
      >
        <ChevronRight className="size-4" strokeWidth={2.5} />
      </button>
    </div>
  );
}
