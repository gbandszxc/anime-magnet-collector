# Anime Magnet Collector 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**目标：** 在动漫花园站点实现复选框批量选择和复制磁力链接功能，架构支持多站点扩展

**架构：** 站点适配器模式 + 组件化。选择状态通过 SelectionStore 集中管理，Toolbar 订阅状态变化自动更新。Modal 展示选中列表并提供复制操作。

**技术栈：** TypeScript + esbuild，无外部依赖，仅用 Tampermonkey API

---

## 文件结构

```
src/
├── main.ts              # 入口，初始化站点适配器
├── config.ts           # 站点配置列表
├── sites/
│   ├── types.ts        # SiteAdapter 接口
│   ├── dmhy.ts         # 动漫花园适配器
│   └── index.ts        # 站点注册表
├── components/
│   ├── SelectionStore.ts # 选择状态管理
│   ├── CheckboxColumn.ts # 复选框列注入
│   ├── Toolbar.ts        # 浮动工具栏
│   └── Modal.ts         # 预览复制弹窗
├── utils/
│   └── magnet.ts       # 磁力链解析/格式化
└── style.css           # 所有样式
```

---

## Task 1: 创建站点适配器类型定义

**Files:**
- Create: `src/sites/types.ts`

- [ ] **Step 1: 编写站点适配器接口**

```typescript
export interface SiteAdapter {
  siteId: string;                    // 唯一标识
  siteName: string;                   // 显示名称
  matchPatterns: string[];             // @match URL模式列表
  tableSelector: string;               // 主列表表格选择器
  rowSelector: string;                // 表格行选择器
  magnetCellIndex: number;            // 磁链列索引
  titleCellIndex: number;             // 标题列索引
  extractMagnet(row: Element): string; // 从行提取磁力链
  extractTitle(row: Element): string;  // 从行提取标题
  buildShortMagnet?(magnet: string): string | null; // 长链转短链（可选）
}

export interface MagnetItem {
  title: string;
  magnet: string;
  shortMagnet?: string;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/sites/types.ts
git commit -m "feat: add SiteAdapter interface and MagnetItem type"
```

---

## Task 2: 创建磁力链工具函数

**Files:**
- Create: `src/utils/magnet.ts`

- [ ] **Step 1: 编写磁力链工具函数**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/magnet.ts
git commit -m "feat: add magnet utility functions"
```

---

## Task 3: 创建选择状态管理器

**Files:**
- Create: `src/components/SelectionStore.ts`

- [ ] **Step 1: 编写 SelectionStore**

```typescript
type SelectionChangeCallback = (count: number) => void;

class SelectionStore {
  private selected = new Set<number>();
  private listeners = new Set<SelectionChangeCallback>();

  toggle(index: number): void {
    if (this.selected.has(index)) {
      this.selected.delete(index);
    } else {
      this.selected.add(index);
    }
    this.notify();
  }

  selectAll(indexes: number[]): void {
    indexes.forEach(i => this.selected.add(i));
    this.notify();
  }

  deselectAll(): void {
    this.selected.clear();
    this.notify();
  }

  isSelected(index: number): boolean {
    return this.selected.has(index);
  }

  getSelected(): number[] {
    return Array.from(this.selected);
  }

  getCount(): number {
    return this.selected.size;
  }

  onChange(callback: SelectionChangeCallback): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notify(): void {
    this.listeners.forEach(cb => cb(this.getCount()));
  }
}

export const selectionStore = new SelectionStore();
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SelectionStore.ts
git commit -m "feat: add SelectionStore for managing checkbox state"
```

---

## Task 4: 创建 dmhy 站点适配器

**Files:**
- Create: `src/sites/dmhy.ts`

- [ ] **Step 1: 编写 dmhy 适配器**

```typescript
import type { SiteAdapter } from "./types";

export const dmhyAdapter: SiteAdapter = {
  siteId: "dmhy",
  siteName: "动漫花园",
  matchPatterns: ["https://share.dmhy.org/*"],
  tableSelector: "table#topic_list",
  rowSelector: "tbody tr",
  magnetCellIndex: 3,
  titleCellIndex: 2,

  extractMagnet(row: Element): string {
    const cells = row.querySelectorAll("td");
    const cell = cells[this.magnetCellIndex];
    const link = cell?.querySelector('a[href^="magnet:"]') as HTMLAnchorElement | null;
    return link?.href ?? "";
  },

  extractTitle(row: Element): string {
    const cells = row.querySelectorAll("td");
    const cell = cells[this.titleCellIndex];
    if (!cell) return "";
    // 标题在 <a> 标签或直接文本中，取最后一层文本
    const lastLink = cell.querySelector("a:last-of-type");
    return lastLink?.textContent?.trim() ?? cell.textContent.trim();
  },

  buildShortMagnet(magnet: string): string | null {
    // dmhy 暂无短链支持
    return null;
  }
};
```

- [ ] **Step 2: 编写站点注册表**

```typescript
import { dmhyAdapter } from "./dmhy";
import type { SiteAdapter } from "./types";

