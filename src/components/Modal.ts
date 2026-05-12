import { selectionStore } from "./SelectionStore";
import { findAdapter } from "../sites/index";
import type { MagnetItem } from "../sites/types";
import { copyMagnetsToClipboard, formatTitle, isLongMagnet } from "../utils/magnet";
import { prefetchMagnetsForSelection } from "../sites/bangumi";

let modalEl: HTMLDivElement | null = null;

export async function openModal(): Promise<void> {
  if (modalEl) {
    modalEl.remove();
    modalEl = null;
  }

  const adapter = findAdapter();
  if (!adapter) return;

  const selectedIndexes = selectionStore.getSelected();
  if (adapter.siteId === "bangumi") {
    await prefetchMagnetsForSelection(selectedIndexes);
  }

  const rows = adapter.siteId === "bangumi"
    ? document.querySelectorAll<Element>(adapter.rowSelector)
    : document.querySelector<HTMLTableElement>(adapter.tableSelector)?.querySelectorAll<Element>(adapter.rowSelector);
  if (!rows) return;

  const selectedItems = selectedIndexes.map(idx => {
    const row = rows[idx];
    return {
      title: row ? adapter.extractTitle(row) : "",
      magnet: row ? adapter.extractMagnet(row) : "",
    };
  });

  modalEl = document.createElement("div");
  modalEl.className = "amc-modal-overlay";
  modalEl.innerHTML = `
    <div class="amc-modal">
      <div class="amc-modal-header">已选 ${selectedItems.length} 项</div>
      <div class="amc-modal-list">
        ${selectedItems.map((item, i) => `
          <div class="amc-modal-item">
            <span class="amc-modal-num">${i + 1}.</span>
            <span class="amc-modal-title" title="${item.title}">${formatTitle(item.title)}</span>
          </div>
        `).join("")}
      </div>
      <div class="amc-modal-footer">
        <button id="amc-copy-long" class="amc-float-btn">复制长链</button>
        <button id="amc-copy-short" class="amc-float-btn">复制短链</button>
        <button id="amc-cancel" class="amc-float-btn">取消</button>
      </div>
    </div>
  `;

  document.body.appendChild(modalEl);

  const longBtn = modalEl.querySelector<HTMLButtonElement>("#amc-copy-long")!;
  const shortBtn = modalEl.querySelector<HTMLButtonElement>("#amc-copy-short")!;

  // 根据选中磁链的实际情况判断长链/短链按钮可用性
  // 长链按钮：所选全部为长链时才可用（短链无法还原成长链）
  // 短链按钮：始终可用（长链可生成短链，短链可直接复制）
  const hasShort = selectedItems.some(item => !isLongMagnet(item.magnet));

  if (adapter.siteId === "acgrip") {
    shortBtn.title = "复制 torrent 链接";
  } else if (hasShort) {
    longBtn.disabled = true;
    longBtn.title = "所选包含短链，无法还原为长链";
    shortBtn.title = "所选包含短链，部分直接复制，部分转换";
  }

  // 事件绑定
  modalEl.querySelector<HTMLButtonElement>("#amc-copy-long")!.onclick = async () => {
    const count = await copyMagnetsToClipboard(selectedItems);
    showToast(`已复制 ${count} 条磁力链`);
    closeModal();
  };

  shortBtn.onclick = async () => {
    const shortItems = selectedItems.map(item => {
      const short = adapter.buildShortMagnet?.(item.magnet);
      return short ?? item.magnet;
    });
    const count = await copyMagnetsToClipboard(shortItems.map(m => ({ magnet: m } as MagnetItem)));
    showToast(`已复制 ${count} 条短链`);
    closeModal();
  };

  modalEl.querySelector<HTMLButtonElement>("#amc-cancel")!.onclick = closeModal;
  modalEl.querySelector<HTMLDivElement>(".amc-modal-overlay")!.onclick = (e) => {
    if (e.target === modalEl) closeModal();
  };
}

export function closeModal(): void {
  if (modalEl) {
    modalEl.remove();
    modalEl = null;
  }
}

function showToast(message: string): void {
  const toast = document.createElement("div");
  toast.className = "amc-toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}
