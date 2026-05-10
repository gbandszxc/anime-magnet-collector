import type { SiteAdapter } from "./types";

export const dmhyAdapter: SiteAdapter = {
  siteId: "dmhy",
  siteName: "动漫花园",
  matchPatterns: ["https://share.dmhy.org/*"],
  tableSelector: "table#topic_list",
  rowSelector: "tbody tr",
  titleHeader: "標題",
  magnetCellSelector: 'a[href^="magnet:"]',

  extractMagnet(row: Element): string {
    const link = row.querySelector<HTMLAnchorElement>(this.magnetCellSelector);
    return link?.href ?? "";
  },

  extractTitle(row: Element): string {
    const adapterExt = this as SiteAdapter & { _titleIdx?: number };
    const idx = adapterExt._titleIdx ?? 3;
    const cells = row.querySelectorAll("td");
    const cell = cells[idx];
    if (!cell) return "";
    const lastLink = cell.querySelector("a:last-of-type");
    return lastLink?.textContent?.trim() ?? cell.textContent.trim();
  },

  buildShortMagnet(magnet: string): string | null {
    // dmhy 暂无短链支持
    return null;
  }
};
