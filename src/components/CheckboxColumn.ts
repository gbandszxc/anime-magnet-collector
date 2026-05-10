import { selectionStore } from "./SelectionStore";
import type { SiteAdapter } from "../sites/types";

/**
 * 根据表头文字查找列索引（忽略已注入的 checkbox 列）
 */
function findCellIndex(adapter: SiteAdapter, headerText: string): number {
  const table = document.querySelector<HTMLTableElement>(adapter.tableSelector);
  if (!table) return -1;
  const thead = table.querySelector("thead");
  if (!thead) return -1;
  const headers = thead.querySelectorAll("th");
  for (let i = 0; i < headers.length; i++) {
    const text = headers[i].textContent?.trim() ?? "";
    if (text === headerText) {
      // 减去已注入的 checkbox 列数量（每找到一个匹配就减一，因为 checkbox 列在最前面）
      const checkboxCols = table.querySelectorAll("th.amc-checkbox-col").length;
      return i - checkboxCols;
    }
  }
  return -1;
}

export function getColumnIndices(adapter: SiteAdapter): { titleCellIndex: number; magnetCellIndex: number } {
  const table = document.querySelector<HTMLTableElement>(adapter.tableSelector);
  if (!table) return { titleCellIndex: -1, magnetCellIndex: -1 };

  // title: 通过表头文字定位
  const titleIdx = findCellIndex(adapter, adapter.titleHeader);

  // magnet: 通过 selector 找到对应 td 的位置
  const firstRow = table.querySelector(adapter.rowSelector);
  const magnetEl = firstRow?.querySelector(adapter.magnetCellSelector);
  const magnetTd = magnetEl?.parentElement as HTMLTableCellElement | null;
  const checkboxCols = table.querySelectorAll("th.amc-checkbox-col").length;
  // parentElement 是 td，td 在行里的索引需要减去 checkbox td 的影响
  // 但问题是：magnet td 前面有没有 checkbox td？应该没有，因为 checkbox td 是在 preprend 后才插入行的
  // 但行已经 prepend 了 checkbox td，所以行里第一个 td 是 checkbox，然后才是原始 td
  // magnet td 的索引（从0开始）= 其在 preprend 后的位置 - 1（减去 checkbox td）
  const magnetIdx = magnetTd ? Array.from(magnetTd.parentElement!.children).indexOf(magnetTd) - 1 : -1;

  return { titleCellIndex: titleIdx, magnetCellIndex: magnetIdx };
}

export function injectCheckboxColumn(adapter: SiteAdapter): void {
  const table = document.querySelector<HTMLTableElement>(adapter.tableSelector);
  if (!table) return;

  // 防止重复注入
  if (table.querySelector(".amc-checkbox-col")) return;

  const thead = table.querySelector("thead");
  const tbody = table.querySelector("tbody");
  if (!thead || !tbody) return;

  // 动态计算列索引（基于表头文字和 selector）
  const indices = getColumnIndices(adapter);
  // 将索引临时挂到 adapter 上，供 extractTitle 使用
  (adapter as SiteAdapter & { _titleIdx?: number })._titleIdx = indices.titleCellIndex;

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
