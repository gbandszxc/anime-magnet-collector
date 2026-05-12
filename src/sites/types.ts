export interface SiteAdapter {
  siteId: string;                    // 唯一标识
  siteName: string;                   // 显示名称
  matchPatterns: string[];             // @match URL模式列表
  tableSelector: string;               // 主列表表格选择器
  rowSelector: string;                // 表格行选择器
  titleHeader: string;               // 标题列的表头文字
  magnetCellSelector: string;         // 磁链单元格的 CSS selector（在 row 内查找）
  extractMagnet(row: Element): string; // 从行提取磁力链
  extractTitle(row: Element): string;  // 从行提取标题
  buildShortMagnet?(magnet: string): string | null; // 长链转短链（可选）
  _titleIdx?: number;                  // 内部字段：标题列索引（用于覆盖默认查找逻辑）
}

export interface MagnetItem {
  title: string;
  magnet: string;
  shortMagnet?: string;
}
