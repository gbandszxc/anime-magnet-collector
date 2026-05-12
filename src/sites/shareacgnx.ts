import type { SiteAdapter } from "./types";
import { buildShortMagnet } from "../utils/magnet";

export const shareacgnxAdapter: SiteAdapter = {
  siteId: "shareacgnx",
  siteName: "AcgnX中文站",
  matchPatterns: ["https://share.acgnx.se/*"],
  tableSelector: "table#listTable",
  rowSelector: "tbody tr",
  titleHeader: "資源名稱",
  magnetCellSelector: "#magnet",

  extractMagnet(row: Element): string {
    const link = row.querySelector<HTMLAnchorElement>("#magnet");
    return link?.href ?? "";
  },

  extractTitle(row: Element): string {
    const cells = row.querySelectorAll("td");
    const cell = cells[2]; // 發佈時間(0) | 分類(1) | 資源名稱(2)
    const link = cell?.querySelector("a");
    return link?.textContent?.trim() ?? cell?.textContent?.trim() ?? "";
  },

  buildShortMagnet(magnet: string): string | null {
    return buildShortMagnet(magnet);
  }
};
