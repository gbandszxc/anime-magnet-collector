# AcgnX 站点适配器设计

## 概述

为 `https://www.acgnx.se/` (英文) 和 `https://share.acgnx.se/` (中文) 两个站点添加 Userscript 适配支持。

## 站点信息

| 站点 | URL | siteId | siteName |
|------|-----|--------|----------|
| AcgnX (英文) | `https://www.acgnx.se/*` | `acgnx` | `AcgnX` |
| AcgnX (中文) | `https://share.acgnx.se/*` | `shareacgnx` | `AcgnX中文站` |

## 页面结构

两个站点结构相同，仅语言不同。

### acgnx.se (英文)

| 列索引 | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|--------|---|---|---|---|---|---|---|
| 表头 | Date | Category | Name | Size | DL | Condition | Submitter/Union |
| 内容示例 | Yday 21:48 | A.E.T | [Anime Time] Witch Hat Atelier... | 582.9MB | [磁链图标] | | NyaaAnime |

### share.acgnx.se (中文)

| 列索引 | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|--------|---|---|---|---|---|---|---|
| 表头 | 發佈時間 | 分類 | 資源名稱 | 大小 | 磁鏈 | 健康度 | 發佈者/聯盟 |
| 内容示例 | 26/04/23 02:27 | 音樂 | [EAC] 魔法先生ネギま！... | 185.4MB | [磁鏈圖標] | | xSxSxSxSx |

## 适配器配置

### 公共配置

```typescript
tableSelector: "table#listTable"
rowSelector: "tbody tr"
magnetCellSelector: "#magnet"
```

### 各站点差异化配置

| 站点 | siteId | siteName | matchPatterns | titleHeader | _titleIdx |
|------|--------|----------|--------------|-------------|------------|
| acgnx | `acgnx` | `AcgnX` | `["https://www.acgnx.se/*"]` | `"Name"` | 3 (0+1+2, 跳过checkbox后) |
| shareacgnx | `shareacgnx` | `AcgnX中文站` | `["https://share.acgnx.se/*"]` | `"資源名稱"` | 3 |

### extractMagnet 实现

```typescript
extractMagnet(row: Element): string {
  const link = row.querySelector<HTMLAnchorElement>("#magnet");
  return link?.href ?? "";
}
```

### extractTitle 实现

```typescript
extractTitle(row: Element): string {
  const cells = row.querySelectorAll("td");
  const cell = cells[2]; // Date(0) | Category(1) | Name(2)
  const link = cell?.querySelector("a");
  return link?.textContent?.trim() ?? cell?.textContent?.trim() ?? "";
}
```

## 文件结构

```
src/sites/
├── types.ts          # SiteAdapter 接口定义
├── index.ts          # 站点注册
├── dmhy.ts           # 动漫花园
├── nyaa.ts           # Nyaa
├── sukebei.ts        # Sukebei (继承 nyaa)
├── anoneko.ts        # 动漫花园镜像 (继承 dmhy)
├── acgnx.ts          # NEW: AcgnX 英文站
└── shareacgnx.ts     # NEW: AcgnX 中文站
```

## 实现步骤

1. 创建 `src/sites/acgnx.ts` - 英文站点适配器
2. 创建 `src/sites/shareacgnx.ts` - 中文站点适配器
3. 更新 `src/sites/index.ts` - 注册新站点到 adapters 数组
4. 验证构建: `bun run build`

## 行为规范

- **复选框位置**: prepend 到日期列左侧（每行 `prepend(td)`）
- **悬浮药丸**: 与其他站点行为一致
- **Modal 回显内容**: 序号（行号从1自增）+ 标题列链接文本
