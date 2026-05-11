# Anime Magnet Collector - Design System

## Principles

- **Compact** - Minimal footprint, content-first
- **Non-intrusive** - Floating panel that stays out of the way
- **Native feel** - System fonts, native interactions

---

## Design Tokens

### Color

```css
:root {
  /* Background */
  --amc-bg: rgba(255, 255, 255, 0.95);
  --amc-bg-hover: rgba(255, 255, 255, 0.98);
  --amc-bg-disabled: rgba(0, 0, 0, 0.08);
  --amc-bg-overlay: rgba(0, 0, 0, 0.5);

  /* Text */
  --amc-text-primary: #333333;
  --amc-text-secondary: #666666;
  --amc-text-muted: #999999;
  --amc-text-disabled: #aaaaaa;
  --amc-text-inverse: #ffffff;

  /* Accent */
  --amc-accent: #4CAF50;
  --amc-accent-hover: #43a047;

  /* Border */
  --amc-border: rgba(0, 0, 0, 0.1);
  --amc-border-hover: rgba(0, 0, 0, 0.15);

  /* Shadow */
  --amc-shadow-sm: 0 1px 4px rgba(0, 0, 0, 0.08);
  --amc-shadow-md: 0 4px 24px rgba(0, 0, 0, 0.12);
  --amc-shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.2);
}
```

### Spacing

```css
:root {
  --amc-space-xs: 4px;
  --amc-space-sm: 8px;
  --amc-space-md: 12px;
  --amc-space-lg: 16px;
  --amc-space-xl: 20px;
}
```

### Radius

```css
:root {
  --amc-radius-sm: 4px;
  --amc-radius-md: 8px;
  --amc-radius-lg: 12px;
  --amc-radius-pill: 999px;
}
```

### Typography

```css
:root {
  --amc-font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --amc-font-size-xs: 11px;
  --amc-font-size-sm: 13px;
  --amc-font-size-md: 14px;
  --amc-font-size-lg: 16px;
  --amc-font-weight-normal: 400;
  --amc-font-weight-medium: 500;
  --amc-font-weight-semibold: 600;
  --amc-font-weight-bold: 700;
}
```

### Motion

```css
:root {
  --amc-duration-fast: 0.15s;
  --amc-duration-normal: 0.2s;
  --amc-ease-out: ease-out;
}
```

### Z-Index

```css
:root {
  --amc-z-float: 2147483647;
}
```

---

## Components

### Floating Panel (`#amc-float`)

**Purpose**: Primary interaction point for copy selection.

**Appearance**:
- Pill-shaped container with glass blur
- Contains: drag handle + count badge + action button
- Default position: top-left corner with 16px margin

**States**:
- Default: Subtle shadow, blurred background
- Hover: Enhanced shadow
- Dragging: Elevated shadow, cursor changes to grabbing

**Layout**:
```
[:: handle ::] [count] 项  [复制]
```

---

### Modal (`#amc-modal`)

**Purpose**: Display selected magnet links for copying.

**Appearance**:
- Centered card with backdrop overlay
- Matches floating panel aesthetic: same border-radius, shadow style, font
- Header with title, scrollable list body, footer with close button

**States**:
- Entry: Fade in with slight upward motion
- Exit: Fade out

**Layout**:
```
┌─────────────────────────────┐
│  已选择 5 项                  │  ← Header
├─────────────────────────────┤
│  1. [title truncated...]     │
│  2. [title truncated...]     │  ← Scrollable list
│  ...                         │
├─────────────────────────────┤
│                      [关闭]  │  ← Footer
└─────────────────────────────┘
```

---

### Toast (`#amc-toast`)

**Purpose**: Non-blocking feedback after copy action.

**Appearance**:
- Bottom-center pill notification
- Semi-transparent dark background

---

## Checklist

- [x] Floating panel draggable with snap-to-edge
- [x] Touch support for mobile
- [x] Consistent token system across components
- [x] Modal uses same design language as floating panel
