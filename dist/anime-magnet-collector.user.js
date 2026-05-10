// ==UserScript==
// @name         Anime Magnet Collector
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  动漫BT站点增加复选框批量复制磁力链接
// @author       gbandszxc
// @match      https://share.dmhy.org/*
// @grant      GM_addStyle
// @grant      GM_log
// @updateURL    https://raw.githubusercontent.com/gbandszxc/anime-magnet-collector/main/dist/anime-magnet-collector.user.js
// @downloadURL  https://raw.githubusercontent.com/gbandszxc/anime-magnet-collector/main/dist/anime-magnet-collector.user.js
// @license      MIT
// ==/UserScript==

"use strict";
(() => {
  // src/style.css
  var style_default = "/* ========================\n   Anime Magnet Collector\n   ======================== */\n\n/* Toolbar */\n#amc-toolbar {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 40px;\n  background: #f8f8f8;\n  border-bottom: 1px solid #ddd;\n  display: flex;\n  align-items: center;\n  padding: 0 16px;\n  gap: 12px;\n  z-index: 2147483647;\n  font-size: 14px;\n  font-family: system-ui, sans-serif;\n}\n\n.amc-toolbar-info {\n  color: #333;\n}\n\n#amc-copy-btn:not(:disabled) {\n  background: #4CAF50;\n  color: white;\n  border: none;\n  padding: 6px 16px;\n  border-radius: 4px;\n  cursor: pointer;\n  font-size: 14px;\n}\n\n#amc-copy-btn:disabled {\n  background: #ccc;\n  color: #888;\n  border: none;\n  padding: 6px 16px;\n  border-radius: 4px;\n  cursor: not-allowed;\n}\n\n.amc-btn {\n  padding: 6px 16px;\n  border-radius: 4px;\n  cursor: pointer;\n  font-size: 14px;\n  border: 1px solid #ccc;\n  background: #fff;\n}\n\n.amc-btn-primary {\n  background: #4CAF50;\n  color: white;\n  border: none;\n}\n\n/* Checkbox Column */\n.amc-checkbox-col {\n  padding: 4px !important;\n}\n\n.amc-checkbox-row,\n.amc-checkbox-header {\n  width: 16px;\n  height: 16px;\n  cursor: pointer;\n}\n\n/* Modal Overlay */\n.amc-modal-overlay {\n  position: fixed;\n  inset: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 2147483647;\n  font-family: system-ui, sans-serif;\n}\n\n/* Modal */\n.amc-modal {\n  background: white;\n  border-radius: 8px;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);\n  width: 90%;\n  max-width: 500px;\n  max-height: 80vh;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}\n\n.amc-modal-header {\n  padding: 16px 20px;\n  font-size: 16px;\n  font-weight: 600;\n  border-bottom: 1px solid #eee;\n  color: #333;\n}\n\n.amc-modal-list {\n  padding: 12px 20px;\n  overflow-y: auto;\n  flex: 1;\n}\n\n.amc-modal-item {\n  display: flex;\n  padding: 6px 0;\n  font-size: 14px;\n  color: #444;\n}\n\n.amc-modal-num {\n  color: #888;\n  margin-right: 8px;\n  min-width: 24px;\n}\n\n.amc-modal-title {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.amc-modal-footer {\n  padding: 16px 20px;\n  border-top: 1px solid #eee;\n  display: flex;\n  gap: 8px;\n  justify-content: flex-end;\n}\n\n/* Toast */\n.amc-toast {\n  position: fixed;\n  bottom: 20px;\n  left: 50%;\n  transform: translateX(-50%);\n  background: #333;\n  color: white;\n  padding: 10px 20px;\n  border-radius: 4px;\n  font-size: 14px;\n  z-index: 2147483647;\n  font-family: system-ui, sans-serif;\n  animation: amc-fade-in 0.2s ease;\n}\n\n@keyframes amc-fade-in {\n  from { opacity: 0; transform: translateX(-50%) translateY(10px); }\n  to { opacity: 1; transform: translateX(-50%) translateY(0); }\n}\n";

  // src/config.ts
  var CONFIG = {
    debug: true
  };

  // src/utils.ts
  function createUtils({ config = CONFIG } = {}) {
    function log2(...args) {
      if (config.debug) console.log("[Anime Magnet Collector]", ...args);
    }
    return { log: log2 };
  }

  // src/sites/dmhy.ts
  var dmhyAdapter = {
    siteId: "dmhy",
    siteName: "动漫花园",
    matchPatterns: ["https://share.dmhy.org/*"],
    tableSelector: "table#topic_list",
    rowSelector: "tbody tr",
    magnetCellIndex: 3,
    titleCellIndex: 2,
    extractMagnet(row) {
      const cells = row.querySelectorAll("td");
      const cell = cells[this.magnetCellIndex];
      const link = cell?.querySelector('a[href^="magnet:"]');
      return link?.href ?? "";
    },
    extractTitle(row) {
      const cells = row.querySelectorAll("td");
      const cell = cells[this.titleCellIndex];
      if (!cell) return "";
      const lastLink = cell.querySelector("a:last-of-type");
      return lastLink?.textContent?.trim() ?? cell.textContent.trim();
    },
    buildShortMagnet(magnet) {
      return null;
    }
  };

  // src/sites/index.ts
  var adapters = [dmhyAdapter];
  function findAdapter() {
    const url = window.location.href;
    return adapters.find(
      (a) => a.matchPatterns.some((pattern) => {
        const regex = new RegExp("^" + pattern.replace(/\*/g, ".*") + "$");
        return regex.test(url);
      })
    );
  }

  // src/components/SelectionStore.ts
  var SelectionStore = class {
    constructor() {
      this.selected = /* @__PURE__ */ new Set();
      this.listeners = /* @__PURE__ */ new Set();
    }
    toggle(index) {
      if (this.selected.has(index)) {
        this.selected.delete(index);
      } else {
        this.selected.add(index);
      }
      this.notify();
    }
    selectAll(indexes) {
      indexes.forEach((i) => this.selected.add(i));
      this.notify();
    }
    deselectAll() {
      this.selected.clear();
      this.notify();
    }
    isSelected(index) {
      return this.selected.has(index);
    }
    getSelected() {
      return Array.from(this.selected);
    }
    getCount() {
      return this.selected.size;
    }
    onChange(callback) {
      this.listeners.add(callback);
      return () => this.listeners.delete(callback);
    }
    notify() {
      this.listeners.forEach((cb) => cb(this.getCount()));
    }
  };
  var selectionStore = new SelectionStore();

  // src/components/CheckboxColumn.ts
  function injectCheckboxColumn(adapter) {
    const table = document.querySelector(adapter.tableSelector);
    if (!table) return;
    if (table.querySelector(".amc-checkbox-col")) return;
    const thead = table.querySelector("thead");
    const tbody = table.querySelector("tbody");
    if (!thead || !tbody) return;
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
    const rows = tbody.querySelectorAll(adapter.rowSelector);
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
    headerCheckbox.addEventListener("change", () => {
      const allIndexes = Array.from(rows).map((_, i) => i);
      if (headerCheckbox.checked) {
        selectionStore.selectAll(allIndexes);
        rows.forEach((_, i) => {
          const cb = tbody.querySelector(`[data-row-index="${i}"]`);
          if (cb) cb.checked = true;
        });
      } else {
        selectionStore.deselectAll();
        rows.forEach((_, i) => {
          const cb = tbody.querySelector(`[data-row-index="${i}"]`);
          if (cb) cb.checked = false;
        });
      }
    });
    function updateHeaderState() {
      const count = selectionStore.getCount();
      headerCheckbox.checked = count > 0 && count === rows.length;
      headerCheckbox.indeterminate = count > 0 && count < rows.length;
    }
    selectionStore.onChange(() => {
      rows.forEach((_, i) => {
        const cb = tbody.querySelector(`[data-row-index="${i}"]`);
        if (cb) cb.checked = selectionStore.isSelected(i);
      });
      updateHeaderState();
    });
  }

  // src/utils/magnet.ts
  async function copyMagnetsToClipboard(items) {
    const text = items.map((item) => item.magnet).join("\n");
    await navigator.clipboard.writeText(text);
    return items.length;
  }
  function formatTitle(title, maxLen = 40) {
    const cleaned = title.replace(/\s+/g, " ").trim();
    if (cleaned.length <= maxLen) return cleaned;
    return cleaned.substring(0, maxLen - 3) + "...";
  }

  // src/components/Modal.ts
  var modalEl = null;
  function openModal() {
    if (modalEl) {
      modalEl.remove();
      modalEl = null;
    }
    const adapter = findAdapter();
    if (!adapter) return;
    const selectedIndexes = selectionStore.getSelected();
    const table = document.querySelector(adapter.tableSelector);
    if (!table) return;
    const rows = table.querySelectorAll(adapter.rowSelector);
    const selectedItems = selectedIndexes.map((idx) => {
      const row = rows[idx];
      return {
        title: adapter.extractTitle(row),
        magnet: adapter.extractMagnet(row)
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
            <span class="amc-modal-title">${formatTitle(item.title)}</span>
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
    modalEl.querySelector("#amc-copy-long").onclick = async () => {
      const count = await copyMagnetsToClipboard(selectedItems);
      showToast(`已复制 ${count} 条磁力链`);
      closeModal();
    };
    modalEl.querySelector("#amc-cancel").onclick = closeModal;
    modalEl.querySelector(".amc-modal-overlay").onclick = (e) => {
      if (e.target === modalEl) closeModal();
    };
  }
  function closeModal() {
    if (modalEl) {
      modalEl.remove();
      modalEl = null;
    }
  }
  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "amc-toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2e3);
  }

  // src/components/Toolbar.ts
  function injectToolbar() {
    const toolbar = document.createElement("div");
    toolbar.id = "amc-toolbar";
    toolbar.innerHTML = `
    <span class="amc-toolbar-info">已选 <span id="amc-count">0</span> 项</span>
    <button id="amc-copy-btn" class="amc-btn" disabled>复制</button>
  `;
    document.body.appendChild(toolbar);
    const countEl = document.getElementById("amc-count");
    const copyBtn = document.getElementById("amc-copy-btn");
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

  // src/main.ts
  var STYLE_ID = "anime-magnet-collector-style";
  var { log } = createUtils({ config: CONFIG });
  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    if (typeof GM_addStyle === "function") {
      GM_addStyle(style_default);
    } else {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = style_default;
      document.head.appendChild(style);
    }
  }
  function init() {
    injectStyles();
    const adapter = findAdapter();
    if (!adapter) {
      log("未匹配的站点，脚本不执行");
      return;
    }
    log(`检测到站点: ${adapter.siteName}`);
    injectToolbar();
    injectCheckboxColumn(adapter);
    log("初始化完成");
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  if (typeof GM_registerMenuCommand === "function") {
    GM_registerMenuCommand("重新初始化", init);
  }
})();
