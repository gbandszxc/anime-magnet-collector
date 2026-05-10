import { selectionStore } from "./SelectionStore";
import { findAdapter } from "../sites/index";
import { copyMagnetsToClipboard, formatTitle } from "../utils/magnet";

let modalEl: HTMLDivElement | null = null;

export function openModal(): void {
  if (modalEl) {
    modalEl.remove();
    modalEl = null;
  }

  const adapter = findAdapter();
  if (!adapter) return;

  const selectedIndexes = selectionStore.getSelected();
  const table = document.querySelector<HTMLTableElement>(adapter.tableSelector);
  if (!table) return;

  const rows = table.querySelectorAll<HTMLTableRowElement>(adapter.rowSelector);
  const selectedItems = selectedIndexes.map(idx => {
    const row = rows[idx];
    return {
      title: adapter.extractTitle(row),
      magnet: adapter.extractMagnet(row),
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
        <button id="amc-copy-long" class="amc-btn amc-btn-primary">复制长链</button>
        <button id="amc-copy-short" class="amc-btn" disabled title="该站点暂不支持短链">复制短链(暂不可用)</button>
        <button id="amc-cancel" class="amc-btn">取消</button>
      </div>
    </div>
  `;

  document.body.appendChild(modalEl);

  // 事件绑定
  modalEl.querySelector<HTMLButtonElement>("#amc-copy-long")!.onclick = async () => {
    const count = await copyMagnetsToClipboard(selectedItems);
    showToast(`已复制 ${count} 条磁力链`);
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