export const adapters: SiteAdapter[] = [dmhyAdapter];

export function findAdapter(): SiteAdapter | undefined {
  const url = window.location.href;
  return adapters.find(a =>
    a.matchPatterns.some(pattern => {
      const regex = new RegExp("^" + pattern.replace(/\*/g, ".*") + "$");
      return regex.test(url);
    })
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/sites/dmhy.ts src/sites/index.ts
git commit -m "feat: add dmhy site adapter"
```

---

## Task 5: 创建复选框列组件

**Files:**
- Create: `src/components/CheckboxColumn.ts`

- [ ] **Step 1: 编写 CheckboxColumn 组件**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CheckboxColumn.ts
git commit -m "feat: add CheckboxColumn component"
```

---

## Task 6: 创建浮动工具栏组件

**Files:**
- Create: `src/components/Toolbar.ts`

- [ ] **Step 1: 编写 Toolbar 组件**

```typescript
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
  const copyBtn = document.getElementById("amc-copy-btn")!;

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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Toolbar.ts
git commit -m "feat: add Toolbar component"
```

---

## Task 7: 创建预览复制 Modal 组件

**Files:**
- Create: `src/components/Modal.ts`

- [ ] **Step 1: 编写 Modal 组件**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Modal.ts
git commit -m "feat: add Modal component for preview and copy"
```

---

## Task 8: 更新样式文件

**Files:**
- Modify: `src/style.css`

- [ ] **Step 1: 追加所有样式到 style.css**

```css
/* ========================
   Anime Magnet Collector
   ======================== */

/* Toolbar */
#amc-toolbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: #f8f8f8;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 12px;
  z-index: 2147483647;
  font-size: 14px;
  font-family: system-ui, sans-serif;
}

.amc-toolbar-info {
  color: #333;
}

#amc-copy-btn:not(:disabled) {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 6px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

#amc-copy-btn:disabled {
  background: #ccc;
  color: #888;
  border: none;
  padding: 6px 16px;
  border-radius: 4px;
  cursor: not-allowed;
}

.amc-btn {
  padding: 6px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  border: 1px solid #ccc;
  background: #fff;
}

.amc-btn-primary {
  background: #4CAF50;
  color: white;
  border: none;
}

/* Checkbox Column */
.amc-checkbox-col {
  padding: 4px !important;
}

.amc-checkbox-row,
.amc-checkbox-header {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

/* Modal Overlay */
.amc-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2147483647;
  font-family: system-ui, sans-serif;
}

/* Modal */
.amc-modal {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.amc-modal-header {
  padding: 16px 20px;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid #eee;
  color: #333;
}

.amc-modal-list {
  padding: 12px 20px;
  overflow-y: auto;
  flex: 1;
}

.amc-modal-item {
  display: flex;
  padding: 6px 0;
  font-size: 14px;
  color: #444;
}

.amc-modal-num {
  color: #888;
  margin-right: 8px;
  min-width: 24px;
}

.amc-modal-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.amc-modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

/* Toast */
.amc-toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  z-index: 2147483647;
  font-family: system-ui, sans-serif;
  animation: amc-fade-in 0.2s ease;
}

