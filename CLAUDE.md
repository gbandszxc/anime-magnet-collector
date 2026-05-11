# anime-magnet-collector CLAUDE.md

## 项目约定

1. 源码位于 `src/`，发布产物位于 `dist/anime-magnet-collector.user.js`。禁止直接手改 `dist/` 产物，应通过 `bun run build` 生成。
2. 版本号以 `package.json` 的 `version` 字段为唯一来源。发版时：
   - 更新 `package.json` version
   - 运行 `bun run build`
   - 创建对应 Git tag（如 `v1.0.1`）
3. 发布前必须运行 `bun run verify:dist`，确认产物与源码构建结果一致。
4. 专注当前功能开发，禁止调整无关代码逻辑，避免已有功能受损。
5. 涉及 userscript metadata、构建脚本修改时，需同步确认 `scripts/build.mjs` 的 banner 头部与产物一致。

## 样式规范

**设计系统文档**：`DESIGN.md` - 包含完整的设计 token、组件规范和示例。

**修改样式前必须先参考 DESIGN.md**，确保：
- 优先使用已有的 design token 变量（`--amc-*`）
- 新增样式需同步更新 DESIGN.md 的 token 定义
- 后续新增页面/组件必须复用 token 变量，保持视觉一致性
