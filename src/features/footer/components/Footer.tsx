import { FooterAbout } from "@/features/footer/components/widgets/FooterAbout";
import { FooterAccordionSection } from "@/features/footer/components/widgets/FooterAccordionSection";
import { FooterCategories } from "@/features/footer/components/widgets/FooterCategories";
import { FooterContact } from "@/features/footer/components/widgets/FooterContact";
import { FooterCopyright } from "@/features/footer/components/widgets/FooterCopyright";
import { FooterLinks } from "@/features/footer/components/widgets/FooterLinks";
import { FooterLogo } from "@/features/footer/components/widgets/FooterLogo";
import { FooterNewsletter } from "@/features/footer/components/widgets/FooterNewsletter";
import { FooterPaymentOptions } from "@/features/footer/components/widgets/FooterPaymentOptions";
import { FooterSocialLinks } from "@/features/footer/components/widgets/FooterSocialLinks";
import { getStoreFooterConfig } from "@/features/footer/services/footer.service";

import "./footer.css";

export async function Footer() {
  const config = await getStoreFooterConfig();

  return (
    <footer className="site-footer footer-light">
      <FooterNewsletter title={config.newsletterTitle} subtitle={config.newsletterSubtitle} />

      <section className="section-b-space light-layout">
        <div className="container">
          <div className="footer-theme footer-theme-row">
            <div className="footer-col footer-col--brand">
              <div className="footer-content footer-content--static h-auto">
                <FooterLogo />
                <FooterAbout text={config.aboutText} />
                <FooterSocialLinks config={config} />
              </div>
            </div>

            <div className="footer-col footer-col--categories">
              <FooterAccordionSection title="Categories">
                <FooterCategories categories={config.categories} />
              </FooterAccordionSection>
            </div>

            <div className="footer-col footer-col--useful">
              <FooterAccordionSection title="Useful Links">
                <FooterLinks links={config.usefulLinks} />
              </FooterAccordionSection>
            </div>

            <div className="footer-col footer-col--help">
              <FooterAccordionSection title="Help Center">
                <FooterLinks links={config.helpCenterLinks} />
              </FooterAccordionSection>
            </div>

            <div className="footer-col footer-col--contact">
              <FooterAccordionSection title="Store Information">
                <FooterContact
                  address={config.address}
                  supportNumber={config.supportNumber}
                  supportEmail={config.supportEmail}
                />
              </FooterAccordionSection>
            </div>
          </div>
        </div>
      </section>

      <div className="sub-footer">
        <div className="container">
          <div className="sub-footer-row">
            {config.copyrightEnabled ? (
              <div className="sub-footer-col sub-footer-col--copyright">
                <FooterCopyright content={config.copyrightContent} />
              </div>
            ) : null}
            {config.paymentImageUrl ? (
              <div className="sub-footer-col sub-footer-col--payments">
                <FooterPaymentOptions imageUrl={config.paymentImageUrl} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