@keyframes amc-fade-in {
  from { opacity: 0; transform: translateX(-50%) translateY(10px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/style.css
git commit -m "feat: add all component styles"
```

---

## Task 9: 更新主入口文件

**Files:**
- Modify: `src/main.ts`

- [ ] **Step 1: 重写 main.ts**

```typescript
/// <reference types="@types/tampermonkey" />
import cssText from "./style.css";
import { CONFIG } from "./config";
import { createUtils } from "./utils";
import { findAdapter } from "./sites/index";
import { injectCheckboxColumn } from "./components/CheckboxColumn";
import { injectToolbar } from "./components/Toolbar";

const STYLE_ID = "anime-magnet-collector-style";
const { log } = createUtils({ config: CONFIG });

function injectStyles(): void {
  if (document.getElementById(STYLE_ID)) return;
  if (typeof GM_addStyle === "function") {
    GM_addStyle(cssText);
  } else {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = cssText;
    document.head.appendChild(style);
  }
}

function init(): void {
  injectStyles();

  const adapter = findAdapter();
  if (!adapter) {
    log("未匹配的站点，脚本不执行");
    return;
  }

  log(`检测到站点: ${adapter.siteName}`);

  injectToolbar();
  injectCheckboxColumn(adapter);

  // 监听动态内容（SPA / 无限滚动页面）
  let timer: ReturnType<typeof setTimeout> | null = null;
  const observer = new MutationObserver(() => {
    if (timer) return;
    timer = setTimeout(() => {
      timer = null;
      // 动态内容变化时重新注入 checkbox 列
      injectCheckboxColumn(adapter);
    }, 300);
  });

  observer.observe(document.body, { childList: true, subtree: true });

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
```

- [ ] **Step 2: Commit**

```bash
git add src/main.ts
git commit -m "feat: wire up all components in main entry"
```

---

## Task 10: 更新构建脚本支持多站点 @match

**Files:**
- Modify: `scripts/build.mjs`

- [ ] **Step 1: 更新 build.mjs 动态生成 @match**

```javascript
import path from "node:path";
import { mkdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { build, context } from "esbuild";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const packageJson = JSON.parse(await readFile(path.join(projectRoot, "package.json"), "utf8"));
const version = packageJson.version;
const distRelativePath = "dist/anime-magnet-collector.user.js";
const rawDistUrl = "gbandszxc"
  ? `https://raw.githubusercontent.com/gbandszxc/anime-magnet-collector/main/${distRelativePath}`
  : null;

const entryFile = path.join(projectRoot, "src", "main.ts");
const outputFile = path.join(projectRoot, distRelativePath);
const isWatchMode = process.argv.includes("--watch");

// 动态读取站点适配器的 matchPatterns
const { adapters } = await import(path.join(projectRoot, "src", "sites", "index.ts"));
const matchLines = adapters.flatMap(a =>
  a.matchPatterns.map(p => `// @match      ${p}`)
);

const grantLines = [
  `// @grant      GM_addStyle`,
  `// @grant      GM_log`
];

const metadataLines = [
  "// ==UserScript==",
  "// @name         Anime Magnet Collector",
  "// @namespace    http://tampermonkey.net/",
  `// @version      ${version}`,
  "// @description  动漫BT站点增加复选框批量复制磁力链接",
  "// @author       gbandszxc",
  ...matchLines,
  ...grantLines,
  ...(rawDistUrl ? [
    `// @updateURL    ${rawDistUrl}`,
    `// @downloadURL  ${rawDistUrl}`,
  ] : []),
  "// @license      MIT",
  "// ==/UserScript=="
];

const metadata = metadataLines.join("\n");

const buildOptions = {
  entryPoints: [entryFile],
  outfile: outputFile,
  bundle: true,
  format: "iife",
  platform: "browser",
  target: "es2020",
  charset: "utf8",
  legalComments: "none",
  loader: { ".css": "text" },
  banner: { js: `${metadata}\n` }
};

await mkdir(path.dirname(outputFile), { recursive: true });

if (isWatchMode) {
  const ctx = await context(buildOptions);
  await ctx.watch();
  console.log("Watching build...");
} else {
  await build(buildOptions);
  console.log(`Build completed: ${outputFile}`);
}
```

- [ ] **Step 2: Commit**

```bash
git add scripts/build.mjs
git commit -m "feat(build): dynamically generate @match from site adapters"
```

---

## Task 11: 验证构建

**Files:**
- Run: `bun run build`
- Run: `bun run verify:dist`

- [ ] **Step 1: 执行构建和验证**

```bash
bun run build && bun run verify:dist
```

- [ ] **Step 2: 确认产物包含正确的 @match**

检查 `dist/anime-magnet-collector.user.js` 包含:
```
// @match      https://share.dmhy.org/*
```

---

## 自检清单

| 功能 | 对应 Task |
|------|-----------|
| 站点适配器接口 + dmhy 实现 | Task 1, 4 |
| SelectionStore 状态管理 | Task 3 |
| 磁力链工具函数 | Task 2 |
| CheckboxColumn 注入 | Task 5 |
| Toolbar 浮动工具栏 | Task 6 |
| Modal 预览复制 | Task 7 |
| 样式 | Task 8 |
| 入口文件 | Task 9 |
| 多站点 @match | Task 10 |

**类型一致性检查：**
- `SiteAdapter` 定义于 Task 1，被 Task 4, 5, 7, 9, 10 引用
- `MagnetItem` 定义于 Task 1，被 Task 2 引用
- `selectionStore` 定义于 Task 3，被 Task 5, 6, 7 引用
- `findAdapter` 定义于 Task 4，被 Task 7, 9 引用

所有引用点方法签名一致。
