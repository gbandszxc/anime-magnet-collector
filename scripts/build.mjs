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
const files = ["dmhy.ts", "anoneko.ts", "nyaa.ts"]; // Add new site adapters here
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

const ICON_SVG_BASE64 = "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2IiBzaGFwZS1yZW5kZXJpbmc9ImNyaXNwRWRnZXMiPgogIDx0aXRsZT5BbmltZSBtYWduZXQgbWFzY290IGljb248L3RpdGxlPgogIDxyZWN0IHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0ibm9uZSIvPgoKICA8IS0tIGhhbG8gLS0+CiAgPHBhdGggZD0iTTUgMWg2djFoMnYxaC0yVjJINXYxSDNWMmgyeiIgZmlsbD0iIzUyYjhmZiIvPgogIDxwYXRoIGQ9Ik01IDJoNnYxSDV6IiBmaWxsPSIjZGZmNmZmIi8+CgogIDwhLS0gaGFpciBzaWxob3VldHRlIC0tPgogIDxwYXRoIGQ9Ik00IDRoMVYzaDZ2MWgxdjFoMXY2aC0xdjJoLTF2MUg1di0xSDR2LTJIM1Y1aDF6IiBmaWxsPSIjMjYzMjU1Ii8+CiAgPHBhdGggZD0iTTUgM2g2djFoMXY3aC0xdjJINXYtMkg0VjVoMXoiIGZpbGw9IiNmMWY4ZmYiLz4KCiAgPCEtLSBibHVlIHNoYWRvd3MgLS0+CiAgPHBhdGggZD0iTTQgNmgxdjVINHpNMTEgNWgxdjZoLTF6TTUgMTJoMnYxSDV6TTkgMTJoMnYxSDl6IiBmaWxsPSIjOWZiOGU4Ii8+CiAgPHBhdGggZD0iTTYgNGgxdjRINnpNOSA0aDF2NEg5eiIgZmlsbD0iI2M3ZDhmZiIvPgoKICA8IS0tIGhhaXIgYWNjZXNzb3J5IC0tPgogIDxwYXRoIGQ9Ik0xMiA0aDJ2MWgxdjNoLTF2MWgtMlY4aC0xVjVoMXoiIGZpbGw9IiMyMDI5NGEiLz4KICA8cGF0aCBkPSJNMTMgNWgxdjFoMXYxaC0xdjFoLTFWN2gtMVY2aDF6IiBmaWxsPSIjMzViOWZmIi8+CgogIDwhLS0gZmFjZSAtLT4KICA8cGF0aCBkPSJNNSA4aDZ2M2gtMXYxSDZ2LTFINXoiIGZpbGw9IiNmZmU2ZDIiLz4KICA8cGF0aCBkPSJNNSAxMGgxdjFINXpNMTAgMTBoMXYxaC0xeiIgZmlsbD0iI2ZmYjNiOSIvPgoKICA8IS0tIGV5ZXMgLS0+CiAgPHBhdGggZD0iTTYgOGgydjJINnpNOSA4aDJ2Mkg5eiIgZmlsbD0iIzE4MzY2ZiIvPgogIDxwYXRoIGQ9Ik03IDhoMXYxSDd6TTEwIDhoMXYxaC0xeiIgZmlsbD0iIzU0YzdmZiIvPgogIDxwYXRoIGQ9Ik03IDloMXYxSDd6TTEwIDloMXYxaC0xeiIgZmlsbD0iI2ZmZmZmZiIvPgoKICA8IS0tIG1vdXRoIC0tPgogIDxwYXRoIGQ9Ik03IDExaDJ2MUg3eiIgZmlsbD0iI2VjNmY4ZiIvPgoKICA8IS0tIGNvbGxhciAtLT4KICA8cGF0aCBkPSJNNiAxM2g0djFoMXYxSDV2LTFoMXoiIGZpbGw9IiMyNTM0NWUiLz4KICA8cGF0aCBkPSJNNyAxM2gydjFIN3oiIGZpbGw9IiM3OWQ3ZmYiLz4KPC9zdmc+Cg==";

const metadataLines = [
  "// ==UserScript==",
  "// @name         Anime Magnet Collector",
  "// @namespace    http://tampermonkey.net/",
  `// @version      ${version}`,
  "// @description  动漫BT站点增加复选框批量复制磁力链接",
  "// @author       gbandszxc",
  `// @icon      data:image/svg+xml;base64,${ICON_SVG_BASE64}`,
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
