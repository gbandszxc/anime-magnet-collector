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
    const adapterExt = this as SiteAdapter & { _titleIdx?: number };
    const idx = adapterExt._titleIdx ?? 1;
    const cells = row.querySelectorAll("td");
    const cell = cells[idx];
    if (!cell) return "";
    const link = cell?.querySelector("a");
    return link?.textContent?.trim() ?? cell?.textContent?.trim() ?? "";
  },

  buildShortMagnet(magnet: string): string | null {
    // acg.rip 的 torrent 链接已是最终形式，直接返回
    return magnet;
  }
};
