// ==UserScript==
// @name         Anime Magnet Collector
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  动漫BT站点增加复选框批量复制磁力链接
// @author       gbandszxc
// @match      https://share.dmhy.org/*
// @match      https://dmhy.anoneko.com/*
// @grant      GM_addStyle
// @grant      GM_log
// @updateURL    https://raw.githubusercontent.com/gbandszxc/anime-magnet-collector/main/dist/anime-magnet-collector.user.js
// @downloadURL  https://raw.githubusercontent.com/gbandszxc/anime-magnet-collector/main/dist/anime-magnet-collector.user.js
// @license      MIT
// ==/UserScript==

"use strict";
(() => {
  // src/style.css
  var style_default = "/* ========================\n   Anime Magnet Collector\n   ======================== */\n\n/* Floating Panel */\n#amc-float {\n  position: fixed;\n  z-index: 2147483647;\n  display: flex;\n  align-items: center;\n  gap: 2px;\n  background: rgba(255, 255, 255, 0.95);\n  backdrop-filter: blur(12px);\n  -webkit-backdrop-filter: blur(12px);\n  border: 1px solid rgba(0, 0, 0, 0.1);\n  border-radius: 999px;\n  padding: 6px 12px 6px 8px;\n  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.08);\n  font-family: system-ui, -apple-system, sans-serif;\n  font-size: 13px;\n  user-select: none;\n  cursor: default;\n  transition: box-shadow 0.2s ease;\n}\n\n#amc-float:hover {\n  box-shadow: 0 6px 28px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.1);\n}\n\n#amc-float.amc-float-dragging {\n  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.12);\n  cursor: grabbing;\n}\n\n.amc-float-handle {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 24px;\n  height: 24px;\n  color: #999;\n  cursor: grab;\n  border-radius: 50%;\n  transition: color 0.15s ease, background 0.15s ease;\n}\n\n.amc-float-handle:hover {\n  color: #666;\n  background: rgba(0, 0, 0, 0.05);\n}\n\n.amc-float-dragging .amc-float-handle {\n  cursor: grabbing;\n}\n\n.amc-float-content {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n\n.amc-float-count {\n  color: #333;\n  font-weight: 500;\n  white-space: nowrap;\n}\n\n.amc-float-count span {\n  color: #4CAF50;\n  font-weight: 700;\n}\n\n.amc-float-btn {\n  padding: 5px 14px;\n  border-radius: 999px;\n  border: none;\n  font-size: 13px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.15s ease;\n  white-space: nowrap;\n}\n\n.amc-float-btn:not(:disabled) {\n  background: #4CAF50;\n  color: white;\n}\n\n.amc-float-btn:not(:disabled):hover {\n  background: #43a047;\n  transform: scale(1.02);\n}\n\n.amc-float-btn:disabled {\n  background: rgba(0, 0, 0, 0.08);\n  color: #aaa;\n  cursor: not-allowed;\n}\n\n/* Checkbox Column */\n.amc-checkbox-col {\n  padding: 4px !important;\n}\n\n.amc-checkbox-row,\n.amc-checkbox-header {\n  width: 16px;\n  height: 16px;\n  cursor: pointer;\n}\n\n/* Modal Overlay */\n.amc-modal-overlay {\n  position: fixed;\n  inset: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 2147483647;\n  font-family: system-ui, sans-serif;\n}\n\n/* Modal */\n.amc-modal {\n  background: white;\n  border-radius: 8px;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);\n  width: 90%;\n  max-width: 500px;\n  max-height: 80vh;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}\n\n.amc-modal-header {\n  padding: 16px 20px;\n  font-size: 16px;\n  font-weight: 600;\n  border-bottom: 1px solid #eee;\n  color: #333;\n}\n\n.amc-modal-list {\n  padding: 12px 20px;\n  overflow-y: auto;\n  flex: 1;\n}\n\n.amc-modal-item {\n  display: flex;\n  padding: 6px 0;\n  font-size: 14px;\n  color: #444;\n}\n\n.amc-modal-num {\n  color: #888;\n  margin-right: 8px;\n  min-width: 24px;\n}\n\n.amc-modal-title {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.amc-modal-footer {\n  padding: 16px 20px;\n  border-top: 1px solid #eee;\n  display: flex;\n  gap: 8px;\n  justify-content: flex-end;\n}\n\n/* Toast */\n.amc-toast {\n  position: fixed;\n  bottom: 20px;\n  left: 50%;\n  transform: translateX(-50%);\n  background: #333;\n  color: white;\n  padding: 10px 20px;\n  border-radius: 4px;\n  font-size: 14px;\n  z-index: 2147483647;\n  font-family: system-ui, sans-serif;\n  animation: amc-fade-in 0.2s ease;\n}\n\n@keyframes amc-fade-in {\n  from { opacity: 0; transform: translateX(-50%) translateY(10px); }\n  to { opacity: 1; transform: translateX(-50%) translateY(0); }\n}\n";

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
    titleHeader: "標題",
    magnetCellSelector: 'a[href^="magnet:"]',
    extractMagnet(row) {
      const link = row.querySelector(this.magnetCellSelector);
      return link?.href ?? "";
    },
    extractTitle(row) {
      const adapterExt = this;
      const idx = adapterExt._titleIdx ?? 3;
      const cells = row.querySelectorAll("td");
      const cell = cells[idx];
      if (!cell) return "";
      return cell.textContent?.trim().replace(/\s+/g, " ") ?? "";
    },
    buildShortMagnet(magnet) {
      return null;
    }
  };

  // src/sites/anoneko.ts
  var anonekoAdapter = {
    ...dmhyAdapter,
    siteId: "anoneko",
    siteName: "动漫花园(镜像)",
    matchPatterns: ["https://dmhy.anoneko.com/*"]
  };

  // src/sites/index.ts
  var adapters = [dmhyAdapter, anonekoAdapter];
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
  function findCellIndex(adapter, headerText) {
    const table = document.querySelector(adapter.tableSelector);
    if (!table) return -1;
    const thead = table.querySelector("thead");
    if (!thead) return -1;
    const headers = thead.querySelectorAll("th");
    for (let i = 0; i < headers.length; i++) {
      const text = headers[i].textContent?.trim() ?? "";
      if (text === headerText) {
        return i + 1;
      }
    }
    return -1;
  }
  function getColumnIndices(adapter) {
    const table = document.querySelector(adapter.tableSelector);
    if (!table) return { titleCellIndex: -1, magnetCellIndex: -1 };
    const titleIdx = findCellIndex(adapter, adapter.titleHeader);
    const firstRow = table.querySelector(adapter.rowSelector);
    const magnetEl = firstRow?.querySelector(adapter.magnetCellSelector);
    const magnetTd = magnetEl?.parentElement;
    const magnetIdx = magnetTd ? Array.from(magnetTd.parentElement.children).indexOf(magnetTd) + 1 : -1;
    return { titleCellIndex: titleIdx, magnetCellIndex: magnetIdx };
  }
  function injectCheckboxColumn(adapter) {
    const table = document.querySelector(adapter.tableSelector);
    if (!table) return;
    if (table.querySelector(".amc-checkbox-col")) return;
    const thead = table.querySelector("thead");
    const tbody = table.querySelector("tbody");
    if (!thead || !tbody) return;
    const indices = getColumnIndices(adapter);
    adapter._titleIdx = indices.titleCellIndex;
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
    toolbar.id = "amc-float";
    toolbar.innerHTML = `
    <div class="amc-float-handle">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
      </svg>
    </div>
    <div class="amc-float-content">
      <span class="amc-float-count"><span id="amc-count">0</span> 项</span>
      <button id="amc-copy-btn" class="amc-float-btn" disabled>复制</button>
    </div>
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
    initFloatPanel(toolbar);
  }
  function initFloatPanel(panel) {
    const handle = panel.querySelector(".amc-float-handle");
    const state = {
      dragging: false,
      offset: { x: 0, y: 0 },
      snapped: null
    };
    const snapDistance = 10;
    const edgeMargin = 16;
    function getDefaultPosition() {
      return { x: window.innerWidth - panel.offsetWidth - edgeMargin, y: window.innerHeight / 2 - panel.offsetHeight / 2 };
    }
    function initPosition() {
      const pos = getDefaultPosition();
      panel.style.left = `${pos.x}px`;
      panel.style.top = `${pos.y}px`;
      panel.style.right = "auto";
      state.snapped = "right";
    }
    function snapToEdge(mouseX) {
      const panelRect = panel.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      if (mouseX < viewportWidth / 2) {
        panel.style.left = `${edgeMargin}px`;
        panel.style.right = "auto";
        state.snapped = "left";
      } else {
        panel.style.left = "auto";
        panel.style.right = `${edgeMargin}px`;
        state.snapped = "right";
      }
    }
    function onMouseDown(e) {
      if (e.target.closest(".amc-float-btn")) return;
      e.preventDefault();
      state.dragging = true;
      const rect = panel.getBoundingClientRect();
      state.offset.x = e.clientX - rect.left;
      state.offset.y = e.clientY - rect.top;
      panel.classList.add("amc-float-dragging");
    }
    function onMouseMove(e) {
      if (!state.dragging) return;
      const x = e.clientX - state.offset.x;
      const y = e.clientY - state.offset.y;
      panel.style.left = `${x}px`;
      panel.style.top = `${y}px`;
      panel.style.right = "auto";
      state.snapped = null;
    }
    function onMouseUp(e) {
      if (!state.dragging) return;
      state.dragging = false;
      panel.classList.remove("amc-float-dragging");
      snapToEdge(e.clientX);
    }
    function onResize() {
      if (state.snapped === "left") {
        panel.style.left = `${edgeMargin}px`;
        panel.style.right = "auto";
      } else if (state.snapped === "right") {
        panel.style.left = "auto";
        panel.style.right = `${edgeMargin}px`;
      }
    }
    handle.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    window.addEventListener("resize", onResize);
    handle.addEventListener("touchstart", (e) => {
      if (e.target.closest(".amc-float-btn")) return;
      e.preventDefault();
      const touch = e.touches[0];
      state.dragging = true;
      const rect = panel.getBoundingClientRect();
      state.offset.x = touch.clientX - rect.left;
      state.offset.y = touch.clientY - rect.top;
      panel.classList.add("amc-float-dragging");
    }, { passive: false });
    document.addEventListener("touchmove", (e) => {
      if (!state.dragging) return;
      const touch = e.touches[0];
      panel.style.left = `${touch.clientX - state.offset.x}px`;
      panel.style.top = `${touch.clientY - state.offset.y}px`;
      panel.style.right = "auto";
      state.snapped = null;
    });
    document.addEventListener("touchend", (e) => {
      if (!state.dragging) return;
      state.dragging = false;
      panel.classList.remove("amc-float-dragging");
      const touch = e.changedTouches[0];
      snapToEdge(touch.clientX);
    });
    requestAnimationFrame(initPosition);
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
