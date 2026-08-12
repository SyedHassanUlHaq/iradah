export const AZAADI = {
  percentLabel: "14%",
  offLabel: "OFF",
  badgeLabel: "14% OFF",
  title: "Azaadi Sale",
  stampTop: "AZAADI SALE",
  stampBottom: "14 AUGUST",
  headline: "14% OFF",
  subcopy: "Everything, sitewide — applied automatically at checkout",
  promoItems: [
    "AZAADI SALE",
    "14% OFF SITEWIDE",
    "DISCOUNT APPLIED AUTOMATICALLY",
    "14 AUGUST",
  ] as const,
  green: "#0d5c34",
  deepGreen: "#0f3d24",
  cream: "#fafaf8",
  stripe:
    "repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 2px, transparent 2px, transparent 16px)",
} as const;

/** Fixed nav height with Azaadi promo bar included */
export const NAV_OFFSET = {
  mobile: 110, // 46 + 64
  desktop: 132, // 52 + 80
} as const;
