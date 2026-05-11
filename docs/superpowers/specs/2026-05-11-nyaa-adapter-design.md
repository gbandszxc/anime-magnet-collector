# Nyaa 站点适配器设计

## 目标

参考动漫花园 (dmhy) 的实现，为 https://nyaa.si/ 站点增加适配支持。悬浮窗复制展开逻辑不变，复选框列同样插入在最左侧（Category 列左边），选中后 Modal 回显序号和 Name 列标题。

## 架构

**新增文件：**
- `src/sites/nyaa.ts` — Nyaa 站点适配器

**修改文件：**
- `src/sites/index.ts` — 注册 nyaa 适配器

**复用现有实现（无需修改）：**
- `CheckboxColumn.ts` — 通过 `SiteAdapter` 接口动态计算列索引
- `Toolbar.ts` / `Modal.ts` — 通过 `SelectionStore` + `SiteAdapter` 驱动
- `SelectionStore.ts` — 状态管理
- `utils/magnet.ts` — 磁链工具函数

## Nyaa 页面结构

| 列索引 | 表头 | 内容 |
|--------|------|------|
| 0 | Category | 分类图标 |
| 1 | Name | 标题链接 |
| 2 | Comments | **磁链 + 种子下载链接**（同一单元格） |
| 3 | Size | 文件大小 |
| 4 | Date | 上传日期 |
| 5 | Seeders | 做种数 |
| 6 | Leechers | 吸血数 |
| 7 | Downloads | 下载数 |

磁链选择器：`a[href^="magnet:"]`（在 Comments 列内）

## Nyaa 适配器实现

```typescript
// src/sites/nyaa.ts
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
    const cell = cells[1]; // Name 列
    return cell?.textContent?.trim().replace(/\s+/g, " ") ?? "";
  },

  buildShortMagnet(magnet: string): string | null {
    return buildShortMagnet(magnet);
  }
};
```

## 交互逻辑

| 行为 | 处理方式 |
|------|----------|
| 复选框位置 | Category 列左边，与 dmhy 一致 |
| 翻页选中状态 | 不保持，只在当前页有效 |
| Modal 回显 | 序号 + Name 列标题，与 dmhy 一致 |
| 磁链提取 | 只取 `a[href^="magnet:"]`，忽略种子下载链接 |

## 适配器注册

在 `src/sites/index.ts` 中添加：

```typescript
import { nyaaAdapter } from "./nyaa";

export const adapters: SiteAdapter[] = [dmhyAdapter, anonekoAdapter, nyaaAdapter];
```

## 验证清单

- [ ] 打开 `https://nyaa.si/?q=anime` 悬浮窗正常显示
- [ ] 左侧出现 checkbox 列，Category 列左边
- [ ] 勾选 N 个 checkbox，悬浮窗计数正确
- [ ] 全选/取消全选有效
- [ ] 点击复制按钮，Modal 展开显示序号和标题
- [ ] 复制长链/短链正确
- [ ] 翻页后选中状态清空
