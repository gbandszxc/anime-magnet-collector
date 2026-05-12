# bangumi.moe / acg.rip 适配器实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 anime-magnet-collector 新增两个站点适配器：bangumi.moe（API 获取 magnet）和 acg.rip（复制 torrent 链接）

**Architecture:**
- bangumi.moe：通过 MutationObserver 监听列表渲染，弹窗时根据选中索引计算所需页面，并发请求 API 缓存 magnet（按页请求，每页 30 条）
- acg.rip：标准表格结构，直接提取 .torrent 链接，视为短链特判

**Tech Stack:** TypeScript, Userscript (Tampermonkey), Chrome DevTools MCP

---

## 文件结构

```
src/sites/
  acgrip.ts      (新建)
  bangumi.ts     (新建)
  index.ts       (修改 - 注册新适配器)
  types.ts       (无改动)

src/components/
  Modal.ts       (修改 - acg.rip 短链特判)

src/main.ts      (可能需要调整)
```

---

## Task 1: 创建 acgrip.ts

**Files:**
- Create: `src/sites/acgrip.ts`
- Test: 在 acg.rip 列表页验证 checkbox 和弹窗

- [ ] **Step 1: 创建 src/sites/acgrip.ts**

```typescript
import type { SiteAdapter } from "./types";

export const acgripAdapter: SiteAdapter = {
  siteId: "acgrip",
  siteName: "ACG.RIP",
  matchPatterns: ["https://acg.rip/*"],
  tableSelector: "table",
  rowSelector: "tbody tr",
  titleHeader: "标题",
  magnetCellSelector: "a[href$='.torrent']",

  extractMagnet(row: Element): string {
    const link = row.querySelector<HTMLAnchorElement>(this.magnetCellSelector);
    return link?.href ?? "";
  },

  extractTitle(row: Element): string {
    const adapterExt = this as SiteAdapter & { _titleIdx?: number };
    const idx = adapterExt._titleIdx ?? 1;
    const cells = row.querySelectorAll("td");
    const cell = cells[idx];
    if (!cell) return "";
    const link = cell?.querySelector("a");
    return link?.textContent?.trim() ?? cell?.textContent?.trim() ?? "";
  },

  buildShortMagnet(magnet: string): string | null {
    // acg.rip 的 torrent 链接已是最终形式，直接返回
    return magnet;
  }
};
```

- [ ] **Step 2: 验证目录结构**

```bash
ls -la src/sites/acgrip.ts
```
Expected: 文件存在

- [ ] **Step 3: 提交**

```bash
git add src/sites/acgrip.ts
git commit -m "feat: add acgrip adapter for .torrent links"
```

---

## Task 2: 创建 bangumi.ts

**Files:**
- Create: `src/sites/bangumi.ts`
- Test: 在 bangumi.moe 列表页验证 checkbox 和弹窗

**关键实现：**

1. **Magnet 缓存 Map**：组件级变量，弹窗关闭时清空
2. **API 请求函数**：根据 URL 判断是 homepage 还是 search 页
3. **页面计算**：`p = Math.floor(index / 30) + 1`

```typescript
// src/sites/bangumi.ts

import type { SiteAdapter } from "./types";

export const bangumiAdapter: SiteAdapter = {
  siteId: "bangumi",
  siteName: "萌番组",
  matchPatterns: ["https://bangumi.moe/*"],
  tableSelector: "md-list.torrent-list",
  rowSelector: "md-list-item, [class*='torrent']",
  titleHeader: "",
  magnetCellSelector: "",

  extractMagnet(row: Element): string {
    // 不在这里提取，弹窗时从缓存获取
    return "";
  },

  extractTitle(row: Element): string {
    const titleLink = row.querySelector<HTMLAnchorElement>('a[href^="/torrent/"]');
    return titleLink?.textContent?.trim() ?? "";
  },

  buildShortMagnet(magnet: string): string | null {
    // magnet 已是完整形式，但短链生成由后端处理
    return magnet;
  }
};

// ============ Magnet 缓存 ============

let magnetCache = new Map<string, string>(); // id -> magnet

export function setMagnetCache(id: string, magnet: string): void {
  magnetCache.set(id, magnet);
}

export function getMagnetFromCache(id: string): string | undefined {
  return magnetCache.get(id);
}

export function clearMagnetCache(): void {
  magnetCache.clear();
}

export function buildMagnetCache(torrents: any[]): void {
  for (const t of torrents) {
    if (t._id && t.magnet) {
      magnetCache.set(t._id, t.magnet);
    }
  }
}
```

