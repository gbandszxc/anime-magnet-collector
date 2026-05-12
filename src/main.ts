/// <reference types="@types/tampermonkey" />
import cssText from "./style.css";
import { CONFIG } from "./config";
import { createUtils } from "./utils";
import { findAdapter } from "./sites/index";
import { injectCheckboxColumn, removeCheckboxColumn } from "./components/CheckboxColumn";
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

  if (adapter.siteId === "bangumi") {
    let observer: MutationObserver | null = null;
    let scheduled = false;

    const ensureInjected = (): boolean => {
      const rows = document.querySelectorAll(adapter.rowSelector);
      if (rows.length === 0) return false;

      if (!document.getElementById("amc-float")) {
        injectToolbar({
          onClose: () => {
            observer?.disconnect();
            observer = null;
            removeCheckboxColumn(adapter);
          },
        });
      }
      injectCheckboxColumn(adapter);
      return true;
    };

    const scheduleEnsureInjected = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        ensureInjected();
      });
    };

    observer = new MutationObserver(() => {
      scheduleEnsureInjected();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    if (ensureInjected()) {
      log("初始化完成");
    } else {
      log("等待列表渲染...");
    }
    return;
  }

  injectToolbar({
    onClose: () => removeCheckboxColumn(adapter),
  });
  injectCheckboxColumn(adapter);

  // dmhy 是静态分页，不需要 MutationObserver。
  // 如果后续站点有 SPA/无限滚动需求，在这里针对性的监听对应 table tbody。

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
