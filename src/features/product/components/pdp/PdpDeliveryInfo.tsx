import { ArrowLeftRight, Truck } from "lucide-react";

import { PDP_COPY } from "@/features/product/constants/pdp-copy";

export function PdpDeliveryInfo() {
  return (
    <div className="bordered-box">
      <h4 className="sub-title">{PDP_COPY.deliveryTitle}</h4>
      <ul className="product-offer">
        <li>
          <Truck className="size-5 shrink-0" aria-hidden="true" />
          {PDP_COPY.estimatedDelivery}
        </li>
        <li>
          <ArrowLeftRight className="size-5 shrink-0" aria-hidden="true" />
          {PDP_COPY.returnPolicy}
        </li>
      </ul>
    </div>
  );
}