- [ ] **Step 1: 创建 src/sites/bangumi.ts（基础结构）**

```typescript
import type { SiteAdapter } from "./types";

export const bangumiAdapter: SiteAdapter = {
  siteId: "bangumi",
  siteName: "萌番组",
  matchPatterns: ["https://bangumi.moe/*"],
  tableSelector: "md-list.torrent-list",
  rowSelector: "md-list-item, [class*='torrent']",
  titleHeader: "",
  magnetCellSelector: "",

  extractMagnet(row: Element): string {
    return "";
  },

  extractTitle(row: Element): string {
    const titleLink = row.querySelector<HTMLAnchorElement>('a[href^="/torrent/"]');
    return titleLink?.textContent?.trim() ?? "";
  },

  buildShortMagnet(magnet: string): string | null {
    return magnet;
  }
};

// Magnet 缓存
let magnetCache = new Map<string, string>();

export function setMagnetCache(id: string, magnet: string): void {
  magnetCache.set(id, magnet);
}

export function getMagnetFromCache(id: string): string | undefined {
  return magnetCache.get(id);
}

export function clearMagnetCache(): void {
  magnetCache.clear();
}

export function buildMagnetCache(torrents: any[]): void {
  for (const t of torrents) {
    if (t._id && t.magnet) {
      magnetCache.set(t._id, t.magnet);
    }
  }
}
```

- [ ] **Step 2: 验证文件创建**

```bash
ls -la src/sites/bangumi.ts
```
Expected: 文件存在

- [ ] **Step 3: 提交**

```bash
git add src/sites/bangumi.ts
git commit -m "feat: add bangumi adapter structure with magnet cache"
```

---

## Task 3: 注册新适配器

**Files:**
- Modify: `src/sites/index.ts`

- [ ] **Step 1: 更新 index.ts**

在 import 区添加:
```typescript
import { bangumiAdapter } from "./bangumi";
import { acgripAdapter } from "./acgrip";
```

在 `adapters` 数组中添加:
```typescript
export const adapters: SiteAdapter[] = [
  dmhyAdapter, anonekoAdapter, nyaaAdapter, sukebeiAdapter,
  acgnxAdapter, shareacgnxAdapter,
  bangumiAdapter,   // 新增
  acgripAdapter     // 新增
];
```

- [ ] **Step 2: 验证构建**

```bash
cd /Volumes/Happy/ProjectSpace/github/anime-magnet-collector && bun run build
```
Expected: 构建成功，无错误

- [ ] **Step 3: 提交**

```bash
git add src/sites/index.ts
git commit -m "feat: register bangumi and acgrip adapters"
```

---

## Task 4: 实现 bangumi.moe API 缓存逻辑

**Files:**
- Modify: `src/sites/bangumi.ts`
- Modify: `src/main.ts`（添加 MutationObserver）

**核心逻辑：**

1. **判断页面类型**：
   - `https://bangumi.moe/` → GET `/api/torrent/latest`
   - `https://bangumi.moe/search/xxx` → POST `/api/torrent/search` with tag_id

2. **计算所需页面**：
   ```typescript
   function getRequiredPages(selectedIndexes: number[]): number[] {
     const pages = new Set<number>();
     for (const idx of selectedIndexes) {
       pages.add(Math.floor(idx / 30) + 1);
     }
     return Array.from(pages).sort((a, b) => a - b);
   }
   ```

