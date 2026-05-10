import type { SiteAdapter } from "./types";

export const dmhyAdapter: SiteAdapter = {
  siteId: "dmhy",
  siteName: "动漫花园",
  matchPatterns: ["https://share.dmhy.org/*"],
  tableSelector: "table#topic_list",
  rowSelector: "tbody tr",
  magnetCellIndex: 3,
  titleCellIndex: 2,

  extractMagnet(row: Element): string {
    const cells = row.querySelectorAll("td");
    const cell = cells[this.magnetCellIndex];
    const link = cell?.querySelector('a[href^="magnet:"]') as HTMLAnchorElement | null;
    return link?.href ?? "";
  },

  extractTitle(row: Element): string {
    const cells = row.querySelectorAll("td");
    const cell = cells[this.titleCellIndex];
    if (!cell) return "";
    // 标题在 <a> 标签或直接文本中，取最后一层文本
    const lastLink = cell.querySelector("a:last-of-type");
    return lastLink?.textContent?.trim() ?? cell.textContent.trim();
  },

  buildShortMagnet(magnet: string): string | null {
    // dmhy 暂无短链支持
    return null;
  }
};
