import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

function readLookupParams(source: URLSearchParams) {
  return {
    orderNumber: source.get("order_number") ?? "",
    emailOrPhone: source.get("email_or_phone") ?? "",
    email: source.get("email") ?? "",
  };
}

/** Resolves order lookup params even when useSearchParams lags after client navigation. */
export function useOrderLookupParams() {
  const searchParams = useSearchParams();

  return useMemo(() => {
    const fromHook = readLookupParams(searchParams);

    if (typeof window === "undefined") {
      return fromHook;
    }

    const fromLocation = readLookupParams(new URLSearchParams(window.location.search));

    return {
      orderNumber: fromHook.orderNumber || fromLocation.orderNumber,
      emailOrPhone: fromHook.emailOrPhone || fromLocation.emailOrPhone,
      email: fromHook.email || fromLocation.email,
    };
  }, [searchParams]);
}
