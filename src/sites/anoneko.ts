import { dmhyAdapter } from "./dmhy";
import type { SiteAdapter } from "./types";

export const anonekoAdapter: SiteAdapter = {
  ...dmhyAdapter,
  siteId: "anoneko",
  siteName: "动漫花园(镜像)",
  matchPatterns: ["https://dmhy.anoneko.com/*"],
};
