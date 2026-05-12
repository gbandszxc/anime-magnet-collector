import type { SiteAdapter } from "./types";

const DETAIL_LINK_SELECTOR = 'a[href*="show-"][href$=".html"]';

function extractInfoHashFromDetailUrl(url: string): string | null {
  const match = url.match(/show-([a-f0-9]{40})\.html/i);
  return match?.[1].toUpperCase() ?? null;
}

export const kisssubAdapter: SiteAdapter = {
  siteId: "kisssub",
  siteName: "爱恋动漫",
  matchPatterns: ["https://www.kisssub.org/*"],

  tableSelector: "table#listTable",
  rowSelector: "tbody tr",
  titleHeader: "标题",
  magnetCellSelector: DETAIL_LINK_SELECTOR,

  extractMagnet(row: Element): string {
    // 标题链接 URL 格式: https://www.kisssub.org/show-{info_hash}.html
    const link = row.querySelector<HTMLAnchorElement>(DETAIL_LINK_SELECTOR);
    if (!link?.href) return "";
    const infoHash = extractInfoHashFromDetailUrl(link.href);
    if (!infoHash) return "";
    return `magnet:?xt=urn:btih:${infoHash}`;
  },

  extractTitle(row: Element): string {
    // 直接用标题链接提取，不受 column prepend 影响
    const link = row.querySelector<HTMLAnchorElement>(DETAIL_LINK_SELECTOR);
    return link?.textContent?.trim() ?? "";
  },

  buildShortMagnet(magnet: string): string | null {
    const infoHash = extractInfoHashFromDetailUrl(magnet) ?? magnet.match(/btih:([^&]+)/i)?.[1]?.toUpperCase();
    if (!infoHash) return null;
    return `magnet:?xt=urn:btih:${infoHash}`;
  },
};
