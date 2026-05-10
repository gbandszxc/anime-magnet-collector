/// <reference types="@types/tampermonkey" />
import cssText from "./style.css";
import { CONFIG } from "./config";
import { createUtils } from "./utils";
import { findAdapter } from "./sites/index";
import { injectCheckboxColumn } from "./components/CheckboxColumn";
import { injectToolbar } from "./components/Toolbar";

const STYLE_ID = "anime-magnet-collector-style";
const { log } = createUtils({ config: CONFIG });

function injectStyles(): void {
  if (document.getElementById(STYLE_ID)) return;
  if (typeof GM_addStyle === "function") {
    GM_addStyle(cssText);
  } else {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = cssText;
    document.head.appendChild(style);
  }
}

function init(): void {
  injectStyles();

  const adapter = findAdapter();
  if (!adapter) {
    log("未匹配的站点，脚本不执行");
    return;
  }

  log(`检测到站点: ${adapter.siteName}`);

  injectToolbar();
  injectCheckboxColumn(adapter);

  // 监听动态内容（SPA / 无限滚动页面）
  let timer: ReturnType<typeof setTimeout> | null = null;
  const observer = new MutationObserver(() => {
    if (timer) return;
    timer = setTimeout(() => {
      timer = null;
      // 动态内容变化时重新注入 checkbox 列
      injectCheckboxColumn(adapter);
    }, 300);
  });

  observer.observe(document.body, { childList: true, subtree: true });

  log("初始化完成");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

if (typeof GM_registerMenuCommand === "function") {
  GM_registerMenuCommand("重新初始化", init);
}
