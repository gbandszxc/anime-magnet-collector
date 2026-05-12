import type { SiteAdapter } from "./types";

export const bangumiAdapter: SiteAdapter = {
  siteId: "bangumi",
  siteName: "萌番组",
  matchPatterns: ["https://bangumi.moe/*"],
  tableSelector: "md-list.torrent-list",
  rowSelector: "md-list-item, [class*='torrent']",
  titleHeader: "",
  magnetCellSelector: "",

  extractMagnet(row: Element): string {
    return "";
  },

  extractTitle(row: Element): string {
    const titleLink = row.querySelector<HTMLAnchorElement>('a[href^="/torrent/"]');
    return titleLink?.textContent?.trim() ?? "";
  },

  buildShortMagnet(magnet: string): string | null {
    return magnet;
  }
};

// Magnet 缓存
let magnetCache = new Map<string, string>();

export function setMagnetCache(id: string, magnet: string): void {
  magnetCache.set(id, magnet);
}

export function getMagnetFromCache(id: string): string | undefined {
  return magnetCache.get(id);
}

export function clearMagnetCache(): void {
  magnetCache.clear();
}

export function buildMagnetCache(torrents: any[]): void {
  for (const t of torrents) {
    if (t._id && t.magnet) {
      magnetCache.set(t._id, t.magnet);
    }
  }
}
