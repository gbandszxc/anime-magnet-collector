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
    // 取整个 td 的文本内容，合并多余空白
    return cell.textContent?.trim().replace(/\s+/g, " ") ?? "";
  },

  buildShortMagnet(magnet: string): string | null {
    // dmhy 暂无短链支持
    return null;
  }
};
