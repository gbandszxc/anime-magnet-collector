import type { SiteAdapter } from "./types";
import { nyaaAdapter } from "./nyaa";

export const sukebeiAdapter: SiteAdapter = {
  ...nyaaAdapter,
  siteId: "sukebei",
  siteName: "Sukebei",
  matchPatterns: ["https://sukebei.nyaa.si/*"],
  _titleIdx: 1
};
