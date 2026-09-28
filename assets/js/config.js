/* ============================================================
   00212.com — SITE CONFIGURATION
   Edit this file only. Everything else reads from here.
   ============================================================ */
window.SITE_CONFIG = {
  siteName: "00212.com",
  siteUrl: "https://00212.com",

  /* Interest / sale / sponsorship contact page (top banner) */
  interestUrl: "https://web.works/contact",

  /* Contact routing key (obfuscated on purpose — do NOT paste a plain address anywhere in HTML).
     All forms deliver to the owner's inbox through this key. */
  _k: ["iV2d", "3ay92d", "nBUMhN", "CbpFWb", "=02bj5"],

  /* Optional: after the first FormSubmit activation e-mail, FormSubmit gives you a random
     alias string (e.g. "a1b2c3d4e5..."). Paste it here to stop using the encoded key at all. */
  formAlias: "",

  /* Optional alternative endpoint (e.g. "https://formspree.io/f/xxxxxxx"). Overrides the above. */
  formEndpoint: "",

  /* Google AdSense — paste your publisher ID (ca-pub-XXXXXXXXXXXXXXXX) once approved.
     Until then, ad slots show house ads that sell sponsorship. */
  adsenseClient: "",
  adSlots: { header: "", inArticle: "", sidebar: "", footer: "" },

  /* Google Analytics 4 measurement ID (G-XXXXXXX) — optional */
  ga4: "",

  /* YouTube — channel URL + video IDs shown in the video hubs.
     Leave id empty to show a branded "coming soon" card. */
  youtubeChannel: "https://www.youtube.com/",
  videos: [
    { id: "", title: "Casablanca in 3 minutes: the business capital" },
    { id: "", title: "How Chinese firms set up in Tangier Tech City" },
    { id: "", title: "Visa-free Morocco: 7-day itinerary for Chinese travellers" },
    { id: "", title: "+212 missed call? What to do (and what never to do)" }
  ],

  /* Donation / payment links — paste your own hosted links.
     If a link is empty, the button opens the pledge form instead (no payment data touches this site). */
  donate: {
    paypal: "",        // e.g. https://www.paypal.com/donate/?hosted_button_id=XXXX
    stripe: "",        // e.g. https://buy.stripe.com/xxxx
    buymeacoffee: "",  // e.g. https://buymeacoffee.com/yourname
    kofi: "",          // e.g. https://ko-fi.com/yourname
    goal: 25000,       // USD fundraising goal shown on the progress bar
    raised: 0          // update manually
  },

  /* Social */
  social: { x: "", linkedin: "", youtube: "", wechat: "", instagram: "" }
};
