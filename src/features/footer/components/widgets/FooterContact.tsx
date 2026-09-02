import { Mail, MapPin, Phone } from "lucide-react";

import type { StoreFooterConfig } from "@/features/footer/types/footer.types";

interface FooterContactProps {
  address: StoreFooterConfig["address"];
  supportNumber: StoreFooterConfig["supportNumber"];
  supportEmail: StoreFooterConfig["supportEmail"];
}

export function FooterContact({ address, supportNumber, supportEmail }: FooterContactProps) {
  return (
    <ul className="contact-list">
      {address ? (
        <li>
          <MapPin className="contact-list__icon" aria-hidden="true" />
          {address}
        </li>
      ) : null}
      {supportNumber ? (
        <li>
          <Phone className="contact-list__icon" aria-hidden="true" />
          Call Us: {supportNumber}
        </li>
      ) : null}
      {supportEmail ? (
        <li>
          <Mail className="contact-list__icon" aria-hidden="true" />
          Email Us: {supportEmail}
        </li>
      ) : null}
    </ul>
  );
}
