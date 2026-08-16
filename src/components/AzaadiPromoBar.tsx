import { AZAADI } from "@/lib/azaadi";
import { CrescentStar } from "@/components/CrescentStar";

export const AzaadiPromoBar = () => {
  const items = [...AZAADI.promoItems, ...AZAADI.promoItems, ...AZAADI.promoItems];

  return (
    <div
      className="h-[46px] md:h-[52px] overflow-hidden text-[#fafaf8] border-b border-[#fafaf8]/10"
      style={{
        backgroundColor: AZAADI.green,
        backgroundImage: AZAADI.stripe,
      }}
    >
      <div className="flex h-full whitespace-nowrap">
        <div className="marquee-fast flex items-center h-full">
          {items.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="mx-5 md:mx-8 text-sm md:text-lg font-display tracking-[0.15em] flex items-center gap-5 md:gap-8"
            >
              {item}
              <CrescentStar className="w-4 h-4 md:w-5 md:h-5 text-[#fafaf8]/60" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
