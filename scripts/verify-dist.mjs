import path from "node:path";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const distPath = path.join(projectRoot, "dist", "anime-magnet-collector.user.js");
const packageJsonPath = path.join(projectRoot, "package.json");

const distContentBeforeBuild = await readFile(distPath, "utf8");

// 重新构建后比较内容，确保已提交/待提交产物确实来自当前源码。
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

// 校验 3：构建前后内容一致，确认 dist 与当前源码构建结果一致
if (distContentBeforeBuild.replace(/\r\n/g, "\n") !== distContent.replace(/\r\n/g, "\n")) {
  throw new Error("dist 产物与当前源码生成结果不一致，请重新构建并提交最新产物");
}

console.log("dist verification passed ✓");
