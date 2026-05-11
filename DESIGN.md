# Anime Magnet Collector - 设计系统

## 原则

- **紧凑** - 最小占用空间，内容优先
- **不打扰** - 悬浮面板设计，不遮挡内容
- **原生感** - 系统字体，原生交互

---

## Design Tokens

### 色彩

```css
:root {
  /* 背景 */
  --amc-bg: rgba(255, 255, 255, 0.95);
  --amc-bg-solid: #ffffff;
  --amc-bg-disabled: rgba(0, 0, 0, 0.08);
  --amc-bg-overlay: rgba(0, 0, 0, 0.5);

  /* 文字 */
  --amc-text-primary: #333333;
  --amc-text-secondary: #666666;
  --amc-text-muted: #999999;
  --amc-text-disabled: #aaaaaa;
  --amc-text-inverse: #ffffff;

  /* 强调色 */
  --amc-accent: #4CAF50;
  --amc-accent-hover: #43a047;

  /* 边框 */
  --amc-border: rgba(0, 0, 0, 0.1);
  --amc-border-hover: rgba(0, 0, 0, 0.15);

  /* 阴影 */
  --amc-shadow-sm: 0 1px 4px rgba(0, 0, 0, 0.08);
  --amc-shadow-md: 0 4px 24px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.08);
  --amc-shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.12);
}
```

### 间距

```css
:root {
  --amc-space-xs: 4px;
  --amc-space-sm: 8px;
  --amc-space-md: 12px;
  --amc-space-lg: 16px;
  --amc-space-xl: 20px;
}
```

### 圆角

```css
:root {
  --amc-radius-sm: 4px;
  --amc-radius-md: 8px;
  --amc-radius-pill: 999px;
}
```

### 字体

```css
:root {
  --amc-font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --amc-font-size-sm: 13px;
  --amc-font-size-md: 14px;
  --amc-font-size-lg: 16px;
  --amc-font-weight-medium: 500;
  --amc-font-weight-semibold: 600;
  --amc-font-weight-bold: 700;
}
```

### 动效

```css
:root {
  --amc-duration-fast: 0.15s;
  --amc-duration-normal: 0.2s;
  --amc-ease-out: ease-out;
}
```

### 层级

```css
:root {
  --amc-z-float: 2147483647;
}
```

---

## 组件

### 悬浮面板 (`#amc-float`)

**用途**：复制选中的主要交互入口。

**外观**：
- 药丸形容器，毛玻璃效果
- 包含：拖动手柄 + 计数徽章 + 操作按钮
- 默认位置：左上角，16px 边距

**状态**：
- 默认：轻微阴影，毛玻璃背景
- 悬停：阴影增强
- 拖拽中：阴影提升，光标变为抓取

**布局**：
```
[:: 手柄 ::] [count] 项  [复制]
```

---

### 弹窗 (`#amc-modal`)

**用途**：展示选中的磁力链接供复制。

**外观**：
- 居中卡片 + 背景遮罩
- 与悬浮面板保持一致的设计语言：相同圆角、阴影风格、字体
- 包含标题栏、可滚动列表、底部关闭按钮

**状态**：
- 入场：淡入 + 轻微上移动画
- 退场：淡出

**布局**：
```
┌─────────────────────────────┐
│  已选择 5 项                  │  ← 标题栏
├─────────────────────────────┤
│  1. [标题截断...]             │
│  2. [标题截断...]            │  ← 可滚动列表
│  ...                         │
├─────────────────────────────┤
│                      [关闭]  │  ← 底部栏
└─────────────────────────────┘
```

---

### 提示 (`#amc-toast`)

**用途**：复制操作后的非阻塞反馈。

**外观**：
- 底部居中的药丸形通知
- 半透明深色背景

---

## 样式修改检查清单

修改样式前必须确认：
- [ ] 优先使用已有的 `--amc-*` token 变量
- [ ] 新增 token 需同步更新本文档
- [ ] 新增组件必须复用 token，保持视觉一致性
- [ ] 按钮使用 `.amc-float-btn` 类名以保持一致
