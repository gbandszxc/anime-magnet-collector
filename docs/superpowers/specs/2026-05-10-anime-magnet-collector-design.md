# Anime Magnet Collector 设计文档

## 概述

油猴脚本，在动漫磁力分享站点增加复选框批量选择和复制磁力链接功能。第一版实现动漫花园（share.dmhy.org），架构预留多站点扩展能力。

## 核心功能

1. **复选框列** — 表格最左侧新增一列checkbox，支持单选和全选
2. **浮动工具栏** — 页面顶部固定显示已选数量和复制按钮，高度compact
3. **预览复制Modal** — 选中后弹出，确认列表后可复制磁力链到剪贴板
4. **长短链选择** — 支持复制长链或短链（短链需站点支持，默认长链）

## 架构设计

### 目录结构

```
src/
├── main.ts              # 入口，初始化站点适配器
├── sites/
│   ├── types.ts         # 站点适配器接口定义
│   └── dmhy.ts          # 动漫花园适配器实现
├── components/
│   ├── CheckboxColumn.ts # 复选框列注入
│   ├── Toolbar.ts        # 浮动工具栏
│   ├── Modal.ts         # 预览复制弹窗
│   └── SelectionStore.ts # 选择状态管理
├── utils/
│   └── magnet.ts        # 磁力链解析/格式化
├── style.css            # 所有样式
└── config.ts            # 站点配置
```

### 站点适配器接口

```typescript
interface SiteAdapter {
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
```

### dmhy 适配器配置

| 字段 | 值 |
|------|-----|
| `siteId` | `dmhy` |
| `siteName` | `动漫花园` |
| `matchPatterns` | `["https://share.dmhy.org/*"]` |
| `tableSelector` | `table#topic_list` |
| `rowSelector` | `tbody tr` |
| `magnetCellIndex` | `3` |
| `titleCellIndex` | `2` |
| 磁链提取 | `td[3].querySelector('a[href^="magnet:"]')?.href` |
| 短链支持 | 暂无，选项灰显 |

## 组件设计

### CheckboxColumn

- 在 `<thead>` 最左侧插入 `<th>`

- 在 `<tbody>` 每行最左侧插入 `<td>` 包含 checkbox

- 表头checkbox控制全选/全不选

- 行checkbox点击切换选中状态

- 状态变化时通知 SelectionStore

### Toolbar

- 位置：页面顶部固定，`position: fixed; top: 0; z-index: 2147483647`

- 高度：40px，紧凑设计

- 内容：`已选 N 项` 文字 + `[复制]` 按钮

- 复制按钮：选中数量>0时启用，否则灰显

- 点击复制按钮：打开 Modal

### Modal

- 居中弹窗，半透明黑色遮罩背景

- 标题：`已选 N 项`

- 内容：序号 + 标题列表，每项约40字截断

- 底部按钮：`[复制长链]` `[复制短链(暂不可用)]` `[取消]`

- 点击复制长链：调用 `navigator.clipboard.writeText()` 复制所有选中磁力链（每行一个），关闭弹窗，显示成功提示

- 复制完成后自动关闭 + Toast提示"已复制 N 条磁力链"

### SelectionStore

- 内存中管理选中行索引：`Set<number>`

- 提供：`toggle(index)`, `selectAll()`, `deselectAll()`, `getSelected()`

- 选中变化时通知 Toolbar 更新状态

## 样式设计

### 全局

- 注入样式scope到页面，不影响原有样式

- checkbox样式：原生浏览器样式即可

- Modal遮罩：`position: fixed; inset: 0; background: rgba(0,0,0,0.5)`

### Modal

```
+----------------------------------+
|  已选 3 项                         |
|  -------------------------------- |
|  1. [LoliHouse] xxx S2 / ...     |
|  2. [LoliHouse] xxx / ...        |
|  3. [LoliHouse] xxx / ...        |
|  -------------------------------- |
|              [复制长链] [取消]      |
+----------------------------------+
```

- 宽度：max-width 500px，高度自适应

- 圆角、阴影与页面风格协调

## URL匹配

- dmhy: `https://share.dmhy.org/*`

- build.mjs 中动态拼接 `@match` 行

## 依赖

- 仅使用 Tampermonkey API（`GM_addStyle`, `GM_log`）

- 无外部依赖
