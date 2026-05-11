import type { MagnetItem } from "../sites/types";

/**
 * 提取磁力链中的 info hash（BTIH）
 */
export function extractInfoHash(magnet: string): string | null {
  const match = magnet.match(/btih:([^&]+)/i);
  return match ? match[1].toUpperCase() : null;
}

/**
 * 判断磁链是否为长链（包含额外参数如 tr、dn 等）
 */
export function isLongMagnet(magnet: string): boolean {
  return /&(tr|dn|xl|xt)/.test(magnet);
}

/**
 * 从长链生成短链（只有 xt=urn:btih:INFOHASH）
 * 长链包含完整信息，短链只保留核心 infohash
 */
export function buildShortMagnet(magnet: string): string | null {
  const infoHash = extractInfoHash(magnet);
  if (!infoHash) return null;
  return `magnet:?xt=urn:btih:${infoHash}`;
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
