import type { SiteAdapter } from "./types";

export const acgripAdapter: SiteAdapter = {
  siteId: "acgrip",
  siteName: "ACG.RIP",
  matchPatterns: ["https://acg.rip/*"],
  tableSelector: "table",
  rowSelector: "tbody tr",
  titleHeader: "标题",
  magnetCellSelector: "a[href$='.torrent']",

  extractMagnet(row: Element): string {
    const link = row.querySelector<HTMLAnchorElement>(this.magnetCellSelector);
    return link?.href ?? "";
  },

  extractTitle(row: Element): string {
    // 直接通过 href 格式找标题链接（/t/{id}），不依赖列索引
    const titleLink = row.querySelector<HTMLAnchorElement>('a[href*="/t/"]');
    return titleLink?.textContent?.trim() ?? "";
  },

  buildShortMagnet(magnet: string): string | null {
    // acg.rip 的 torrent 链接已是最终形式，直接返回
    return magnet;
  }
};
