"use client";

import { SocialMediaSlide } from "@/features/home/components/social-media/SocialMediaSlide";
import type { HomeSocialMediaConfig } from "@/features/home/types/home-social-media.types";

import "./home-social-media.css";

interface ThemeSocialMediaProps {
  config: HomeSocialMediaConfig;
}

export function ThemeSocialMedia({ config }: ThemeSocialMediaProps) {
  return (
    <div className="home-social-media container-fluid">
      <h2 className="title-borderless">{config.title}</h2>

      <div className="home-social-media-carousel slide-7">
        <div className="home-social-media-track">
          {config.banners.map((banner) => (
            <SocialMediaSlide key={banner.id} banner={banner} platform={config.platform} />
          ))}
        </div>
      </div>
    </div>
  );
}
