import type { SiteAdapter } from "./types";

export const bangumiAdapter: SiteAdapter = {
  siteId: "bangumi",
  siteName: "萌番组",
  matchPatterns: ["https://bangumi.moe/*"],
  tableSelector: ".torrent-list",
  rowSelector: "md-item.torrent-row",
  titleHeader: "",
  magnetCellSelector: "",

  extractMagnet(row: Element): string {
    const id = extractTorrentId(row);
    return id ? getMagnetFromCache(id) ?? "" : "";
  },

  extractTitle(row: Element): string {
    const titleEl = row.querySelector<HTMLElement>(".torrent-title h3");
    const title = titleEl?.textContent?.trim();
    if (title) return title.replace(/\s+/g, " ");

    const titleContainer = row.querySelector<HTMLElement>(".torrent-title");
    return titleContainer?.firstChild?.textContent?.trim().replace(/\s+/g, " ") ?? "";
  },

  buildShortMagnet(magnet: string): string | null {
    return magnet;
  }
};

function extractTorrentId(row: Element): string | null {
  const link = row.querySelector<HTMLAnchorElement>('a[href^="/torrent/"], a[href*="/torrent/"]');
  const href = link?.getAttribute("href") ?? "";
  const match = href.match(/\/torrent\/([^/?#]+)/);
  return match ? match[1] : null;
}

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

// 判断是否为首页
function isHomepage(): boolean {
  return window.location.pathname === "/";
}

// 从 URL 提取 tag_id (用于搜索页)
function extractTagId(): string | null {
  const match = window.location.pathname.match(/\/search\/([^/]+)/);
  return match ? match[1] : null;
}

// 获取指定页的 torrents
async function fetchMagnetPage(page: number): Promise<any[]> {
  if (isHomepage()) {
    const res = await fetch(`/api/torrent/latest?page=${page}`);
    const data = await res.json();
    return data.torrents || [];
  } else {
    const tagId = extractTagId();
    if (!tagId) return [];

    const res = await fetch("/api/torrent/search", {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: JSON.stringify({ tag_id: [tagId], p: page })
    });
    const data = await res.json();
    return data.torrents || [];
  }
}

// 计算选中项需要哪些页
export function getRequiredPages(selectedIndexes: number[]): number[] {
  const pages = new Set<number>();
  for (const idx of selectedIndexes) {
    pages.add(Math.floor(idx / 30) + 1);
  }
  return Array.from(pages).sort((a, b) => a - b);
}

// 批量预取 magnet 并缓存
export async function prefetchMagnetsForSelection(selectedIndexes: number[]): Promise<void> {
  const pages = getRequiredPages(selectedIndexes);
  const promises = pages.map(p => fetchMagnetPage(p));
  const results = await Promise.all(promises);
  for (const torrents of results) {
    buildMagnetCache(torrents);
  }
}
