<div align="center">
  <img src="https://raw.githubusercontent.com/gbandszxc/anime-magnet-collector/main/src/assets/icons/anime-magnet-collector.png" alt="Anime Magnet Collector" width="64" height="64" />
  <h1>Anime Magnet Collector</h1>
  <p>动漫BT站点磁链批量复制脚本 - 简洁高效，一键导出</p>
</div>

---

## 功能特点

- **批量选择** - 表格行勾选，无需逐个复制
- **长链/短链** - 支持完整磁力链和精简短链两种格式
- **悬浮面板** - 可拖拽、可折叠的复制入口
- **即装即用** - Tampermonkey 脚本，刷新页面自动生效

---

## 安装

### 方法一（推荐）- 直接安装脚本

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 浏览器扩展
2. 点击 [anime-magnet-collector.user.js](https://raw.githubusercontent.com/gbandszxc/anime-magnet-collector/main/dist/anime-magnet-collector.user.js) 自动安装

### 方法二 - 手动下载

1. 下载 `dist/anime-magnet-collector.user.js`
2. 拖入 Tampermonkey 管理界面导入

---

## 使用

### 批量复制磁力链

1. 打开支持的资源站点页面
2. 在表格左侧勾选需要复制的行
3. 点击悬浮面板的**复制长链**或**复制短链**
4. 弹出确认框，选择复制格式
5. 磁力链已复制到剪贴板

### 悬浮面板操作

- **拖拽** - 拖动面板移动位置
- **吸附边缘** - 拖到屏幕边缘自动贴合
- **折叠/展开** - 点击手柄或双击手柄切换

---

## 支持站点

| 站点 | 支持页面 |
|------|----------|
| **动漫花园** (share.dmhy.org) | 资源列表页 |
| **动漫花园(镜像)** (dmhy.anoneko.com) | 资源列表页 |
| **Nyaa** (nyaa.si) | 资源列表页 |
| **Sukebei** (sukebei.nyaa.si) | 资源列表页 |
| **AcgnX** (www.acgnx.se) | 资源列表页 |
| **AcgnX中文站** (share.acgnx.se) | 资源列表页 |

---

## 常见问题

### 短链和长链有什么区别？

- **长链**：`magnet:?xt=urn:btih:INFOHASH&tr=...&dn=...` 包含 tracker 服务器和显示名
- **短链**：`magnet:?xt=urn:btih:INFOHASH` 只有信息哈希，现代 BT 客户端可通过 DHT/PEX 自动找 peers

### 为什么长链按钮有时不可用？

所选磁链包含短链时，长链按钮会禁用（短链无法还原为长链）。短链按钮始终可用，长链会自动转换为短链格式。

### 脚本没有反应？

1. 确认 Tampermonkey 扩展已启用
2. 确认在支持的站点页面上
3. 检查浏览器控制台是否有错误

---

## 技术细节

### 原理

脚本通过 `@match` 注入到目标页面，执行以下操作：

- 注入 checkbox 列到资源列表表格
- 注入悬浮工具栏提供复制入口
- 提取选中行的磁力链接（支持长链/短链）

### 磁力链接格式

```
magnet:?xt=urn:btih:{INFOHASH}
```

- `xt=urn:btih:` - BT 资源标识符类型
- `INFOHASH` - 40 字符的 SHA-1 哈希（Base16 大写）

---

## 适配新站点

### 流程概览

适配新站点只需三步：

1. **分析页面结构** - 确定表格列顺序和磁链选择器
2. **创建适配器文件** - 在 `src/sites/` 下新建站点文件
3. **注册并构建** - 更新 `index.ts` 并验证构建

---

### 第一步：分析页面结构

在目标站点页面打开浏览器控制台，执行以下分析：

#### 1. 获取表格表头

```javascript
// 获取表格所有列的表头文字
const headers = Array.from(document.querySelectorAll('table th')).map(th => th.textContent.trim());
console.log('表头:', headers);
```

#### 2. 获取第一行数据

```javascript
// 获取第一行所有单元格内容
const firstRow = document.querySelector('table tbody tr');
const cells = Array.from(firstRow.cells).map((td, i) => `${i}: ${td.textContent.trim().substring(0, 30)}`);
console.log('第一行:', cells);
```

#### 3. 确定磁链选择器

```javascript
// 找到磁链链接元素
const magnetLink = document.querySelector('a[href^="magnet:"]');
console.log('磁链元素:', magnetLink?.outerHTML);
```

或者如果磁链元素有特定 ID/Class：

```javascript
// 检查是否有特定 ID（如 #magnet）
const magnetById = document.querySelector('#magnet');
console.log('磁链元素:', magnetById?.outerHTML);
```

#### 4. 记录关键信息

| 信息 | 示例 |
|------|------|
| **表格选择器** | `table#listTable` |
| **行选择器** | `tbody tr` |
| **标题列表头** | `Name` |
| **标题列索引** | 2（第三列） |
| **磁链选择器** | `#magnet` 或 `a[href^="magnet:"]` |
| **磁链元素位置** | 是 `<a>` 标签还是其他 |

---

### 第二步：创建适配器文件

在 `src/sites/` 目录下创建新文件（如 `mysite.ts`）：

```typescript
import type { SiteAdapter } from "./types";
import { buildShortMagnet } from "../utils/magnet";

export const mysiteAdapter: SiteAdapter = {
  siteId: "mysite",              // 唯一标识
  siteName: "我的站点",           // 显示名称
  matchPatterns: ["https://mysite.com/*"],  // URL 匹配模式

  // 表格选择器
  tableSelector: "table#listTable",
  rowSelector: "tbody tr",

  // 标题列配置（用于定位列索引）
  titleHeader: "Name",           // 表头文字，必须精确匹配

  // 磁链单元格选择器
  magnetCellSelector: "#magnet",

  // 从行提取磁力链接
  extractMagnet(row: Element): string {
    const link = row.querySelector<HTMLAnchorElement>(this.magnetCellSelector);
    return link?.href ?? "";
  },

  // 从行提取标题
  extractTitle(row: Element): string {
    const cells = row.querySelectorAll("td");
    const cell = cells[2];  // 标题列索引（根据实际结构调整）
    const link = cell?.querySelector("a");
    return link?.textContent?.trim() ?? cell?.textContent?.trim() ?? "";
  },

  // 长链转短链
  buildShortMagnet(magnet: string): string | null {
    return buildShortMagnet(magnet);
  }
};
```

---

### 第三步：注册适配器

#### 1. 更新 import

在 `src/sites/index.ts` 顶部添加：

```typescript
import { mysiteAdapter } from "./mysite";
```

#### 2. 添加到 adapters 数组

```typescript
export const adapters: SiteAdapter[] = [
  dmhyAdapter,
  anonekoAdapter,
  nyaaAdapter,
  sukebeiAdapter,
  mysiteAdapter  // 添加到末尾
];
```

---

### 第四步：构建验证

```bash
# 构建
bun run build

# 验证
bun run verify:dist
```

构建成功后，新的站点即可使用。

---

### 适配器字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `siteId` | string | 是 | 站点唯一标识 |
| `siteName` | string | 是 | 显示名称 |
| `matchPatterns` | string[] | 是 | URL 匹配模式，`*` 匹配任意字符 |
| `tableSelector` | string | 是 | 主表格 CSS 选择器 |
| `rowSelector` | string | 是 | 表格行选择器（相对于 table） |
| `titleHeader` | string | 是 | 标题列的表头文字（精确匹配） |
| `magnetCellSelector` | string | 是 | 磁链元素的 CSS 选择器 |
| `extractMagnet` | function | 是 | 提取磁链的逻辑 |
| `extractTitle` | function | 是 | 提取标题的逻辑 |
| `buildShortMagnet` | function | 否 | 长链转短链，默认使用工具函数 |

---

### 常见问题

**Q: 表头文字包含空格怎么匹配？**
A: `titleHeader` 必须与页面表头文字精确匹配，包括空格。

**Q: 标题列不在第三列怎么办？**
A: `extractTitle` 中 `cells[2]` 的索引需要根据实际列位置调整。或者让脚本自动查找：`const idx = Array.from(row.cells).findIndex(td => td.textContent.includes('关键词'));`

**Q: 磁链选择器怎么写？**
A: 推荐使用能精确定位的选择器：`#magnet`（ID）、`.magnet-link`（Class）或 `a[href^="magnet:"]`（属性选择器）。

**Q: 两个站点结构相同但域名不同？**
A: 在 `matchPatterns` 中添加多个 URL 模式，或创建两个独立的适配器文件各自注册。

---

## 开发

### 环境要求

- [Bun](https://bun.sh/) - 构建工具

### 构建

```bash
# 开发模式（监视文件变化自动重构建）
bun run dev

# 生产构建
bun run build

# 类型检查
bun run typecheck

# 验证构建产物
bun run verify:dist
```

### 项目结构

```
├── src/
│   ├── main.ts              # 入口，初始化逻辑
│   ├── config.ts            # 站点匹配配置
│   ├── style.css            # 全局样式
│   ├── sites/               # 站点适配器
│   │   ├── index.ts         # 适配器注册
│   │   ├── types.ts         # 类型定义
│   │   └── dmhy.ts          # 动漫花园适配器
│   ├── components/          # UI 组件
│   │   ├── Toolbar.ts       # 悬浮面板
│   │   ├── Modal.ts         # 确认弹窗
│   │   └── CheckboxColumn.ts # 表格 checkbox 列
│   └── utils/              # 工具函数
│       └── magnet.ts        # 磁力链接处理
├── dist/                    # 构建产物
├── scripts/                 # 构建脚本
│   └── build.mjs           # 主构建脚本
└── package.json
```

---

## 更新日志

### v1.0.0

- 新增：长链/短链切换复制功能
- 优化：短链可从长链自动生成
- 初始版本
- 支持动漫花园资源列表批量选择
- 悬浮面板拖拽和边缘吸附
- 折叠/展开功能
