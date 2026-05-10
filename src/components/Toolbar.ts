import { selectionStore } from "./SelectionStore";
import { openModal } from "./Modal";

export function injectToolbar(): void {
  const toolbar = document.createElement("div");
  toolbar.id = "amc-toolbar";
  toolbar.innerHTML = `
    <span class="amc-toolbar-info">已选 <span id="amc-count">0</span> 项</span>
    <button id="amc-copy-btn" class="amc-btn" disabled>复制</button>
  `;
  document.body.appendChild(toolbar);

  const countEl = document.getElementById("amc-count")!;
  const copyBtn = document.getElementById("amc-copy-btn") as HTMLButtonElement;

  selectionStore.onChange((count) => {
    countEl.textContent = String(count);
    copyBtn.disabled = count === 0;
  });

  copyBtn.addEventListener("click", () => {
    if (selectionStore.getCount() > 0) {
      openModal();
    }
  });
}
