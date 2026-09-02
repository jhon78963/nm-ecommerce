import Image, { type ImageProps } from "next/image";

import { resolveStoreMediaUrl } from "@/utils/resolve-store-media-url";

type StoreImageProps = Omit<ImageProps, "src"> & {
  src: string | null | undefined;
};

export function StoreImage({ src, alt = "", ...props }: StoreImageProps) {
  const resolvedSrc = resolveStoreMediaUrl(src) || "/placeholder-product.svg";

  return <Image {...props} src={resolvedSrc} alt={alt} />;
}
