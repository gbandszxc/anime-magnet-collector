# AcgnX 站点适配器实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 acgnx.se 和 share.acgnx.se 两个站点添加 Userscript 适配支持

**Architecture:** 两个站点结构相同，通过继承共享核心逻辑。创建 `src/sites/acgnx.ts` 和 `src/sites/shareacgnx.ts`，各自独立实现并注册到 `src/sites/index.ts`。

**Tech Stack:** TypeScript, Userscript

---

## 文件结构

```
src/sites/
├── types.ts          # SiteAdapter 接口定义 (不修改)
├── index.ts          # 站点注册 (需添加新适配器)
├── dmhy.ts           # 动漫花园 (不修改)
├── nyaa.ts           # Nyaa (不修改)
├── sukebei.ts        # Sukebei (不修改)
├── anoneko.ts        # 动漫花园镜像 (不修改)
├── acgnx.ts          # NEW: AcgnX 英文站
└── shareacgnx.ts     # NEW: AcgnX 中文站
```

---

## Task 1: 创建 acgnx.ts 英文站点适配器

**Files:**
- Create: `src/sites/acgnx.ts`

- [ ] **Step 1: 创建 acgnx.ts 文件**

```typescript
import type { SiteAdapter } from "./types";
import { buildShortMagnet } from "../utils/magnet";

export const acgnxAdapter: SiteAdapter = {
  siteId: "acgnx",
  siteName: "AcgnX",
  matchPatterns: ["https://www.acgnx.se/*"],
  tableSelector: "table#listTable",
  rowSelector: "tbody tr",
  titleHeader: "Name",
  magnetCellSelector: "#magnet",

  extractMagnet(row: Element): string {
    const link = row.querySelector<HTMLAnchorElement>("#magnet");
    return link?.href ?? "";
  },

  extractTitle(row: Element): string {
    const cells = row.querySelectorAll("td");
    const cell = cells[2]; // Date(0) | Category(1) | Name(2)
    const link = cell?.querySelector("a");
    return link?.textContent?.trim() ?? cell?.textContent?.trim() ?? "";
  },

  buildShortMagnet(magnet: string): string | null {
    return buildShortMagnet(magnet);
  }
};
```

- [ ] **Step 2: 验证文件创建成功**

Run: `ls -la src/sites/acgnx.ts`
Expected: 文件存在

- [ ] **Step 3: 提交**

```bash
git add src/sites/acgnx.ts
git commit -m "feat: 添加 acgnx.se 站点支持"
```

---

## Task 2: 创建 shareacgnx.ts 中文站点适配器

**Files:**
- Create: `src/sites/shareacgnx.ts`

- [ ] **Step 1: 创建 shareacgnx.ts 文件**

```typescript
import type { SiteAdapter } from "./types";
import { buildShortMagnet } from "../utils/magnet";

export const shareacgnxAdapter: SiteAdapter = {
  siteId: "shareacgnx",
  siteName: "AcgnX中文站",
  matchPatterns: ["https://share.acgnx.se/*"],
  tableSelector: "table#listTable",
  rowSelector: "tbody tr",
  titleHeader: "資源名稱",
  magnetCellSelector: "#magnet",

  extractMagnet(row: Element): string {
    const link = row.querySelector<HTMLAnchorElement>("#magnet");
    return link?.href ?? "";
  },

  extractTitle(row: Element): string {
    const cells = row.querySelectorAll("td");
    const cell = cells[2]; // 發佈時間(0) | 分類(1) | 資源名稱(2)
    const link = cell?.querySelector("a");
    return link?.textContent?.trim() ?? cell?.textContent?.trim() ?? "";
  },

  buildShortMagnet(magnet: string): string | null {
    return buildShortMagnet(magnet);
  }
};
```

- [ ] **Step 2: 验证文件创建成功**

Run: `ls -la src/sites/shareacgnx.ts`
Expected: 文件存在

- [ ] **Step 3: 提交**

```bash
git add src/sites/shareacgnx.ts
git commit -m "feat: 添加 share.acgnx.se 站点支持"
```

---

## Task 3: 注册新站点到 index.ts

**Files:**
- Modify: `src/sites/index.ts:1-17`

- [ ] **Step 1: 添加 import 语句**

在文件顶部添加：

```typescript
import { acgnxAdapter } from "./acgnx";
import { shareacgnxAdapter } from "./shareacgnx";
```

- [ ] **Step 2: 更新 adapters 数组**

将 `src/sites/index.ts:7` 修改为：

```typescript
export const adapters: SiteAdapter[] = [dmhyAdapter, anonekoAdapter, nyaaAdapter, sukebeiAdapter, acgnxAdapter, shareacgnxAdapter];
```

- [ ] **Step 3: 验证 TypeScript 编译**

Run: `bun run build` 或 `npx tsc --noEmit`
Expected: 无编译错误

- [ ] **Step 4: 提交**

```bash
git add src/sites/index.ts
git commit -m "feat: 注册 acgnx 和 shareacgnx 站点适配器"
```

---

## Task 4: 验证构建

**Files:**
- Modify: `dist/anime-magnet-collector.user.js` (通过 build 生成)

- [ ] **Step 1: 运行构建**

Run: `bun run build`
Expected: 构建成功，产物生成到 `dist/`

- [ ] **Step 2: 验证产物包含新站点**

Run: `grep -c "acgnx\|shareacgnx" dist/anime-magnet-collector.user.js`
Expected: 输出大于 0

- [ ] **Step 3: 运行 verify:dist**

Run: `bun run verify:dist`
Expected: 验证通过

- [ ] **Step 4: 最终提交**

```bash
git add -A
git commit -m "feat: 完成 acgnx.se 和 share.acgnx.se 站点适配

- 新增 acgnx.ts 英文站点适配器
- 新增 shareacgnx.ts 中文站点适配器
- 注册到 adapters 数组"
```

---

## 验证清单

- [ ] `src/sites/acgnx.ts` 存在且编译通过
- [ ] `src/sites/shareacgnx.ts` 存在且编译通过
- [ ] `src/sites/index.ts` 包含两个新适配器的 import 和注册
- [ ] `bun run build` 成功
- [ ] `bun run verify:dist` 通过
