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
      // header 已经有 prepended checkbox，所以直接用 i
      return i;
    }
  }
  return -1;
}

export function getColumnIndices(adapter: SiteAdapter): { titleCellIndex: number; magnetCellIndex: number } {
  const table = document.querySelector<HTMLTableElement>(adapter.tableSelector);
  if (!table) return { titleCellIndex: -1, magnetCellIndex: -1 };

  const titleIdx = findCellIndex(adapter, adapter.titleHeader);

  // magnet: 通过 selector 找到磁链 td 在行中的索引
  const firstRow = table.querySelector(adapter.rowSelector);
  const magnetEl = firstRow?.querySelector(adapter.magnetCellSelector);
  const magnetTd = magnetEl?.parentElement as HTMLTableCellElement | null;
  // magnet td 的索引 +1（留给 prepend 的 checkbox td）
  const magnetIdx = magnetTd
    ? Array.from(magnetTd.parentElement!.children).indexOf(magnetTd) + 1
    : -1;

  return { titleCellIndex: titleIdx, magnetCellIndex: magnetIdx };
}

export function injectCheckboxColumn(adapter: SiteAdapter): void {
  // bangumi.moe 使用非表格结构，独立处理
  if (adapter.siteId === "bangumi") {
    injectBangumiCheckbox(adapter);
    return;
  }

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

/**
 * bangumi.moe 的 checkbox 注入（Angular Material 列表结构）
 */
function injectBangumiCheckbox(adapter: SiteAdapter): void {
  // 注入 CSS 样式
  const existingStyle = document.getElementById("amc-bangumi-style");
  if (!existingStyle) {
    const style = document.createElement("style");
    style.id = "amc-bangumi-style";
    style.textContent = `
      md-item.torrent-row {
        display: flex !important;
        align-items: center !important;
      }
      md-item.torrent-row > md-item-content {
        flex: 1;
      }
      .amc-bangumi-cb {
        width: 52px;
        margin-right: 12px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .amc-bangumi-cb input {
        width: 18px;
        height: 18px;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);
  }

  let dataList: Element | null = null;
  for (const list of document.querySelectorAll(adapter.tableSelector)) {
    if (list.querySelectorAll(adapter.rowSelector).length > 0) {
      dataList = list;
      break;
    }
  }
  if (!dataList) return;

  // 获取所有行
  const items = dataList.querySelectorAll(adapter.rowSelector);

  items.forEach((item, idx) => {
    // 检查是否已有 checkbox
    if (item.querySelector(".amc-bangumi-cb")) return;

    // 创建 checkbox wrapper
    const wrapper = document.createElement("div");
    wrapper.className = "amc-bangumi-cb";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.dataset.rowIndex = String(idx);
    checkbox.checked = selectionStore.isSelected(idx);

    wrapper.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    checkbox.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    checkbox.addEventListener("change", (event) => {
      event.stopPropagation();
      if (checkbox.checked !== selectionStore.isSelected(idx)) {
        selectionStore.toggle(idx);
      }
    });

    wrapper.appendChild(checkbox);

    // 插入到 md-item-content 前面
    const content = item.querySelector("md-item-content");
    if (content) {
      item.insertBefore(wrapper, content);
    }
  });

  selectionStore.onChange(() => {
    items.forEach((_, i) => {
      const cb = dataList.querySelector<HTMLInputElement>(`[data-row-index="${i}"]`);
      if (cb) cb.checked = selectionStore.isSelected(i);
    });
  });
}

export function removeCheckboxColumn(adapter: SiteAdapter): void {
  if (adapter.siteId === "bangumi") {
    // 移除 bangumi 的 checkbox 和样式
    document.querySelectorAll(".amc-bangumi-cb").forEach((el) => el.remove());
    const style = document.getElementById("amc-bangumi-style");
    if (style) style.remove();
    selectionStore.deselectAll();
    return;
  }

  const table = document.querySelector<HTMLTableElement>(adapter.tableSelector);
  if (!table) return;

  table.querySelectorAll(".amc-checkbox-col").forEach((cell) => cell.remove());
  selectionStore.deselectAll();
}
