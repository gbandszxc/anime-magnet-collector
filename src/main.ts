/// <reference types="@types/tampermonkey" />
import cssText from "./style.css";
import { CONFIG } from "./config";
import { createUtils } from "./utils";

const STYLE_ID = "anime-magnet-collector-style";
const { log } = createUtils({ config: CONFIG });

function injectStyles(): void {
  if (document.getElementById(STYLE_ID)) return;

  if (typeof GM_addStyle === "function") {
    GM_addStyle(cssText);
    const marker = document.createElement("style");
    marker.id = STYLE_ID;
    marker.textContent = "";
    document.head.appendChild(marker);
    return;
  }

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = cssText;
  document.head.appendChild(style);
}

function init(): void {
  injectStyles();
  // TODO: 在此实现核心功能逻辑

  // 监听动态内容（适合 SPA / 无限滚动页面）
  let timer: ReturnType<typeof setTimeout> | null = null;
  const observer = new MutationObserver(() => {
    if (timer) return;
    timer = setTimeout(() => {
      timer = null;
      // TODO: 调用你的 DOM 注入函数
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