3. **请求函数**：
   ```typescript
   async function fetchMagnetPage(page: number): Promise<any[]> {
     const isHomepage = window.location.pathname === "/";
     
     if (isHomepage) {
       const res = await fetch(`/api/torrent/latest?page=${page}`);
       const data = await res.json();
       return data.torrents || [];
     } else {
       // 从 URL 提取 tag_id: /search/{tag_id}
       const match = window.location.pathname.match(/\/search\/([^/]+)/);
       if (!match) return [];
       const tagId = match[1];
       
       const res = await fetch("/api/torrent/search", {
         method: "POST",
         headers: { "Content-Type": "text/plain;charset=UTF-8" },
         body: JSON.stringify({ tag_id: [tagId], p: page })
       });
       const data = await res.json();
       return data.torrents || [];
     }
   }
   ```

4. **批量获取并缓存**：
   ```typescript
   async function prefetchMagnetsForSelection(selectedIndexes: number[]): Promise<void> {
     const pages = getRequiredPages(selectedIndexes);
     const promises = pages.map(p => fetchMagnetPage(p));
     const results = await Promise.all(promises);
     for (const torrents of results) {
       buildMagnetCache(torrents);
     }
   }
   ```

- [ ] **Step 1: 添加 API 请求逻辑到 bangumi.ts**

追加以下函数到 `bangumi.ts`:

```typescript
// 判断是否为首页
function isHomepage(): boolean {
  return window.location.pathname === "/";
}

// 从 URL 提取 tag_id
function extractTagId(): string | null {
  const match = window.location.pathname.match(/\/search\/([^/]+)/);
  return match ? match[1] : null;
}

// 获取指定页的 torrents
async function fetchMagnetPage(page: number): Promise<any[]> {
  if (isHomepage()) {
    const res = await fetch(`/api/torrent/latest?page=${page}`);
    const data = await res.json();
    return data.torrents || [];
  } else {
    const tagId = extractTagId();
    if (!tagId) return [];
    
    const res = await fetch("/api/torrent/search", {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: JSON.stringify({ tag_id: [tagId], p: page })
    });
    const data = await res.json();
    return data.torrents || [];
  }
}

// 计算选中项需要哪些页
export function getRequiredPages(selectedIndexes: number[]): number[] {
  const pages = new Set<number>();
  for (const idx of selectedIndexes) {
    pages.add(Math.floor(idx / 30) + 1);
  }
  return Array.from(pages).sort((a, b) => a - b);
}

// 批量预取 magnet 并缓存
export async function prefetchMagnetsForSelection(selectedIndexes: number[]): Promise<void> {
  const pages = getRequiredPages(selectedIndexes);
  const promises = pages.map(p => fetchMagnetPage(p));
  const results = await Promise.all(promises);
  for (const torrents of results) {
    buildMagnetCache(torrents);
  }
}
```

- [ ] **Step 2: 验证 TypeScript 编译**

```bash
cd /Volumes/Happy/ProjectSpace/github/anime-magnet-collector && bun run build 2>&1
```
Expected: 无编译错误

- [ ] **Step 3: 提交**

```bash
git add src/sites/bangumi.ts
git commit -m "feat(bangumi): add API magnet prefetch logic"
```

---

## Task 5: 实现 Modal 弹窗 magnet 获取

**Files:**
- Modify: `src/components/Modal.ts`

**逻辑变更：**

对于 bangumi.moe，弹窗打开时：
1. 调用 `prefetchMagnetsForSelection(selectedIndexes)` 预取 magnet
2. 弹窗加载中显示 `"已加载 X/Y"`
3. 获取完成后，从缓存提取 magnet 显示

```typescript
// Modal.ts 中的 openModal 函数改造

// 进度显示
modalEl.innerHTML = `
  <div class="amc-modal">
    <div class="amc-modal-header">加载中... <span id="amc-progress">0/0</span></div>
  </div>
`;

const pages = getRequiredPages(selectedIndexes);
const progressEl = modalEl.querySelector("#amc-progress");

// 预取
await prefetchMagnetsForSelection(selectedIndexes);
```

- [ ] **Step 1: 更新 Modal.ts 支持 bangumi.moe**

在 `openModal` 函数开头添加：

```typescript
// 如果是 bangumi.moe，先预取 magnet
if (adapter.siteId === "bangumi") {
  const pages = getRequiredPages(selectedIndexes);
  // 显示加载进度
  const progressEl = modalEl.querySelector("#amc-progress");
  
  // 预取所有页
  await prefetchMagnetsForSelection(selectedIndexes);
}
```

