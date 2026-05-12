# bangumi.moe / acg.rip 适配器设计

## 1. 概述

为 anime-magnet-collector 新增两个站点适配器：

| 站点 | 文件 | 特点 |
|------|------|------|
| bangumi.moe | `src/sites/bangumi.ts` | API 获取 magnet，游标分页 |
| acg.rip | `src/sites/acgrip.ts` | 复制 torrent 链接 |

两个适配器互相独立，各自在 `src/sites/index.ts` 中注册。

---

## 2. bangumi.moe

### 2.1 匹配模式

```typescript
matchPatterns: ["https://bangumi.moe/*"]
```

### 2.2 列表结构

- AngularJS 1.3.8 单页应用
- 列表通过 `ng-repeat` 动态渲染，初始 DOM 为空
- 需 **MutationObserver** 监听渲染完成后注入 checkbox

```typescript
tableSelector: "md-list.torrent-list"
rowSelector: "md-list-item, [class*='torrent']"
titleHeader: ""  // 无实际表头，用自定义逻辑
```

### 2.3 标题提取

通过 `a[href^="/torrent/"]` 定位所在行的标题文本：

```typescript
extractTitle(row: Element): string {
  const titleLink = row.querySelector<HTMLAnchorElement>('a[href^="/torrent/"]');
  return titleLink?.textContent?.trim() ?? "";
}
```

### 2.4 Magnet 获取策略

**核心发现：列表 API 返回完整 magnet**

- 首页：`GET /api/torrent/latest` — 返回最新 30 条，含 magnet
- 搜索页：`POST /api/torrent/search` — 按 tag 搜索，返回 30 条，含 magnet

API 响应结构：
```json
{
  "torrents": [
    {
      "_id": "6a02ec80a9616b26398aedb8",
      "title": "[丸子家族]...",
      "magnet": "magnet:?xt=urn:btih:...",
      "infoHash": "..."
    }
  ],
  "page_count": 6820
}
```

**Magnet 缓存机制：**

打开弹窗时，根据已选中行的索引计算需要哪些页面：

```
索引 0-29   → p=1
索引 30-59  → p=2
索引 60-89  → p=3
...

p = Math.floor(index / 30) + 1
```

1. 收集所需页面集合（去重）
2. 并发请求各页面 API，建立 `{id → magnet}` 映射
3. 从缓存中查找选中行的 magnet

**加载进度显示：** `"已加载 X/Y"`（X=已请求页数，Y=需请求总页数）

### 2.5 MutationObserver

监听 md-list 内容变化，确保 checkbox 注入在列表渲染完成后执行：

```typescript
const observer = new MutationObserver((mutations) => {
  const items = container.querySelectorAll('md-list-item, [class*="torrent"]');
  if (items.length > 0 && !injected) {
    injectCheckboxColumn(adapter);
    injected = true;
  }
});
observer.observe(container, { childList: true, subtree: true });
```

---

## 3. acg.rip

### 3.1 匹配模式

```typescript
matchPatterns: ["https://acg.rip/*"]
```

### 3.2 列表结构

标准 HTML 表格：

```html
<table>
  <thead>
    <tr>
      <th class="hidden-xs hidden-sm">发布者</th>
      <th>标题</th>
      <th>DL</th>
      <th>大小</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="date hidden-xs hidden-sm">...</td>
      <td class="title"><a href="/t/353925">标题</a></td>
      <td class="action"><a href="/t/353925.torrent"></a></td>
      <td class="size">221.2 MB</td>
    </tr>
  </tbody>
</table>
```

```typescript
tableSelector: "table"
rowSelector: "tbody tr"
titleHeader: "标题"
magnetCellSelector: "a[href$='.torrent']"
```

### 3.3 Magnet 提取

**无磁力链，仅有 .torrent 链接**，直接返回：

```typescript
extractMagnet(row: Element): string {
  const link = row.querySelector<HTMLAnchorElement>('a[href$=".torrent"]');
  return link?.href ?? "";
}
```

### 3.4 短链特判

.acg.rip 的 torrent 链接视为短链，复制时直接使用，不经过 `buildShortMagnet` 转换。

在 `Modal.ts` 中对 acg.rip 适配器跳过短链按钮的禁用逻辑：

```typescript
// acg.rip 的 torrent 链接本身已是最终形式
if (adapter.siteId === 'acgrip') {
  // 直接复制，不提示"短链无法还原"
}
```

---

## 4. 改动点汇总

### 新增文件

- `src/sites/bangumi.ts`
- `src/sites/acgrip.ts`

### 修改文件

| 文件 | 改动 |
|------|------|
| `src/sites/index.ts` | 导入并注册新适配器 |
| `src/sites/types.ts` | 无改动（接口已兼容） |
| `src/components/Modal.ts` | acg.rip 特判，torrent 链接视为短链 |
| `src/main.ts` | bangumi.moe 的 MutationObserver 初始化 |

### CheckboxColumn.ts

**无需改动**，`_titleIdx` 机制保持兼容。

---

## 5. 药丸悬窗

逻辑不变，`extractMagnet` 已抽象化：
- bangumi.moe: 返回 magnet URL
- acg.rip: 返回 .torrent URL
- 复制时各自按原格式复制

---

## 6. 实现顺序

1. `acgrip.ts` — 更简单，先实现建立信心
2. `bangumi.ts` — 重点是 MutationObserver + API 缓存
3. `index.ts` — 注册两个新适配器
4. `Modal.ts` — acg.rip 短链特判
5. 测试验证
