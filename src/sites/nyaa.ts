import type { SiteAdapter } from "./types";
import { buildShortMagnet } from "../utils/magnet";

export const nyaaAdapter: SiteAdapter = {
  siteId: "nyaa",
  siteName: "Nyaa",
  matchPatterns: ["https://nyaa.si/*"],
  tableSelector: "table",
  rowSelector: "tbody tr",
  titleHeader: "Name",
  magnetCellSelector: 'a[href^="magnet:"]',

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
    return cell.textContent?.trim().replace(/\s+/g, " ") ?? "";
  },

  buildShortMagnet(magnet: string): string | null {
    return buildShortMagnet(magnet);
  }
};
