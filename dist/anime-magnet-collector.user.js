// ==UserScript==
// @name         Anime Magnet Collector
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  动漫BT站点增加复选框批量复制磁力链接
// @author       gbandszxc
// @match      https://*/*
// @grant      GM_addStyle
// @grant      GM_log
// @updateURL    https://raw.githubusercontent.com/gbandszxc/anime-magnet-collector/main/dist/anime-magnet-collector.user.js
// @downloadURL  https://raw.githubusercontent.com/gbandszxc/anime-magnet-collector/main/dist/anime-magnet-collector.user.js
// @license      MIT
// ==/UserScript==

"use strict";
(() => {
  // src/style.css
  var style_default = "/* Anime Magnet Collector 样式 */\n\n/* TODO: 在此添加注入到页面的样式 */\n";

  // src/config.ts
  var CONFIG = {
    debug: true
  };

  // src/utils.ts
  function createUtils({ config = CONFIG } = {}) {
    function log2(...args) {
      if (config.debug) console.log("[Anime Magnet Collector]", ...args);
    }
    return { log: log2 };
  }

  // src/main.ts
  var STYLE_ID = "anime-magnet-collector-style";
  var { log } = createUtils({ config: CONFIG });
  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    if (typeof GM_addStyle === "function") {
      GM_addStyle(style_default);
      const marker = document.createElement("style");
      marker.id = STYLE_ID;
      marker.textContent = "";
      document.head.appendChild(marker);
      return;
    }
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = style_default;
    document.head.appendChild(style);
  }
  function init() {
    injectStyles();
    let timer = null;
    const observer = new MutationObserver(() => {
      if (timer) return;
      timer = setTimeout(() => {
        timer = null;
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
})();
