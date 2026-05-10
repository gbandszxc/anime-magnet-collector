import { selectionStore } from "./SelectionStore";
import type { SiteAdapter } from "../sites/types";

export function injectCheckboxColumn(adapter: SiteAdapter): void {
  const table = document.querySelector<HTMLTableElement>(adapter.tableSelector);
  if (!table) return;

  const thead = table.querySelector("thead");
  const tbody = table.querySelector("tbody");
  if (!thead || !tbody) return;

  // 插入表头 checkbox
  const th = document.createElement("th");
  th.className = "amc-checkbox-col";
  th.style.width = "30px";
  th.style.textAlign = "center";
  const headerCheckbox = document.createElement("input");
  headerCheckbox.type = "checkbox";
  headerCheckbox.title = "全选";
  headerCheckbox.className = "amc-checkbox-header";
  th.appendChild(headerCheckbox);
  thead.querySelector("tr")?.prepend(th);

  // 插入行 checkbox
  const rows = tbody.querySelectorAll<HTMLTableRowElement>(adapter.rowSelector);
  rows.forEach((row, idx) => {
    const td = document.createElement("td");
    td.className = "amc-checkbox-col";
    td.style.textAlign = "center";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "amc-checkbox-row";
    checkbox.dataset.rowIndex = String(idx);

    checkbox.addEventListener("change", () => {
      selectionStore.toggle(idx);
      updateHeaderState();
    });

    td.appendChild(checkbox);
    row.prepend(td);
  });

  // 全选逻辑
  headerCheckbox.addEventListener("change", () => {
    const allIndexes = Array.from(rows).map((_, i) => i);
    if (headerCheckbox.checked) {
      selectionStore.selectAll(allIndexes);
      rows.forEach((_, i) => {
        const cb = tbody.querySelector<HTMLInputElement>(`[data-row-index="${i}"]`);
        if (cb) cb.checked = true;
      });
    } else {
      selectionStore.deselectAll();
      rows.forEach((_, i) => {
        const cb = tbody.querySelector<HTMLInputElement>(`[data-row-index="${i}"]`);
        if (cb) cb.checked = false;
      });
    }
  });

  // 同步 header checkbox 状态
  function updateHeaderState() {
    const count = selectionStore.getCount();
    headerCheckbox.checked = count > 0 && count === rows.length;
    headerCheckbox.indeterminate = count > 0 && count < rows.length;
  }

  // 监听外部 deselectAll（如 Modal 关闭后）
  selectionStore.onChange(() => {
    rows.forEach((_, i) => {
      const cb = tbody.querySelector<HTMLInputElement>(`[data-row-index="${i}"]`);
      if (cb) cb.checked = selectionStore.isSelected(i);
    });
    updateHeaderState();
  });
}
