import type { SiteAdapter } from "./types";
import { buildShortMagnet } from "../utils/magnet";

export const shareacgnxAdapter: SiteAdapter = {
  siteId: "shareacgnx",
  siteName: "AcgnX中文站",
  matchPatterns: ["https://share.acgnx.se/*"],
  tableSelector: "table#listTable",
  rowSelector: "tbody tr",
  titleHeader: "資源名稱",
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
    const link = cell?.querySelector("a");
    return link?.textContent?.trim() ?? cell?.textContent?.trim() ?? "";
  },

  buildShortMagnet(magnet: string): string | null {
    return buildShortMagnet(magnet);
  }
};
