import path from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { build, context } from "esbuild";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const packageJson = JSON.parse(await readFile(path.join(projectRoot, "package.json"), "utf8"));
const version = packageJson.version;
const distRelativePath = "dist/anime-magnet-collector.user.js";
const rawDistUrl = "gbandszxc"
  ? `https://raw.githubusercontent.com/gbandszxc/anime-magnet-collector/main/${distRelativePath}`
  : null;

// Sync version to README.md changelog
async function syncReadmeVersion() {
  const readmePath = path.join(projectRoot, "README.md");
  const readme = await readFile(readmePath, "utf8");

  // Find and replace the first changelog version header (### vX.X.X)
  // This ensures README.md changelog always starts with current version
  const updated = readme.replace(/^### v\d+\.\d+\.\d+/m, `### v${version}`);

  if (updated !== readme) {
    await writeFile(readmePath, updated, "utf8");
    console.log(`README.md version synced to v${version}`);
  }
}

const entryFile = path.join(projectRoot, "src", "main.ts");
const outputFile = path.join(projectRoot, distRelativePath);
const isWatchMode = process.argv.includes("--watch");

// Dynamically read match patterns from site adapter files
const sitesDir = path.join(projectRoot, "src", "sites");
const matchLines = [];
const files = ["dmhy.ts", "anoneko.ts"]; // Add new site adapters here
for (const file of files) {
  const filePath = path.join(sitesDir, file);
  const content = await readFile(filePath, "utf8");
  const regex = /matchPatterns:\s*\[\s*([^\]]+)\s*\]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const patternsStr = match[1];
    const patterns = patternsStr.match(/["']([^"']+)["']/g) || [];
    patterns.forEach(p => {
      const pattern = p.replace(/["']/g, "");
      matchLines.push(`// @match      ${pattern}`);
    });
  }
}

const grantLines = [
`// @grant      GM_addStyle`,
`// @grant      GM_log`
];

const metadataLines = [
  "// ==UserScript==",
  "// @name         Anime Magnet Collector",
  "// @namespace    http://tampermonkey.net/",
  `// @version      ${version}`,
  "// @description  动漫BT站点增加复选框批量复制磁力链接",
  "// @author       gbandszxc",
  ...matchLines,
  ...grantLines,
  ...(rawDistUrl ? [
    `// @updateURL    ${rawDistUrl}`,
    `// @downloadURL  ${rawDistUrl}`,
  ] : []),
  "// @license      MIT",
  "// ==/UserScript=="
];

const metadata = metadataLines.join("\n");

const buildOptions = {
  entryPoints: [entryFile],
  outfile: outputFile,
  bundle: true,
  format: "iife",
  platform: "browser",
  target: "es2020",
  charset: "utf8",
  legalComments: "none",
  // esbuild 原生支持 TypeScript，无需额外 loader
  loader: { ".css": "text" },
  banner: { js: `${metadata}\n` }
};

await mkdir(path.dirname(outputFile), { recursive: true });

if (isWatchMode) {
  const ctx = await context(buildOptions);
  await ctx.watch();
  console.log("Watching build...");
} else {
  await build(buildOptions);
  console.log(`Build completed: ${outputFile}`);
  await syncReadmeVersion();
}
