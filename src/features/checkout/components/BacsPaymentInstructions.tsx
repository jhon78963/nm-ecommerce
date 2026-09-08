"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { env } from "@/config/env";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { formatPrice } from "@/features/cart/utils/format-price";
import { CHECKOUT_COPY } from "@/features/checkout/constants/checkout-copy";
import { buildWhatsAppOrderVoucherUrl } from "@/features/checkout/utils/build-whatsapp-order-voucher";
import {
  formatYapePhoneForCopy,
  formatYapePhoneForDisplay,
} from "@/features/checkout/utils/format-yape-phone";

interface BacsPaymentInstructionsProps {
  orderNumber: string;
  total: number;
}

export function BacsPaymentInstructions({ orderNumber, total }: BacsPaymentInstructionsProps) {
  const [copied, setCopied] = useState(false);
  const [qrVisible, setQrVisible] = useState(true);
  const totalLabel = formatPrice(total);
  const yapePhoneDisplay = formatYapePhoneForDisplay(env.yapePhone);
  const yapePhoneCopy = formatYapePhoneForCopy(env.yapePhone);
  const whatsappUrl = buildWhatsAppOrderVoucherUrl({ orderNumber, totalLabel });

  async function copyYapeNumber() {
    try {
      await navigator.clipboard.writeText(yapePhoneCopy);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="bacs-payment">
      <p className="bacs-payment__intro">{CHECKOUT_COPY.bacsPaymentIntro}</p>

      <div className="bacs-payment__amount">
        <span>{CHECKOUT_COPY.bacsPaymentAmountLabel}</span>
        <strong>{totalLabel}</strong>
      </div>

      <div className="bacs-payment__reference">
        <span>{CHECKOUT_COPY.bacsPaymentReferenceLabel}</span>
        <strong>#{orderNumber}</strong>
      </div>

      {qrVisible ? (
        <div className="bacs-payment__qr">
          <Image
            src={env.yapeQrImageUrl}
            alt={CHECKOUT_COPY.bacsPaymentQrAlt}
            width={260}
            height={320}
            className="bacs-payment__qr-image"
            unoptimized
            onError={() => setQrVisible(false)}
          />
          <p className="bacs-payment__merchant-name">{env.yapeMerchantName}</p>
          <p className="bacs-payment__qr-caption">{CHECKOUT_COPY.bacsPaymentQrCaption}</p>
        </div>
      ) : (
        <p className="bacs-payment__qr-fallback">{CHECKOUT_COPY.bacsPaymentQrFallback}</p>
      )}

      <div className="bacs-payment__yape-number">
        <span>{CHECKOUT_COPY.bacsPaymentYapeNumberLabel}</span>
        <div className="bacs-payment__yape-row">
          <strong>{yapePhoneDisplay}</strong>
          <button type="button" className="bacs-payment__copy-btn" onClick={copyYapeNumber}>
            {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
            {copied ? CHECKOUT_COPY.bacsPaymentCopied : CHECKOUT_COPY.bacsPaymentCopy}
          </button>
        </div>
      </div>

      <ol className="bacs-payment__steps">
        {CHECKOUT_COPY.bacsPaymentSteps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bacs-payment__whatsapp-btn"
      >
        <WhatsAppIcon className="size-5" />
        {CHECKOUT_COPY.bacsPaymentWhatsAppButton}
      </a>

      <p className="bacs-payment__note">{CHECKOUT_COPY.bacsPaymentPendingNote}</p>
    </div>
  );
}
