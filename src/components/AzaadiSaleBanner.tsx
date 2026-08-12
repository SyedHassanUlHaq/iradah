import { AZAADI } from "@/lib/azaadi";
import { CrescentStar } from "@/components/CrescentStar";

export const AzaadiSaleBanner = () => {
  return (
    <section
      className="relative text-[#fafaf8] py-12 md:py-20 overflow-hidden"
      style={{
        backgroundColor: AZAADI.green,
        backgroundImage: AZAADI.stripe,
      }}
    >
      <span
        className="font-display absolute inset-0 flex items-center justify-center leading-none opacity-[0.07] pointer-events-none select-none whitespace-nowrap"
        style={{ fontSize: "min(70vw, 620px)" }}
        aria-hidden="true"
      >
        14
      </span>

      <div className="container mx-auto px-4 relative text-center">
        <div className="flex items-center justify-center gap-3 md:gap-5 mb-3 md:mb-5">
          <CrescentStar className="w-4 h-4 md:w-6 md:h-6 opacity-70" />
          <span className="font-display text-xs md:text-base tracking-[0.4em] uppercase">
            {AZAADI.title}
          </span>
          <CrescentStar className="w-4 h-4 md:w-6 md:h-6 opacity-70" />
        </div>

        <h2 className="font-display text-[22vw] leading-[0.85] tracking-tight sm:text-8xl md:text-9xl">
          {AZAADI.headline}
        </h2>

        <p className="font-display text-[11px] md:text-lg tracking-[0.25em] uppercase mt-4 md:mt-6 text-[#fafaf8]/75">
          {AZAADI.subcopy}
        </p>
      </div>
    </section>
  );
};
