import Image from "next/image";
import Link from "next/link";

import { InstagramIcon } from "@/features/home/components/social-media/InstagramIcon";
import { TikTokIcon } from "@/features/home/components/social-media/TikTokIcon";
import type {
  HomeSocialMediaBanner,
  SocialMediaPlatform,
} from "@/features/home/types/home-social-media.types";

interface SocialMediaSlideProps {
  banner: HomeSocialMediaBanner;
  platform: SocialMediaPlatform;
}

export function SocialMediaSlide({ banner, platform }: SocialMediaSlideProps) {
  return (
    <div className="home-social-media-slide">
      <Link
        href={banner.href}
        target="_blank"
        rel="noopener noreferrer"
        className="home-social-media-box instagram-box"
      >
        <Image
          src={banner.imageUrl}
          alt=""
          width={400}
          height={400}
          sizes="(max-width: 599px) 33vw, (max-width: 1023px) 20vw, 16vw"
          className="home-social-media-box__image bg-img"
        />
        <div className="home-social-media-box__overlay overlay">
          {platform === "tiktok" ? (
            <TikTokIcon className="home-social-media-box__icon" />
          ) : (
            <InstagramIcon className="home-social-media-box__icon" />
          )}
        </div>
      </Link>
    </div>
  );
}
