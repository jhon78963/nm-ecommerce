import type { ProductCollectionConfig } from "@/features/home/types/collection.types";

interface CollectionSectionTitleProps {
  config: ProductCollectionConfig;
}

export function CollectionSectionTitle({ config }: CollectionSectionTitleProps) {
  return (
    <>
      <div className="pt-[clamp(45px,5vw,70px)] text-center">
        {config.tag ? (
          <h4 className="mt-0 mb-0 pb-2.5 text-lg leading-none font-normal tracking-[0.03em] text-theme capitalize max-sm:mt-0 md:-mt-[3px]">
            {config.tag}
          </h4>
        ) : null}
        <h2 className="relative mt-0 mb-[30px] pb-2.5 text-[32px] leading-none font-bold tracking-[0.02em] text-[#222] uppercase after:absolute after:right-0 after:bottom-0 after:left-0 after:mx-auto after:h-0.5 after:w-[70px] after:bg-theme after:content-[''] min-[1368px]:pb-[15px] min-[1368px]:text-4xl min-[1368px]:after:h-[5px]">
          {config.title}
        </h2>
      </div>

      {config.description ? (
        <div className="mx-auto w-full max-w-[1400px] px-[15px]">
          <div className="mx-auto w-full lg:w-1/2">
            <p className="mb-0 pb-[clamp(10px,2vw,30px)] text-center text-[clamp(14px,1.5vw,16px)] leading-[1.6] text-[#777]">
              {config.description}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