- [ ] **Step 2: 验证构建**

```bash
bun run build 2>&1
```
Expected: 构建成功

- [ ] **Step 3: 提交**

```bash
git add src/components/Modal.ts
git commit -m "feat(modal): support bangumi magnet prefetch with progress"
```

---

## Task 6: acg.rip 短链特判

**Files:**
- Modify: `src/components/Modal.ts`

**需求：**

acg.rip 的 torrent 链接是最终形式，复制时直接复制，不显示"部分转换"提示。

**实现：**

在 Modal.ts 的短链按钮逻辑中，对 acg.rip 跳过混合提示：

```typescript
// 在短链按钮的 title 设置中
if (adapter.siteId === "acgrip") {
  shortBtn.title = "复制 torrent 链接";
} else {
  shortBtn.title = hasShort ? "所选包含短链，部分直接复制，部分转换" : "复制短链";
}
```

- [ ] **Step 1: 更新 Modal.ts**

找到短链按钮 title 设置逻辑，添加 acgrip 特判：

```typescript
// 在 shortBtn.title 设置处
if (adapter.siteId === "acgrip") {
  shortBtn.title = "复制 torrent 链接";
} else if (hasShort) {
  shortBtn.title = "所选包含短链，部分直接复制，部分转换";
}
```

- [ ] **Step 2: 验证构建**

```bash
bun run build 2>&1
```
Expected: 构建成功

- [ ] **Step 3: 提交**

```bash
git add src/components/Modal.ts
git commit -m "feat(modal): treat acgrip torrent links as short chain"
```

---

## Task 7: MutationObserver（可选，如需延迟注入）

**Files:**
- Modify: `src/main.ts`

**说明：**

bangumi.moe 的列表通过 AngularJS 渲染，可能需要等待渲染完成再注入 checkbox。

如果现有注入逻辑已能处理（等待 DOMContentLoaded），则跳过此任务。

- [ ] **Step 1: 检查 main.ts 现有逻辑**

读取 `src/main.ts`，检查是否需要添加 MutationObserver。

- [ ] **Step 2: 如需要，添加 observer**

```typescript
// 在 init() 中，findAdapter 之后
if (adapter.siteId === "bangumi") {
  // 等待 md-list 渲染完成
  const container = document.querySelector(adapter.tableSelector);
  if (container) {
    const observer = new MutationObserver((mutations, obs) => {
      const items = container.querySelectorAll(adapter.rowSelector);
      if (items.length > 0) {
        injectCheckboxColumn(adapter);
        obs.disconnect();
      }
    });
    observer.observe(container, { childList: true, subtree: true });
    return; // 延迟注入，observer 会触发
  }
}
```

- [ ] **Step 3: 验证构建并测试**

```bash
bun run build && bun run verify:dist
```

- [ ] **Step 4: 提交**

```bash
git add src/main.ts
git commit -m "feat: add MutationObserver for bangumi list rendering"
```

---

## Task 8: 整体验证

**测试步骤：**

1. **acg.rip 测试：**
   - 打开 https://acg.rip/
   - 勾选几条数据
   - 点击复制短链
   - 验证复制的是 .torrent 链接

2. **bangumi.moe 测试：**
   - 打开 https://bangumi.moe/
   - 等待列表渲染
   - 勾选几条数据
   - 点击复制长链/短链
   - 验证复制的是 magnet 链接
   - 验证加载进度显示正确

- [ ] **Step 1: 运行验证**

```bash
bun run verify:dist
```
Expected: 产物与源码一致

- [ ] **Step 2: 如有错误，修复并重新提交**

---

## 依赖关系

```
Task 1 (acgrip.ts)
    ↓
Task 3 (register in index.ts)
    ↓
Task 6 (acgrip short chain)

Task 2 (bangumi.ts structure)
    ↓
Task 4 (bangumi API logic)
    ↓
Task 5 (Modal prefetch)
    ↓
Task 7 (MutationObserver, optional)
    ↓
Task 8 (整体验证)
```

建议按顺序执行，或并行执行互不依赖的任务。
