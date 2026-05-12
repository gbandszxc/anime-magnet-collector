# anime-magnet-collector CLAUDE.md

## 项目概览

**快速了解项目**：运行 `@README.md` 可获取项目简介、功能特点、安装使用等核心信息。

## 项目约定

1. 源码位于 `src/`，发布产物位于 `dist/anime-magnet-collector.user.js`。禁止直接手改 `dist/` 产物，应通过 `bun run build` 生成。
2. 版本号以 `package.json` 的 `version` 字段为唯一来源。发版时：
   - 更新 `package.json` version
   - 运行 `bun run build`（构建脚本会自动同步 README.md 中的版本号）
   - 创建对应 Git tag（如 `v1.0.1`）
3. 发布前必须运行 `bun run verify:dist`，确认产物与源码构建结果一致。
4. 专注当前功能开发，禁止调整无关代码逻辑，避免已有功能受损。
5. 涉及 userscript metadata、构建脚本修改时，需同步确认 `scripts/build.mjs` 的 banner 头部与产物一致。
6. **README.md 同步**：构建时自动将 `package.json` version 同步到 `README.md` 的 changelog 版本号。

## 测试与验证

1. 修改站点适配器、选择列、Modal 回显、磁链提取逻辑后，必须运行 `bun test`。当前测试包含各站点精简 DOM fixture，用于复测 checkbox 注入后标题和磁链提取是否正确。
2. 提交前运行 `bun run typecheck`，确保 TypeScript 类型检查通过。
3. 修改 `src/` 后如需更新发布产物，运行 `bun run build`，不要手改 `dist/anime-magnet-collector.user.js`。
4. 发布或提交包含 `dist/` 的改动前，运行 `bun run verify:dist`，确认产物与源码构建结果一致。
5. 常用完整验证顺序：
   - `bun test`
   - `bun run typecheck`
   - `bun run build`
   - `bun run verify:dist`

## 样式规范

**设计系统文档**：`DESIGN.md` - 包含完整的设计 token、组件规范和示例。

**修改样式前必须先参考 DESIGN.md**，确保：
- 优先使用已有的 design token 变量（`--amc-*`）
- 新增样式需同步更新 DESIGN.md 的 token 定义
- 后续新增页面/组件必须复用 token 变量，保持视觉一致性
