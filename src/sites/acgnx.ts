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
    const cells = row.querySelectorAll("td");
    const cell = cells[2]; // Date(0) | Category(1) | Name(2)
    const link = cell?.querySelector("a");
    return link?.textContent?.trim() ?? cell?.textContent?.trim() ?? "";
  },

  buildShortMagnet(magnet: string): string | null {
    return buildShortMagnet(magnet);
  }
};
