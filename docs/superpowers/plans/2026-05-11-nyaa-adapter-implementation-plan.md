# Nyaa Adapter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 https://nyaa.si/ 站点增加适配支持，复选框列在 Category 列左边，Modal 回显序号和 Name 列标题。

**Architecture:** 新增 `src/sites/nyaa.ts` 站点适配器文件，复用现有的 `CheckboxColumn`、`Toolbar`、`Modal`、`SelectionStore` 组件，通过 `SiteAdapter` 接口动态适配不同站点。

**Tech Stack:** TypeScript + Tampermonkey，纯原生实现无构建依赖。

---

## File Structure

| 操作 | 文件 |
|------|------|
| 新增 | `src/sites/nyaa.ts` — Nyaa 站点适配器 |
| 修改 | `src/sites/index.ts` — 注册 nyaa 适配器 |

---

## Task 1: 创建 nyaa.ts 适配器文件

**Files:**
- Create: `src/sites/nyaa.ts`

- [ ] **Step 1: Write the nyaa adapter file**

```typescript
import type { SiteAdapter } from "./types";
import { buildShortMagnet } from "../utils/magnet";

export const nyaaAdapter: SiteAdapter = {
  siteId: "nyaa",
  siteName: "Nyaa",
  matchPatterns: ["https://nyaa.si/*"],
  tableSelector: "table",
  rowSelector: "tbody tr",
  titleHeader: "Name",
  magnetCellSelector: 'a[href^="magnet:"]',

  extractMagnet(row: Element): string {
    const link = row.querySelector<HTMLAnchorElement>(this.magnetCellSelector);
    return link?.href ?? "";
  },

  extractTitle(row: Element): string {
    const cells = row.querySelectorAll("td");
    const cell = cells[1];
    return cell?.textContent?.trim().replace(/\s+/g, " ") ?? "";
  },

  buildShortMagnet(magnet: string): string | null {
    return buildShortMagnet(magnet);
  }
};
```

- [ ] **Step 2: Verify file syntax**

Run: `npx tsc --noEmit src/sites/nyaa.ts`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/sites/nyaa.ts
git commit -m "feat(sites): add nyaa.si adapter"
```

---

## Task 2: 注册 nyaa 适配器

**Files:**
- Modify: `src/sites/index.ts`

- [ ] **Step 1: Add nyaaAdapter to imports and adapters array**

In `src/sites/index.ts`, add the import and include `nyaaAdapter` in the adapters array:

```typescript
import { dmhyAdapter } from "./dmhy";
import { anonekoAdapter } from "./anoneko";
import { nyaaAdapter } from "./nyaa";
import type { SiteAdapter } from "./types";

export const adapters: SiteAdapter[] = [dmhyAdapter, anonekoAdapter, nyaaAdapter];
```

- [ ] **Step 2: Verify build**

Run: `bun run build`
Expected: Build succeeds, `dist/anime-magnet-collector.user.js` updated

- [ ] **Step 3: Commit**

```bash
git add src/sites/index.ts
git commit -m "feat(sites): register nyaa adapter in adapters list"
```

---

## Task 3: 验证适配器行为

**Files:**
- Modify: `src/sites/nyaa.ts` (if tests reveal issues)

- [ ] **Step 1: Test URL matching**

Open browser DevTools console on https://nyaa.si/?q=anime, run:
```javascript
// After tampermonkey script loads
const adapter = window.adapters?.find(a => a.siteId === "nyaa");
console.log("Found adapter:", adapter?.siteName);
```

- [ ] **Step 2: Test checkbox column injection**

Verify `.amc-checkbox-col` appears to the left of Category column.

- [ ] **Step 3: Test magnet extraction**

Select a row, click copy button in toolbar, verify modal shows correct title from Name column.

- [ ] **Step 4: Commit any fixes**

```bash
git add src/sites/nyaa.ts
git commit -m "fix(sites): nyaa adapter extraction logic"
```

---

## Self-Review Checklist

- [ ] Spec coverage: Nyaa adapter with `siteId: "nyaa"`, `matchPatterns: ["https://nyaa.si/*"]`, `extractTitle` using Name column index 1, `extractMagnet` using `a[href^="magnet:"]` selector
- [ ] Placeholder scan: No TBD/TODO, all code is concrete
- [ ] Type consistency: `SiteAdapter` interface fields match types.ts definitions
- [ ] File paths: All paths are exact and match the actual project structure
