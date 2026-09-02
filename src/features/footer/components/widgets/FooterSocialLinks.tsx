import { InstagramIcon } from "@/features/home/components/social-media/InstagramIcon";
import type { StoreFooterConfig } from "@/features/footer/types/footer.types";

interface FooterSocialLinksProps {
  config: Pick<
    StoreFooterConfig,
    | "socialMediaEnabled"
    | "facebookUrl"
    | "twitterUrl"
    | "instagramUrl"
    | "pinterestUrl"
    | "tiktokUrl"
  >;
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.07 2.44 7.56 5.94 9.1-.08-.78-.15-1.98.03-2.83.17-.72 1.1-4.59 1.1-4.59s-.28-.56-.28-1.39c0-1.3.75-2.27 1.69-2.27.8 0 1.18.6 1.18 1.32 0 .8-.51 2-.78 3.11-.22.93.47 1.69 1.39 1.69 1.67 0 2.95-1.76 2.95-4.3 0-2.25-1.62-3.82-3.93-3.82-2.68 0-4.25 2.01-4.25 4.09 0 .81.31 1.68.7 2.15.08.09.09.17.07.26-.07.29-.23.92-.26 1.05-.04.17-.13.21-.3.13-1.12-.52-1.82-2.15-1.82-3.46 0-2.82 2.05-5.41 5.91-5.41 3.1 0 5.52 2.21 5.52 5.16 0 3.08-1.94 5.56-4.64 5.56-.91 0-1.76-.47-2.05-1.03l-.56 2.14c-.2.79-.75 1.78-1.12 2.38.84.26 1.73.4 2.65.4 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function FooterSocialLinks({ config }: FooterSocialLinksProps) {
  if (!config.socialMediaEnabled) {
    return null;
  }

  const links = [
    { id: "facebook", href: config.facebookUrl, label: "Facebook", icon: FacebookIcon },
    { id: "twitter", href: config.twitterUrl, label: "X", icon: XIcon },
    { id: "instagram", href: config.instagramUrl, label: "Instagram", icon: InstagramIcon },
    { id: "pinterest", href: config.pinterestUrl, label: "Pinterest", icon: PinterestIcon },
  ].filter((link) => Boolean(link.href));

  if (links.length === 0) {
    return null;
  }

  return (
    <div className="footer-social">
      <ul>
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <li key={link.id}>
              <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
                <Icon className="footer-social__icon" />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
