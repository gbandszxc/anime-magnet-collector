// ==UserScript==
// @name         Anime Magnet Collector
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  动漫BT站点增加复选框批量复制磁力链接
// @author       gbandszxc
// @icon      data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2IiBzaGFwZS1yZW5kZXJpbmc9ImNyaXNwRWRnZXMiPgogIDx0aXRsZT5BbmltZSBtYWduZXQgbWFzY290IGljb248L3RpdGxlPgogIDxyZWN0IHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0ibm9uZSIvPgoKICA8IS0tIGhhbG8gLS0+CiAgPHBhdGggZD0iTTUgMWg2djFoMnYxaC0yVjJINXYxSDNWMmgyeiIgZmlsbD0iIzUyYjhmZiIvPgogIDxwYXRoIGQ9Ik01IDJoNnYxSDV6IiBmaWxsPSIjZGZmNmZmIi8+CgogIDwhLS0gaGFpciBzaWxob3VldHRlIC0tPgogIDxwYXRoIGQ9Ik00IDRoMVYzaDZ2MWgxdjFoMXY2aC0xdjJoLTF2MUg1di0xSDR2LTJIM1Y1aDF6IiBmaWxsPSIjMjYzMjU1Ii8+CiAgPHBhdGggZD0iTTUgM2g2djFoMXY3aC0xdjJINXYtMkg0VjVoMXoiIGZpbGw9IiNmMWY4ZmYiLz4KCiAgPCEtLSBibHVlIHNoYWRvd3MgLS0+CiAgPHBhdGggZD0iTTQgNmgxdjVINHpNMTEgNWgxdjZoLTF6TTUgMTJoMnYxSDV6TTkgMTJoMnYxSDl6IiBmaWxsPSIjOWZiOGU4Ii8+CiAgPHBhdGggZD0iTTYgNGgxdjRINnpNOSA0aDF2NEg5eiIgZmlsbD0iI2M3ZDhmZiIvPgoKICA8IS0tIGhhaXIgYWNjZXNzb3J5IC0tPgogIDxwYXRoIGQ9Ik0xMiA0aDJ2MWgxdjNoLTF2MWgtMlY4aC0xVjVoMXoiIGZpbGw9IiMyMDI5NGEiLz4KICA8cGF0aCBkPSJNMTMgNWgxdjFoMXYxaC0xdjFoLTFWN2gtMVY2aDF6IiBmaWxsPSIjMzViOWZmIi8+CgogIDwhLS0gZmFjZSAtLT4KICA8cGF0aCBkPSJNNSA4aDZ2M2gtMXYxSDZ2LTFINXoiIGZpbGw9IiNmZmU2ZDIiLz4KICA8cGF0aCBkPSJNNSAxMGgxdjFINXpNMTAgMTBoMXYxaC0xeiIgZmlsbD0iI2ZmYjNiOSIvPgoKICA8IS0tIGV5ZXMgLS0+CiAgPHBhdGggZD0iTTYgOGgydjJINnpNOSA4aDJ2Mkg5eiIgZmlsbD0iIzE4MzY2ZiIvPgogIDxwYXRoIGQ9Ik03IDhoMXYxSDd6TTEwIDhoMXYxaC0xeiIgZmlsbD0iIzU0YzdmZiIvPgogIDxwYXRoIGQ9Ik03IDloMXYxSDd6TTEwIDloMXYxaC0xeiIgZmlsbD0iI2ZmZmZmZiIvPgoKICA8IS0tIG1vdXRoIC0tPgogIDxwYXRoIGQ9Ik03IDExaDJ2MUg3eiIgZmlsbD0iI2VjNmY4ZiIvPgoKICA8IS0tIGNvbGxhciAtLT4KICA8cGF0aCBkPSJNNiAxM2g0djFoMXYxSDV2LTFoMXoiIGZpbGw9IiMyNTM0NWUiLz4KICA8cGF0aCBkPSJNNyAxM2gydjFIN3oiIGZpbGw9IiM3OWQ3ZmYiLz4KPC9zdmc+Cg==
// @match      https://share.dmhy.org/*
// @match      https://dmhy.anoneko.com/*
// @match      https://nyaa.si/*
// @match      https://sukebei.nyaa.si/*
// @match      https://www.acgnx.se/*
// @match      https://share.acgnx.se/*
// @match      https://bangumi.moe/*
// @match      https://acg.rip/*
// @match      https://www.kisssub.org/*
// @grant      GM_addStyle
// @grant      GM_log
// @updateURL    https://raw.githubusercontent.com/gbandszxc/anime-magnet-collector/main/dist/anime-magnet-collector.user.js
// @downloadURL  https://raw.githubusercontent.com/gbandszxc/anime-magnet-collector/main/dist/anime-magnet-collector.user.js
// @license      MIT
// ==/UserScript==

