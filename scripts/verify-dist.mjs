import path from "node:path";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const distPath = path.join(projectRoot, "dist", "anime-magnet-collector.user.js");
const packageJsonPath = path.join(projectRoot, "package.json");

// 先重新构建，确保产物最新
execFileSync(process.execPath, [path.join(projectRoot, "scripts", "build.mjs")], {
  cwd: projectRoot,
  stdio: "inherit"
});

const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));
const distContent = await readFile(distPath, "utf8");

// 校验 1：@version 与 package.json 一致
if (!distContent.includes(`@version      ${packageJson.version}`)) {
  throw new Error(`dist 产物中的 @version 与 package.json 不一致: ${packageJson.version}`);
}

// 校验 2：无外部依赖（保证 GreasyFork 单文件兼容）
if (distContent.includes("@require") || distContent.includes("@resource")) {
  throw new Error("dist 产物仍包含外部依赖 metadata（@require/@resource），请改为内联");
}

// 校验 3：git diff 确认产物与源码构建结果一致
try {
  execFileSync("git", ["diff", "--ignore-cr-at-eol", "--quiet", "--", `dist/anime-magnet-collector.user.js`], {
    cwd: projectRoot,
    stdio: "ignore"
  });
} catch {
  throw new Error("dist 产物与当前源码生成结果不一致，请重新构建并提交最新产物");
}

console.log("dist verification passed ✓");
