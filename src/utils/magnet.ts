import type { MagnetItem } from "../sites/types";

/**
 * 提取磁力链中的 info hash（BTIH）
 */
export function extractInfoHash(magnet: string): string | null {
  const match = magnet.match(/btih:([^&]+)/i);
  return match ? match[1].toUpperCase() : null;
}

/**
 * 复制磁力链列表到剪贴板，每行一个
 */
export async function copyMagnetsToClipboard(items: MagnetItem[]): Promise<number> {
  const text = items.map(item => item.magnet).join("\n");
  await navigator.clipboard.writeText(text);
  return items.length;
}

/**
 * 格式化标题用于显示，最大长度40字符
 */
export function formatTitle(title: string, maxLen = 40): string {
  const cleaned = title.replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxLen) return cleaned;
  return cleaned.substring(0, maxLen - 3) + "...";
}