"use strict";
(() => {
  // src/style.css
  var style_default = "/* ========================\n   Anime Magnet Collector\n   ======================== */\n\n/* Design Tokens */\n:root {\n  /* Color */\n  --amc-bg: rgba(255, 255, 255, 0.95);\n  --amc-bg-solid: #ffffff;\n  --amc-bg-disabled: rgba(0, 0, 0, 0.08);\n  --amc-bg-overlay: rgba(0, 0, 0, 0.5);\n\n  --amc-text-primary: #333333;\n  --amc-text-secondary: #666666;\n  --amc-text-muted: #999999;\n  --amc-text-disabled: #aaaaaa;\n  --amc-text-inverse: #ffffff;\n\n  --amc-accent: #4CAF50;\n  --amc-accent-hover: #43a047;\n\n  --amc-border: rgba(0, 0, 0, 0.1);\n  --amc-border-hover: rgba(0, 0, 0, 0.15);\n\n  /* Shadow */\n  --amc-shadow-sm: 0 1px 4px rgba(0, 0, 0, 0.08);\n  --amc-shadow-md: 0 4px 24px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.08);\n  --amc-shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.12);\n\n  /* Spacing */\n  --amc-space-xs: 4px;\n  --amc-space-sm: 8px;\n  --amc-space-md: 12px;\n  --amc-space-lg: 16px;\n  --amc-space-xl: 20px;\n\n  /* Radius */\n  --amc-radius-sm: 4px;\n  --amc-radius-md: 8px;\n  --amc-radius-pill: 999px;\n\n  /* Typography */\n  --amc-font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;\n  --amc-font-size-sm: 13px;\n  --amc-font-size-md: 14px;\n  --amc-font-size-lg: 16px;\n  --amc-font-weight-medium: 500;\n  --amc-font-weight-semibold: 600;\n  --amc-font-weight-bold: 700;\n\n  /* Motion */\n  --amc-duration-fast: 0.15s;\n  --amc-duration-normal: 0.2s;\n  --amc-ease-out: ease-out;\n\n  /* Z-Index */\n  --amc-z-float: 2147483647;\n}\n\n/* Floating Panel */\n#amc-float {\n  position: fixed;\n  z-index: var(--amc-z-float);\n  top: var(--amc-space-lg);\n  left: var(--amc-space-lg);\n  display: flex;\n  align-items: center;\n  gap: 2px;\n  background: var(--amc-bg);\n  backdrop-filter: blur(12px);\n  -webkit-backdrop-filter: blur(12px);\n  border: 1px solid var(--amc-border);\n  border-radius: var(--amc-radius-pill);\n  padding: 6px 12px 6px 8px;\n  box-shadow: var(--amc-shadow-md);\n  font-family: var(--amc-font-family);\n  font-size: var(--amc-font-size-sm);\n  user-select: none;\n  cursor: default;\n  transition: box-shadow var(--amc-duration-normal) var(--amc-ease-out),\n              padding var(--amc-duration-normal) var(--amc-ease-out);\n}\n\n#amc-float:hover {\n  box-shadow: var(--amc-shadow-lg);\n}\n\n#amc-float.amc-float-dragging {\n  box-shadow: var(--amc-shadow-lg);\n  cursor: grabbing;\n}\n\n/* Collapsed state - only handle visible */\n#amc-float.amc-float-collapsed {\n  padding: 6px;\n}\n\n#amc-float.amc-float-collapsed .amc-float-content {\n  display: none;\n}\n\n.amc-float-handle {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 24px;\n  height: 24px;\n  color: var(--amc-text-muted);\n  cursor: grab;\n  border-radius: 50%;\n  transition: color var(--amc-duration-fast) var(--amc-ease-out),\n              background var(--amc-duration-fast) var(--amc-ease-out);\n}\n\n.amc-float-handle:hover {\n  color: var(--amc-text-secondary);\n  background: rgba(0, 0, 0, 0.05);\n}\n\n.amc-float-dragging .amc-float-handle {\n  cursor: grabbing;\n}\n\n.amc-float-content {\n  display: flex;\n  align-items: center;\n  gap: var(--amc-space-md);\n}\n\n.amc-float-count {\n  color: var(--amc-text-primary);\n  font-weight: var(--amc-font-weight-medium);\n  white-space: nowrap;\n}\n\n.amc-float-count span {\n  color: var(--amc-accent);\n  font-weight: var(--amc-font-weight-bold);\n}\n\n.amc-float-btn {\n  padding: 5px 14px;\n  border-radius: var(--amc-radius-pill);\n  border: none;\n  font-size: var(--amc-font-size-sm);\n  font-weight: var(--amc-font-weight-semibold);\n  cursor: pointer;\n  transition: background var(--amc-duration-fast) var(--amc-ease-out),\n              transform var(--amc-duration-fast) var(--amc-ease-out);\n}\n\n.amc-float-btn:not(:disabled) {\n  background: var(--amc-accent);\n  color: var(--amc-text-inverse);\n}\n\n.amc-float-btn:not(:disabled):hover {\n  background: var(--amc-accent-hover);\n  transform: scale(1.02);\n}\n\n.amc-float-btn:disabled {\n  background: var(--amc-bg-disabled);\n  color: var(--amc-text-disabled);\n  cursor: not-allowed;\n}\n\n.amc-float-close-btn {\n  position: absolute;\n  top: -8px;\n  right: -8px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 20px;\n  height: 20px;\n  padding: 0;\n  border: 1px solid rgba(0, 0, 0, 0.08);\n  border-radius: 50%;\n  background: rgba(238, 238, 238, 0.82);\n  color: var(--amc-text-secondary);\n  cursor: pointer;\n  opacity: 0;\n  pointer-events: none;\n  transition: color var(--amc-duration-fast) var(--amc-ease-out),\n              background var(--amc-duration-fast) var(--amc-ease-out),\n              border-color var(--amc-duration-fast) var(--amc-ease-out),\n              opacity var(--amc-duration-fast) var(--amc-ease-out);\n}\n\n#amc-float:hover .amc-float-close-btn,\n.amc-float-close-btn:focus-visible {\n  opacity: 0.72;\n  pointer-events: auto;\n}\n\n.amc-float-close-btn:hover {\n  color: var(--amc-text-primary);\n  background: rgba(224, 224, 224, 0.96);\n  border-color: rgba(0, 0, 0, 0.14);\n  opacity: 1;\n}\n\n.amc-float-close-btn:focus-visible {\n  outline: 2px solid rgba(76, 175, 80, 0.45);\n  outline-offset: 2px;\n}\n\n/* Modal Overlay */\n.amc-modal-overlay {\n  position: fixed;\n  inset: 0;\n  background: var(--amc-bg-overlay);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: var(--amc-z-float);\n  font-family: var(--amc-font-family);\n}\n\n/* Modal */\n.amc-modal {\n  background: var(--amc-bg-solid);\n  border-radius: var(--amc-radius-md);\n  box-shadow: var(--amc-shadow-lg);\n  width: 90%;\n  max-width: 500px;\n  max-height: 80vh;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  animation: amc-modal-enter var(--amc-duration-normal) var(--amc-ease-out);\n}\n\n.amc-modal-header {\n  padding: var(--amc-space-lg) var(--amc-space-xl);\n  font-size: var(--amc-font-size-lg);\n  font-weight: var(--amc-font-weight-semibold);\n  border-bottom: 1px solid var(--amc-border);\n  color: var(--amc-text-primary);\n}\n\n.amc-modal-list {\n  padding: var(--amc-space-md) var(--amc-space-xl);\n  overflow-y: auto;\n  flex: 1;\n}\n\n.amc-modal-item {\n  display: flex;\n  padding: var(--amc-space-xs) 0;\n  font-size: var(--amc-font-size-md);\n  color: var(--amc-text-primary);\n}\n\n.amc-modal-num {\n  color: var(--amc-text-muted);\n  margin-right: var(--amc-space-sm);\n  min-width: 24px;\n}\n\n.amc-modal-title {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.amc-modal-footer {\n  padding: var(--amc-space-lg) var(--amc-space-xl);\n  border-top: 1px solid var(--amc-border);\n  display: flex;\n  gap: var(--amc-space-sm);\n  justify-content: flex-end;\n}\n\n/* Toast */\n.amc-toast {\n  position: fixed;\n  bottom: var(--amc-space-xl);\n  left: 50%;\n  transform: translateX(-50%);\n  background: var(--amc-text-primary);\n  color: var(--amc-text-inverse);\n  padding: 10px 20px;\n  border-radius: var(--amc-radius-pill);\n  font-size: var(--amc-font-size-md);\n  z-index: var(--amc-z-float);\n  font-family: var(--amc-font-family);\n  animation: amc-fade-in var(--amc-duration-normal) var(--amc-ease-out);\n}\n\n/* Checkbox Column */\n.amc-checkbox-col {\n  padding: var(--amc-space-xs) !important;\n}\n\n.amc-checkbox-row,\n.amc-checkbox-header {\n  width: 16px;\n  height: 16px;\n  cursor: pointer;\n}\n\n/* Animations */\n@keyframes amc-fade-in {\n  from {\n    opacity: 0;\n    transform: translateX(-50%) translateY(10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(-50%) translateY(0);\n  }\n}\n\n/* Modal animation - center origin */\n@keyframes amc-modal-enter {\n  from {\n    opacity: 0;\n    transform: scale(0.95) translateY(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: scale(1) translateY(0);\n  }\n}\n";

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

  // src/utils/magnet.ts
  function extractInfoHash(magnet) {
    const match = magnet.match(/btih:([^&]+)/i);
    return match ? match[1].toUpperCase() : null;
  }
  function isLongMagnet(magnet) {
    return /&(tr|dn|xl|xt)/.test(magnet);
  }
  function buildShortMagnet(magnet) {
    const infoHash = extractInfoHash(magnet);
    if (!infoHash) return null;
    return `magnet:?xt=urn:btih:${infoHash}`;
  }
  async function copyMagnetsToClipboard(items) {
    const text = items.map((item) => item.magnet).join("\n");
    await navigator.clipboard.writeText(text);
    return items.length;
  }
  function formatTitle(title, maxLen = 40) {
    const cleaned = title.replace(/\s+/g, " ").trim();
    if (cleaned.length <= maxLen) return cleaned;
    return cleaned.substring(0, maxLen - 3) + "...";
  }

  // src/sites/dmhy.ts
  var dmhyAdapter = {
    siteId: "dmhy",
    siteName: "动漫花园",
    matchPatterns: ["https://share.dmhy.org/*"],
    tableSelector: "table#topic_list",
    rowSelector: "tbody tr",
    titleHeader: "標題",
    magnetCellSelector: 'a[href^="magnet:"]',
    extractMagnet(row) {
      const link = row.querySelector(this.magnetCellSelector);
      return link?.href ?? "";
    },
    extractTitle(row) {
      const adapterExt = this;
      const idx = adapterExt._titleIdx ?? 3;
      const cells = row.querySelectorAll("td");
      const cell = cells[idx];
      if (!cell) return "";
      return cell.textContent?.trim().replace(/\s+/g, " ") ?? "";
    },
    buildShortMagnet(magnet) {
      return buildShortMagnet(magnet);
    }
  };

  // src/sites/anoneko.ts
  var anonekoAdapter = {
    ...dmhyAdapter,
    siteId: "anoneko",
    siteName: "动漫花园(镜像)",
    matchPatterns: ["https://dmhy.anoneko.com/*"]
  };

  // src/sites/nyaa.ts
  var nyaaAdapter = {
    siteId: "nyaa",
    siteName: "Nyaa",
    matchPatterns: ["https://nyaa.si/*"],
    tableSelector: "table",
    rowSelector: "tbody tr",
    titleHeader: "Name",
    magnetCellSelector: 'a[href^="magnet:"]',
    extractMagnet(row) {
      const link = row.querySelector(this.magnetCellSelector);
      return link?.href ?? "";
    },
    extractTitle(row) {
      const adapterExt = this;
      const idx = adapterExt._titleIdx ?? 1;
      const cells = row.querySelectorAll("td");
      const cell = cells[idx];
      if (!cell) return "";
      const titleLink = cell.querySelector('a[href^="/view/"]:not(.comments):not([href$="#comments"])');
      const title = titleLink?.title || titleLink?.textContent || cell.textContent;
      return title?.trim().replace(/\s+/g, " ") ?? "";
    },
    buildShortMagnet(magnet) {
      return buildShortMagnet(magnet);
    }
  };

  // src/sites/sukebei.ts
  var sukebeiAdapter = {
    ...nyaaAdapter,
    siteId: "sukebei",
    siteName: "Sukebei",
    matchPatterns: ["https://sukebei.nyaa.si/*"],
    _titleIdx: 1
  };

  // src/sites/acgnx.ts
  var acgnxAdapter = {
    siteId: "acgnx",
    siteName: "AcgnX",
    matchPatterns: ["https://www.acgnx.se/*"],
    tableSelector: "table#listTable",
    rowSelector: "tbody tr",
    titleHeader: "Name",
    magnetCellSelector: "#magnet",
    extractMagnet(row) {
      const link = row.querySelector("#magnet");
      return link?.href ?? "";
    },
    extractTitle(row) {
      const adapterExt = this;
      const idx = adapterExt._titleIdx ?? 3;
      const cells = row.querySelectorAll("td");
      const cell = cells[idx];
      if (!cell) return "";
      const link = cell?.querySelector("a");
      return link?.textContent?.trim() ?? cell?.textContent?.trim() ?? "";
    },
    buildShortMagnet(magnet) {
      return buildShortMagnet(magnet);
    }
  };

  // src/sites/shareacgnx.ts
  var shareacgnxAdapter = {
    siteId: "shareacgnx",
    siteName: "AcgnX中文站",
    matchPatterns: ["https://share.acgnx.se/*"],
    tableSelector: "table#listTable",
    rowSelector: "tbody tr",
    titleHeader: "資源名稱",
    magnetCellSelector: "#magnet",
    extractMagnet(row) {
      const link = row.querySelector("#magnet");
      return link?.href ?? "";
    },
    extractTitle(row) {
      const adapterExt = this;
      const idx = adapterExt._titleIdx ?? 3;
      const cells = row.querySelectorAll("td");
      const cell = cells[idx];
      if (!cell) return "";
      const link = cell?.querySelector("a");
      return link?.textContent?.trim() ?? cell?.textContent?.trim() ?? "";
    },
    buildShortMagnet(magnet) {
      return buildShortMagnet(magnet);
    }
  };

  // src/sites/bangumi.ts
  var bangumiAdapter = {
    siteId: "bangumi",
    siteName: "萌番组",
    matchPatterns: ["https://bangumi.moe/*"],
    tableSelector: ".torrent-list",
    rowSelector: "md-item.torrent-row",
    titleHeader: "",
    magnetCellSelector: "",
    extractMagnet(row) {
      const id = extractTorrentId(row);
      return id ? getMagnetFromCache(id) ?? "" : "";
    },
    extractTitle(row) {
      const titleEl = row.querySelector(".torrent-title h3");
      const title = titleEl?.textContent?.trim();
      if (title) return title.replace(/\s+/g, " ");
      const titleContainer = row.querySelector(".torrent-title");
      return titleContainer?.firstChild?.textContent?.trim().replace(/\s+/g, " ") ?? "";
    },
    buildShortMagnet(magnet) {
      return magnet;
    }
  };
  function extractTorrentId(row) {
    const link = row.querySelector('a[href^="/torrent/"], a[href*="/torrent/"]');
    const href = link?.getAttribute("href") ?? "";
    const match = href.match(/\/torrent\/([^/?#]+)/);
    return match ? match[1] : null;
  }
  var magnetCache = /* @__PURE__ */ new Map();
  function getMagnetFromCache(id) {
    return magnetCache.get(id);
  }
  function buildMagnetCache(torrents) {
    for (const t of torrents) {
      if (t._id && t.magnet) {
        magnetCache.set(t._id, t.magnet);
      }
    }
  }
  function isHomepage() {
    return window.location.pathname === "/";
  }
  function extractTagId() {
    const match = window.location.pathname.match(/\/search\/([^/]+)/);
    return match ? match[1] : null;
  }
  async function fetchMagnetPage(page) {
    if (isHomepage()) {
      const res = await fetch(`/api/torrent/latest?page=${page}`);
      const data = await res.json();
      return data.torrents || [];
    } else {
      const tagId = extractTagId();
      if (!tagId) return [];
      const res = await fetch("/api/torrent/search", {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify({ tag_id: [tagId], p: page })
      });
      const data = await res.json();
      return data.torrents || [];
    }
  }
  function getRequiredPages(selectedIndexes) {
    const pages = /* @__PURE__ */ new Set();
    for (const idx of selectedIndexes) {
      pages.add(Math.floor(idx / 30) + 1);
    }
    return Array.from(pages).sort((a, b) => a - b);
  }
  async function prefetchMagnetsForSelection(selectedIndexes) {
    const pages = getRequiredPages(selectedIndexes);
    const promises = pages.map((p) => fetchMagnetPage(p));
    const results = await Promise.all(promises);
    for (const torrents of results) {
      buildMagnetCache(torrents);
    }
  }

  // src/sites/acgrip.ts
  var acgripAdapter = {
    siteId: "acgrip",
    siteName: "ACG.RIP",
    matchPatterns: ["https://acg.rip/*"],
    tableSelector: "table",
    rowSelector: "tbody tr",
    titleHeader: "标题",
    magnetCellSelector: "a[href$='.torrent']",
    extractMagnet(row) {
      const link = row.querySelector(this.magnetCellSelector);
      return link?.href ?? "";
    },
    extractTitle(row) {
      const titleLink = row.querySelector('a[href*="/t/"]');
      return titleLink?.textContent?.trim() ?? "";
    },
    buildShortMagnet(magnet) {
      return magnet;
    }
  };

  // src/sites/kisssub.ts
  var DETAIL_LINK_SELECTOR = 'a[href*="show-"][href$=".html"]';
  function extractInfoHashFromDetailUrl(url) {
    const match = url.match(/show-([a-f0-9]{40})\.html/i);
    return match?.[1].toUpperCase() ?? null;
  }
  var kisssubAdapter = {
    siteId: "kisssub",
    siteName: "爱恋动漫",
    matchPatterns: ["https://www.kisssub.org/*"],
    tableSelector: "table#listTable",
    rowSelector: "tbody tr",
    titleHeader: "标题",
    magnetCellSelector: DETAIL_LINK_SELECTOR,
    extractMagnet(row) {
      const link = row.querySelector(DETAIL_LINK_SELECTOR);
      if (!link?.href) return "";
      const infoHash = extractInfoHashFromDetailUrl(link.href);
      if (!infoHash) return "";
      return `magnet:?xt=urn:btih:${infoHash}`;
    },
    extractTitle(row) {
      const link = row.querySelector(DETAIL_LINK_SELECTOR);
      return link?.textContent?.trim() ?? "";
    },
    buildShortMagnet(magnet) {
      const infoHash = extractInfoHashFromDetailUrl(magnet) ?? magnet.match(/btih:([^&]+)/i)?.[1]?.toUpperCase();
      if (!infoHash) return null;
      return `magnet:?xt=urn:btih:${infoHash}`;
    }
  };

  // src/sites/index.ts
  var adapters = [dmhyAdapter, anonekoAdapter, nyaaAdapter, sukebeiAdapter, acgnxAdapter, shareacgnxAdapter, bangumiAdapter, acgripAdapter, kisssubAdapter];
  function findAdapter() {
    const url = window.location.href;
    return adapters.find(
      (a) => a.matchPatterns.some((pattern) => {
        const regex = new RegExp("^" + pattern.replace(/\*/g, ".*") + "$");
        return regex.test(url);
      })
    );
  }

  // src/components/SelectionStore.ts
  var SelectionStore = class {
    constructor() {
      this.selected = /* @__PURE__ */ new Set();
      this.listeners = /* @__PURE__ */ new Set();
    }
    toggle(index) {
      if (this.selected.has(index)) {
        this.selected.delete(index);
      } else {
        this.selected.add(index);
      }
      this.notify();
    }
    selectAll(indexes) {
      indexes.forEach((i) => this.selected.add(i));
      this.notify();
    }
    deselectAll() {
      this.selected.clear();
      this.notify();
    }
    isSelected(index) {
      return this.selected.has(index);
    }
    getSelected() {
      return Array.from(this.selected);
    }
    getCount() {
      return this.selected.size;
    }
    onChange(callback) {
      this.listeners.add(callback);
      return () => this.listeners.delete(callback);
    }
    notify() {
      this.listeners.forEach((cb) => cb(this.getCount()));
    }
  };
  var selectionStore = new SelectionStore();

  // src/components/CheckboxColumn.ts
  function findCellIndex(adapter, headerText) {
    const table = document.querySelector(adapter.tableSelector);
    if (!table) return -1;
    const thead = table.querySelector("thead");
    if (!thead) return -1;
    const headers = thead.querySelectorAll("th");
    for (let i = 0; i < headers.length; i++) {
      const text = headers[i].textContent?.trim() ?? "";
      if (text === headerText) {
        return i + 1;
      }
    }
    return -1;
  }
  function getColumnIndices(adapter) {
    const table = document.querySelector(adapter.tableSelector);
    if (!table) return { titleCellIndex: -1, magnetCellIndex: -1 };
    const titleIdx = findCellIndex(adapter, adapter.titleHeader);
    const firstRow = table.querySelector(adapter.rowSelector);
    const magnetEl = firstRow?.querySelector(adapter.magnetCellSelector);
    const magnetTd = magnetEl?.parentElement;
    const magnetIdx = magnetTd ? Array.from(magnetTd.parentElement.children).indexOf(magnetTd) + 1 : -1;
    return { titleCellIndex: titleIdx, magnetCellIndex: magnetIdx };
  }
  function injectCheckboxColumn(adapter) {
    if (adapter.siteId === "bangumi") {
      injectBangumiCheckbox(adapter);
      return;
    }
    const table = document.querySelector(adapter.tableSelector);
    if (!table) return;
    if (table.querySelector(".amc-checkbox-col")) return;
    const thead = table.querySelector("thead");
    const tbody = table.querySelector("tbody");
    if (!thead || !tbody) return;
    const indices = getColumnIndices(adapter);
    adapter._titleIdx = indices.titleCellIndex;
    const th = document.createElement("th");
    th.className = "amc-checkbox-col";
    th.style.width = "30px";
    th.style.textAlign = "center";
    const headerCheckbox = document.createElement("input");
    headerCheckbox.type = "checkbox";
    headerCheckbox.title = "全选";
    headerCheckbox.className = "amc-checkbox-header";
    th.appendChild(headerCheckbox);
    thead.querySelector("tr")?.prepend(th);
    const rows = tbody.querySelectorAll(adapter.rowSelector);
    rows.forEach((row, idx) => {
      const td = document.createElement("td");
      td.className = "amc-checkbox-col";
      td.style.textAlign = "center";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "amc-checkbox-row";
      checkbox.dataset.rowIndex = String(idx);
      checkbox.addEventListener("change", () => {
        selectionStore.toggle(idx);
        updateHeaderState();
      });
      td.appendChild(checkbox);
      row.prepend(td);
    });
    headerCheckbox.addEventListener("change", () => {
      const allIndexes = Array.from(rows).map((_, i) => i);
      if (headerCheckbox.checked) {
        selectionStore.selectAll(allIndexes);
        rows.forEach((_, i) => {
          const cb = tbody.querySelector(`[data-row-index="${i}"]`);
          if (cb) cb.checked = true;
        });
      } else {
        selectionStore.deselectAll();
        rows.forEach((_, i) => {
          const cb = tbody.querySelector(`[data-row-index="${i}"]`);
          if (cb) cb.checked = false;
        });
      }
    });
    function updateHeaderState() {
      const count = selectionStore.getCount();
      headerCheckbox.checked = count > 0 && count === rows.length;
      headerCheckbox.indeterminate = count > 0 && count < rows.length;
    }
    selectionStore.onChange(() => {
      rows.forEach((_, i) => {
        const cb = tbody.querySelector(`[data-row-index="${i}"]`);
        if (cb) cb.checked = selectionStore.isSelected(i);
      });
      updateHeaderState();
    });
  }
  function injectBangumiCheckbox(adapter) {
    const existingStyle = document.getElementById("amc-bangumi-style");
    if (!existingStyle) {
      const style = document.createElement("style");
      style.id = "amc-bangumi-style";
      style.textContent = `
      md-item.torrent-row {
        display: flex !important;
        align-items: center !important;
      }
      md-item.torrent-row > md-item-content {
        flex: 1;
      }
      .amc-bangumi-cb {
        width: 52px;
        margin-right: 12px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .amc-bangumi-cb input {
        width: 18px;
        height: 18px;
        cursor: pointer;
      }
    `;
      document.head.appendChild(style);
    }
    let dataList = null;
    for (const list of document.querySelectorAll(adapter.tableSelector)) {
      if (list.querySelectorAll(adapter.rowSelector).length > 0) {
        dataList = list;
        break;
      }
    }
    if (!dataList) return;
    const items = dataList.querySelectorAll(adapter.rowSelector);
    items.forEach((item, idx) => {
      if (item.querySelector(".amc-bangumi-cb")) return;
      const wrapper = document.createElement("div");
      wrapper.className = "amc-bangumi-cb";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.dataset.rowIndex = String(idx);
      checkbox.checked = selectionStore.isSelected(idx);
      wrapper.addEventListener("click", (event) => {
        event.stopPropagation();
      });
      checkbox.addEventListener("click", (event) => {
        event.stopPropagation();
      });
      checkbox.addEventListener("change", (event) => {
        event.stopPropagation();
        if (checkbox.checked !== selectionStore.isSelected(idx)) {
          selectionStore.toggle(idx);
        }
      });
      wrapper.appendChild(checkbox);
      const content = item.querySelector("md-item-content");
      if (content) {
        item.insertBefore(wrapper, content);
      }
    });
    selectionStore.onChange(() => {
      items.forEach((_, i) => {
        const cb = dataList.querySelector(`[data-row-index="${i}"]`);
        if (cb) cb.checked = selectionStore.isSelected(i);
      });
    });
  }
  function removeCheckboxColumn(adapter) {
    if (adapter.siteId === "bangumi") {
      document.querySelectorAll(".amc-bangumi-cb").forEach((el) => el.remove());
      const style = document.getElementById("amc-bangumi-style");
      if (style) style.remove();
      selectionStore.deselectAll();
      return;
    }
    const table = document.querySelector(adapter.tableSelector);
    if (!table) return;
    table.querySelectorAll(".amc-checkbox-col").forEach((cell) => cell.remove());
    selectionStore.deselectAll();
  }

  // src/components/Modal.ts
  var modalEl = null;
  async function openModal() {
    if (modalEl) {
      modalEl.remove();
      modalEl = null;
    }
    const adapter = findAdapter();
    if (!adapter) return;
    const selectedIndexes = selectionStore.getSelected();
    if (adapter.siteId === "bangumi") {
      await prefetchMagnetsForSelection(selectedIndexes);
    }
    const rows = adapter.siteId === "bangumi" ? document.querySelectorAll(adapter.rowSelector) : document.querySelector(adapter.tableSelector)?.querySelectorAll(adapter.rowSelector);
    if (!rows) return;
    const selectedItems = selectedIndexes.map((idx) => {
      const row = rows[idx];
      return {
        title: row ? adapter.extractTitle(row) : "",
        magnet: row ? adapter.extractMagnet(row) : ""
      };
    });
    modalEl = document.createElement("div");
    modalEl.className = "amc-modal-overlay";
    modalEl.innerHTML = `
    <div class="amc-modal">
      <div class="amc-modal-header">已选 ${selectedItems.length} 项</div>
      <div class="amc-modal-list">
        ${selectedItems.map((item, i) => `
          <div class="amc-modal-item">
            <span class="amc-modal-num">${i + 1}.</span>
            <span class="amc-modal-title" title="${item.title}">${formatTitle(item.title)}</span>
          </div>
        `).join("")}
      </div>
      <div class="amc-modal-footer">
        <button id="amc-copy-long" class="amc-float-btn">复制长链</button>
        <button id="amc-copy-short" class="amc-float-btn">复制短链</button>
        <button id="amc-cancel" class="amc-float-btn">取消</button>
      </div>
    </div>
  `;
    document.body.appendChild(modalEl);
    const longBtn = modalEl.querySelector("#amc-copy-long");
    const shortBtn = modalEl.querySelector("#amc-copy-short");
    const hasShort = selectedItems.some((item) => !isLongMagnet(item.magnet));
    if (adapter.siteId === "acgrip") {
      shortBtn.title = "复制 torrent 链接";
    } else if (hasShort) {
      longBtn.disabled = true;
      longBtn.title = "所选包含短链，无法还原为长链";
      shortBtn.title = "所选包含短链，部分直接复制，部分转换";
    }
    modalEl.querySelector("#amc-copy-long").onclick = async () => {
      const count = await copyMagnetsToClipboard(selectedItems);
      showToast(`已复制 ${count} 条磁力链`);
      closeModal();
    };
    shortBtn.onclick = async () => {
      const shortItems = selectedItems.map((item) => {
        const short = adapter.buildShortMagnet?.(item.magnet);
        return short ?? item.magnet;
      });
      const count = await copyMagnetsToClipboard(shortItems.map((m) => ({ magnet: m })));
      showToast(`已复制 ${count} 条短链`);
      closeModal();
    };
    modalEl.querySelector("#amc-cancel").onclick = closeModal;
    modalEl.querySelector(".amc-modal-overlay").onclick = (e) => {
      if (e.target === modalEl) closeModal();
    };
  }
  function closeModal() {
    if (modalEl) {
      modalEl.remove();
      modalEl = null;
    }
  }
  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "amc-toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2e3);
  }

  // src/components/Toolbar.ts
  function injectToolbar(options = {}) {
    const toolbar = document.createElement("div");
    toolbar.id = "amc-float";
    toolbar.innerHTML = `
    <div class="amc-float-handle" title="拖动或点击折叠">
      <svg class="amc-float-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
      </svg>
      <svg class="amc-float-mascot" width="16" height="16" viewBox="0 0 16 16" style="display:none">
        <path d="M5 1h6v1h2v1h-2V2H5v1H3V2h2z" fill="#52b8ff"/>
        <path d="M5 2h6v1H5z" fill="#dff6ff"/>
        <path d="M4 4h1V3h6v1h1v1h1v6h-1v2h-1v1H5v-1H4v-2H3V5h1z" fill="#263255"/>
        <path d="M5 3h6v1h1v7h-1v2H5v-2H4V5h1z" fill="#f1f8ff"/>
        <path d="M4 6h1v5H4zM11 5h1v6h-1zM5 12h2v1H5zM9 12h2v1H9z" fill="#9fb8e8"/>
        <path d="M6 4h1v4H6zM9 4h1v4H9z" fill="#c7d8ff"/>
        <path d="M12 4h2v1h1v3h-1v1h-2V8h-1V5h1z" fill="#20294a"/>
        <path d="M13 5h1v1h1v1h-1v1h-1V7h-1V6h1z" fill="#35b9ff"/>
        <path d="M5 8h6v3h-1v1H6v-1H5z" fill="#ffe6d2"/>
        <path d="M5 10h1v1H5zM10 10h1v1h-1z" fill="#ffb3b9"/>
        <path d="M6 8h2v2H6zM9 8h2v2H9z" fill="#18366f"/>
        <path d="M7 8h1v1H7zM10 8h1v1h-1z" fill="#54c7ff"/>
        <path d="M7 9h1v1H7zM10 9h1v1h-1z" fill="#ffffff"/>
        <path d="M7 11h2v1H7z" fill="#ec6f8f"/>
        <path d="M6 13h4v1h1v1H5v-1h1z" fill="#25345e"/>
        <path d="M7 13h2v1H7z" fill="#79d7ff"/>
      </svg>
    </div>
    <div class="amc-float-content">
      <span class="amc-float-count"><span id="amc-count">0</span> 项</span>
      <button id="amc-copy-btn" class="amc-float-btn" disabled>复制</button>
    </div>
    <button id="amc-close-btn" class="amc-float-close-btn" title="关闭并恢复页面" aria-label="关闭并恢复页面">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <path d="M18 6 6 18"/><path d="M6 6l12 12"/>
      </svg>
    </button>
  `;
    document.body.appendChild(toolbar);
    const countEl = document.getElementById("amc-count");
    const copyBtn = document.getElementById("amc-copy-btn");
    const closeBtn = document.getElementById("amc-close-btn");
    selectionStore.onChange((count) => {
      countEl.textContent = String(count);
      copyBtn.disabled = count === 0;
    });
    copyBtn.addEventListener("click", () => {
      if (selectionStore.getCount() > 0) {
        openModal();
      }
    });
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      document.querySelector(".amc-modal-overlay")?.remove();
      toolbar.remove();
      options.onClose?.();
    });
    initFloatPanel(toolbar);
  }
  function initFloatPanel(panel) {
    const handle = panel.querySelector(".amc-float-handle");
    const state = {
      dragging: false,
      dragOffsetX: 0,
      dragOffsetY: 0,
      snapped: "left"
    };
    function getDefaultPosition() {
      return { x: 16, y: 16 };
    }
    function initPosition() {
      const pos = getDefaultPosition();
      panel.style.left = `${pos.x}px`;
      panel.style.top = `${pos.y}px`;
      panel.style.right = "auto";
      panel.style.bottom = "auto";
      state.snapped = null;
    }
    function getPanelSize() {
      const rect = panel.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    }
    function getVisibleBounds() {
      const { width, height } = getPanelSize();
      const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
      const viewportHeight = document.documentElement.clientHeight || window.innerHeight;
      return {
        minX: 0,
        maxX: Math.max(0, viewportWidth - width),
        minY: 0,
        maxY: Math.max(0, viewportHeight - height)
      };
    }
    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }
    function setPanelPosition(x, y, bounds = getVisibleBounds()) {
      panel.style.left = `${clamp(x, bounds.minX, bounds.maxX)}px`;
      panel.style.top = `${clamp(y, bounds.minY, bounds.maxY)}px`;
      panel.style.right = "auto";
      panel.style.bottom = "auto";
    }
    function keepPanelVisible() {
      const rect = panel.getBoundingClientRect();
      setPanelPosition(rect.left, rect.top);
    }
    function collapsePanel() {
      const dotsIcon = handle.querySelector(".amc-float-icon");
      const mascotIcon = handle.querySelector(".amc-float-mascot");
      panel.classList.add("amc-float-collapsed");
      handle.title = "点击展开";
      dotsIcon.style.display = "none";
      mascotIcon.style.display = "";
    }
    function expandPanel() {
      const dotsIcon = handle.querySelector(".amc-float-icon");
      const mascotIcon = handle.querySelector(".amc-float-mascot");
      panel.classList.remove("amc-float-collapsed");
      handle.title = "拖动或点击折叠";
      dotsIcon.style.display = "";
      mascotIcon.style.display = "none";
    }
    function applySnap(edge) {
      const { width, height } = getPanelSize();
      const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
      const viewportHeight = document.documentElement.clientHeight || window.innerHeight;
      const halfVisibleBounds = {
        minX: -width / 2,
        maxX: viewportWidth - width / 2,
        minY: -height / 2,
        maxY: viewportHeight - height / 2
      };
      const rect = panel.getBoundingClientRect();
      const currentX = rect.left;
      const currentY = rect.top;
      if (edge === "left") {
        setPanelPosition(halfVisibleBounds.minX, currentY, halfVisibleBounds);
      } else if (edge === "right") {
        setPanelPosition(halfVisibleBounds.maxX, currentY, halfVisibleBounds);
      } else if (edge === "top") {
        setPanelPosition(currentX, halfVisibleBounds.minY, halfVisibleBounds);
      } else {
        setPanelPosition(currentX, halfVisibleBounds.maxY, halfVisibleBounds);
      }
      state.snapped = edge;
    }
    function getTouchedEdge() {
      const rect = panel.getBoundingClientRect();
      const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
      const viewportHeight = document.documentElement.clientHeight || window.innerHeight;
      const edgeThreshold = 8;
      if (rect.left <= edgeThreshold) return "left";
      if (viewportWidth - rect.right <= edgeThreshold) return "right";
      if (rect.top <= edgeThreshold) return "top";
      if (viewportHeight - rect.bottom <= edgeThreshold) return "bottom";
      return null;
    }
    function collapseIfTouchingEdge() {
      const touchedEdge = getTouchedEdge();
      if (!touchedEdge) {
        state.snapped = null;
        keepPanelVisible();
        return;
      }
      collapsePanel();
      requestAnimationFrame(() => applySnap(touchedEdge));
    }
    function toggleCollapse() {
      const isCollapsed = panel.classList.contains("amc-float-collapsed");
      if (isCollapsed) {
        expandPanel();
        state.snapped = null;
        requestAnimationFrame(keepPanelVisible);
      } else {
        collapsePanel();
        requestAnimationFrame(keepPanelVisible);
      }
    }
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let hasMoved = false;
    const onMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (!state.dragging && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
        state.dragging = true;
        hasMoved = true;
        panel.classList.add("amc-float-dragging");
        const rect = panel.getBoundingClientRect();
        state.dragOffsetX = e.clientX - rect.left;
        state.dragOffsetY = e.clientY - rect.top;
      }
      if (state.dragging) {
        setPanelPosition(e.clientX - state.dragOffsetX, e.clientY - state.dragOffsetY);
        state.snapped = null;
      }
    };
    const onMouseUp = (e) => {
      if (isDragging) {
        if (state.dragging) {
          state.dragging = false;
          panel.classList.remove("amc-float-dragging");
          collapseIfTouchingEdge();
        }
        isDragging = false;
      }
    };
    handle.addEventListener("mousedown", (e) => {
      if (e.target.closest(".amc-float-btn")) return;
      e.preventDefault();
      e.stopPropagation();
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      state.dragging = false;
      hasMoved = false;
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp, { once: true });
    });
    handle.addEventListener("click", (e) => {
      if (!state.dragging && !hasMoved) {
        toggleCollapse();
      }
      state.dragging = false;
      hasMoved = false;
    });
    panel.addEventListener("click", (e) => {
      if (e.target.closest(".amc-float-handle")) return;
      if (!panel.classList.contains("amc-float-collapsed")) return;
      if (state.dragging || hasMoved) return;
      toggleCollapse();
    });
    handle.addEventListener("touchstart", (e) => {
      if (e.target.closest(".amc-float-btn")) return;
      e.preventDefault();
      const touch = e.touches[0];
      isDragging = true;
      startX = touch.clientX;
      startY = touch.clientY;
      state.dragging = false;
      hasMoved = false;
    }, { passive: false });
    document.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      if (!state.dragging && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
        state.dragging = true;
        hasMoved = true;
        panel.classList.add("amc-float-dragging");
        const rect = panel.getBoundingClientRect();
        state.dragOffsetX = touch.clientX - rect.left;
        state.dragOffsetY = touch.clientY - rect.top;
      }
      if (state.dragging) {
        setPanelPosition(touch.clientX - state.dragOffsetX, touch.clientY - state.dragOffsetY);
        state.snapped = null;
      }
    }, { passive: false });
    document.addEventListener("touchend", (e) => {
      if (isDragging) {
        if (state.dragging) {
          state.dragging = false;
          panel.classList.remove("amc-float-dragging");
          collapseIfTouchingEdge();
        }
        isDragging = false;
      }
    });
    handle.addEventListener("dblclick", (e) => {
      e.preventDefault();
      toggleCollapse();
    });
    function onResize() {
      if (state.snapped) {
        applySnap(state.snapped);
      } else {
        keepPanelVisible();
      }
    }
    window.addEventListener("resize", onResize);
    requestAnimationFrame(initPosition);
  }

  // src/main.ts
  var STYLE_ID = "anime-magnet-collector-style";
  var { log } = createUtils({ config: CONFIG });
  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    if (typeof GM_addStyle === "function") {
      GM_addStyle(style_default);
    } else {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = style_default;
      document.head.appendChild(style);
    }
  }
  function init() {
    injectStyles();
    const adapter = findAdapter();
    if (!adapter) {
      log("未匹配的站点，脚本不执行");
      return;
    }
    log(`检测到站点: ${adapter.siteName}`);
    if (adapter.siteId === "bangumi") {
      let observer = null;
      let scheduled = false;
      const ensureInjected = () => {
        const rows = document.querySelectorAll(adapter.rowSelector);
        if (rows.length === 0) return false;
        if (!document.getElementById("amc-float")) {
          injectToolbar({
            onClose: () => {
              observer?.disconnect();
              observer = null;
              removeCheckboxColumn(adapter);
            }
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
      onClose: () => removeCheckboxColumn(adapter)
    });
    injectCheckboxColumn(adapter);
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
