import type { SiteAdapter } from "./types";
import { buildShortMagnet } from "../utils/magnet";

export const acgnxAdapter: SiteAdapter = {
  siteId: "acgnx",
  siteName: "AcgnX",
  matchPatterns: ["https://www.acgnx.se/*"],
  tableSelector: "table#listTable",
  rowSelector: "tbody tr",
  titleHeader: "Name",
  magnetCellSelector: "#magnet",

  extractMagnet(row: Element): string {
    const link = row.querySelector<HTMLAnchorElement>("#magnet");
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
