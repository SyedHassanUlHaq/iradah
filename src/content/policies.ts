export type PolicySlug =
  | "shipping"
  | "returns"
  | "contact"
  | "privacy"
  | "terms";

export interface PolicyPage {
  title: string;
  description: string;
  sections: Array<{ heading?: string; body: string[] }>;
}

export const policies: Record<PolicySlug, PolicyPage> = {
  shipping: {
    title: "Shipping",
    description: "Delivery details for IRADAH orders across Pakistan.",
    sections: [
      {
        heading: "Free shipping",
        body: [
          "Enjoy free shipping on all orders over PKR 5,000 within Pakistan.",
          "Orders under PKR 5,000 may include a standard delivery fee, calculated at checkout.",
        ],
      },
      {
        heading: "Delivery timeline",
        body: [
          "Most orders are processed within 1–2 business days.",
          "Delivery typically takes 2–5 business days depending on your city.",
        ],
      },
      {
        heading: "Cash on delivery",
        body: ["Cash on delivery (COD) is available on eligible orders across Pakistan."],
      },
    ],
  },
  returns: {
    title: "Returns",
    description: "Our easy 7-day returns policy.",
    sections: [
      {
        heading: "7-day returns",
        body: [
          "If something isn’t right, you can request a return within 7 days of delivery.",
          "Items must be unused, unwashed, and returned with original tags and packaging.",
        ],
      },
      {
        heading: "How to start a return",
        body: [
          "Message us on Instagram or Facebook with your order number and reason for return.",
          "We’ll guide you through the next steps once your request is reviewed.",
        ],
      },
    ],
  },
  contact: {
    title: "Contact",
    description: "Get in touch with the IRADAH team.",
    sections: [
      {
        heading: "Social",
        body: [
          "Instagram: instagram.com/iradahclothing",
          "Facebook: facebook.com/iradahclothing",
        ],
      },
      {
        heading: "Orders & support",
        body: [
          "For order updates, sizing questions, or returns, message us on Instagram or Facebook — we typically reply within 1 business day.",
        ],
      },
    ],
  },
  privacy: {
    title: "Privacy",
    description: "How IRADAH handles your information.",
    sections: [
      {
        body: [
          "We collect only the information needed to process orders, improve the shopping experience, and send updates you opt into.",
          "Payment details are handled securely by Shopify and are never stored on this website.",
          "You can unsubscribe from marketing emails at any time using the link in those messages.",
        ],
      },
    ],
  },
  terms: {
    title: "Terms",
    description: "Terms of use for iradahclothing.com.",
    sections: [
      {
        body: [
          "By shopping with IRADAH, you agree to use this site for lawful purposes and provide accurate order information.",
          "Product availability, pricing, and promotions may change without notice.",
          "All designs, imagery, and brand assets remain the property of IRADAH.",
        ],
      },
    ],
  },
};
