# 站点适配器开发指南

本文档说明如何为 anime-magnet-collector 添加新的站点支持。

---

## 概念

**站点适配器 (SiteAdapter)** 是一个包含站点信息和解析逻辑的 JavaScript 对象。它告诉脚本：
- 如何识别当前页面是否属于该站点
- 如何找到资源列表表格
- 如何从表格每一行提取磁力链接和标题

脚本通过 `@match` 将自身注入到匹配的页面，然后根据对应的适配器来操作 DOM。

---

## 适配器类型

### SiteAdapter 完整结构

```typescript
interface SiteAdapter {
  siteId: string;                    // 唯一标识，如 "nyaa"
  siteName: string;                   // 显示名称，如 "Nyaa"
  matchPatterns: string[];           // URL 匹配模式，支持通配符 *

  tableSelector: string;              // 表格 CSS 选择器
  rowSelector: string;                // 表格行选择器（tbody tr 等）
  titleHeader: string;               // 标题列的表头文字（精确匹配）
  magnetCellSelector: string;        // 磁链元素的 CSS 选择器

  extractMagnet(row: Element): string;      // 从行提取磁链
  extractTitle(row: Element): string;       // 从行提取标题
  buildShortMagnet?(magnet: string): string | null; // 长链转短链
}
```

### 创建方式

有两种创建适配器的模式：

**模式 A：独立完整定义**
直接创建包含所有必要字段的适配器对象。

**模式 B：继承扩展（推荐用于结构相似的站点）**
复制一个已有的适配器，然后只覆盖需要变化的字段。

---

## 开发流程

### 第一阶段：分析目标站点

打开目标站点页面，执行以下分析脚本。

#### 1. 获取表格基本信息

```javascript
// 获取页面所有表格的 id 和 class
document.querySelectorAll('table').forEach((t, i) => {
  console.log(`Table ${i}: id="${t.id}" class="${t.className}"`);
});
```

#### 2. 获取表头列名

```javascript
// 获取表头单元格文字
const headers = Array.from(document.querySelectorAll('table th')).map(th => th.textContent.trim());
console.log('Headers:', headers);
```

#### 3. 获取表格行结构和磁链

```javascript
// 获取第一行数据
const firstRow = document.querySelector('table tbody tr');
if (firstRow) {
  console.log('Cells:');
  firstRow.querySelectorAll('td').forEach((td, i) => {
    console.log(`  [${i}] ${td.textContent.trim().substring(0, 40)}`);
  });

  // 检查磁链元素
  const magnetLink = firstRow.querySelector('a[href^="magnet:"]');
  console.log('Magnet link:', magnetLink?.href);
}
```

#### 4. 确定关键信息

| 字段 | 来源 | 示例 |
|------|------|------|
| `tableSelector` | 表格的 id 或 class | `"table#listTable"` |
| `rowSelector` | 表格行元素 | `"tbody tr"` |
| `titleHeader` | 标题列的表头文字 | `"Name"` |
| `magnetCellSelector` | 磁链元素选择器 | `"a[href^='magnet:']"` |

#### 5. 分析标题列索引

根据表头确定标题列的位置（从 0 开始计数）。但脚本会自动通过 `titleHeader` 匹配找到正确的列索引，无需手动计算。

如果目标站点结构与现有站点相似，可以跳过本步骤，直接使用继承模式。

---

### 第二阶段：创建适配器

#### 模式 A：独立定义

当目标站点结构与现有站点差异较大时使用。

```typescript
import type { SiteAdapter } from "./types";
import { buildShortMagnet } from "../utils/magnet";

export const mysiteAdapter: SiteAdapter = {
  siteId: "mysite",
  siteName: "我的站点",
  matchPatterns: ["https://mysite.com/*"],

  tableSelector: "table#listTable",
  rowSelector: "tbody tr",
  titleHeader: "Name",
  magnetCellSelector: "a[href^='magnet:']",

  extractMagnet(row: Element): string {
    const link = row.querySelector<HTMLAnchorElement>(this.magnetCellSelector);
    return link?.href ?? "";
  },

  extractTitle(row: Element): string {
    const cells = row.querySelectorAll("td");
    const cell = cells[2]; // 根据实际列位置调整
    const link = cell?.querySelector("a");
    return link?.textContent?.trim() ?? cell?.textContent?.trim() ?? "";
  },

  buildShortMagnet(magnet: string): string | null {
    return buildShortMagnet(magnet);
  }
};
```

#### 模式 B：继承扩展（推荐）

当目标站点与现有站点结构完全一致时使用。

```typescript
import { nyaaAdapter } from "./nyaa";
import type { SiteAdapter } from "./types";

export const mysiteAdapter: SiteAdapter = {
  ...nyaaAdapter,
  siteId: "mysite",
  siteName: "我的站点",
  matchPatterns: ["https://mysite.com/*"]
};
```

如果列位置有差异，可额外覆盖 `_titleIdx`：

```typescript
export const mysiteAdapter: SiteAdapter = {
  ...nyaaAdapter,
  siteId: "mysite",
  siteName: "我的站点",
  matchPatterns: ["https://mysite.com/*"],
  _titleIdx: 1  // 覆盖标题列索引
};
```

---

### 第三阶段：注册适配器

编辑 `src/sites/index.ts`：

```typescript
import { mysiteAdapter } from "./mysite";  // 添加 import

export const adapters: SiteAdapter[] = [
  dmhyAdapter,
  anonekoAdapter,
  nyaaAdapter,
  sukebeiAdapter,
  mysiteAdapter  // 添加到数组
];
```

---

### 第四阶段：验证

```bash
bun run build
bun run verify:dist
```

---

## 现有适配器参考

| 适配器 | 文件 | 继承自 | 特点 |
|--------|------|--------|------|
| dmhy | dmhy.ts | - | 完整定义，标题列索引 3 |
| anoneko | anoneko.ts | dmhy | 继承，仅修改 URL |
| nyaa | nyaa.ts | - | 完整定义，标题列索引 1 |
| sukebei | sukebei.ts | nyaa | 继承，覆盖 `_titleIdx: 1` |
| acgnx | acgnx.ts | - | 完整定义，标题列索引 2 |
| shareacgnx | shareacgnx.ts | - | 完整定义，标题列索引 2 |

---

## 常见问题

**Q: 磁链选择器怎么选？**

A: 优先使用能唯一确定的 selector：
- `a[href^="magnet:"]` - 以 `magnet:` 开头的链接
- `#magnet` - 有特定 ID 的元素
- `.magnet-link` - 有特定 class 的元素

**Q: `titleHeader` 必须精确匹配吗？**

A: 是的，必须与页面表头文字完全一致，包括空格。

**Q: 两个站点结构相同但 URL 不同？**

A: 两种方式：
1. 在 `matchPatterns` 数组中添加多个 URL：`["https://site1.com/*", "https://site2.com/*"]`
2. 创建两个独立的适配器，各自注册

**Q: 标题列不是固定位置怎么办？**

A: 在 `extractTitle` 中动态查找：

```typescript
extractTitle(row: Element): string {
  const cells = row.querySelectorAll("td");
  // 找到包含特定关键词的单元格
  for (const cell of cells) {
    if (cell.textContent.includes("关键词")) {
      return cell.textContent.trim();
    }
  }
  return "";
}
```

**Q: 如何确认适配器工作正常？**

A: 安装脚本后打开目标站点：
1. 表格左侧应出现复选框列
2. 勾选行后悬浮面板应显示选中数量
3. 点击复制按钮应弹出包含正确标题的 Modal
