<div align="center">
  <img src="https://raw.githubusercontent.com/gbandszxc/anime-magnet-collector/main/src/assets/icons/anime-magnet-collector.png" alt="Anime Magnet Collector" width="64" height="64" />
  <h1>Anime Magnet Collector</h1>
  <p>动漫 BT 站点磁链批量复制脚本 - 简洁高效，一键导出</p>
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
| [**动漫花园**](https://share.dmhy.org) | 资源列表页 |
| [**动漫花园(镜像)**](https://dmhy.anoneko.com) | 资源列表页 |
| [**Nyaa**](https://nyaa.si) | 资源列表页 |
| [**Sukebei**](https://sukebei.nyaa.si) | 资源列表页 |
| [**AcgnX**](https://www.acgnx.se) | 资源列表页 |
| [**AcgnX中文站**](https://share.acgnx.se) | 资源列表页 |

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

### 适配新站点

详细开发指南请参阅 [站点适配器开发指南](./docs/site-adapter-guide.md)。

---

## 更新日志

### v1.0.0

- 新增：长链/短链切换复制功能
- 优化：短链可从长链自动生成
- 初始版本
- 支持动漫花园资源列表批量选择
- 悬浮面板拖拽和边缘吸附
- 折叠/展开功能
