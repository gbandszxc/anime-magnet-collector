import { selectionStore } from "./SelectionStore";
import { openModal } from "./Modal";

export function injectToolbar(): void {
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
  `;
  document.body.appendChild(toolbar);

  const countEl = document.getElementById("amc-count")!;
  const copyBtn = document.getElementById("amc-copy-btn") as HTMLButtonElement;

  selectionStore.onChange((count) => {
    countEl.textContent = String(count);
    copyBtn.disabled = count === 0;
  });

  copyBtn.addEventListener("click", () => {
    if (selectionStore.getCount() > 0) {
      openModal();
    }
  });

  // Draggable floating panel
  initFloatPanel(toolbar);
}

function initFloatPanel(panel: HTMLElement): void {
  const handle = panel.querySelector(".amc-float-handle") as HTMLElement;

  const state = {
    dragging: false,
    dragOffsetX: 0,
    dragOffsetY: 0,
    snapped: "left" as "left" | "right" | "top" | "bottom" | null,
  };

  type FloatEdge = NonNullable<typeof state.snapped>;

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
      maxY: Math.max(0, viewportHeight - height),
    };
  }

  function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  function setPanelPosition(x: number, y: number, bounds = getVisibleBounds()) {
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
    const dotsIcon = handle.querySelector(".amc-float-icon") as HTMLElement;
    const mascotIcon = handle.querySelector(".amc-float-mascot") as HTMLElement;

    panel.classList.add("amc-float-collapsed");
    handle.title = "点击展开";
    dotsIcon.style.display = "none";
    mascotIcon.style.display = "";
  }

  function expandPanel() {
    const dotsIcon = handle.querySelector(".amc-float-icon") as HTMLElement;
    const mascotIcon = handle.querySelector(".amc-float-mascot") as HTMLElement;

    panel.classList.remove("amc-float-collapsed");
    handle.title = "拖动或点击折叠";
    dotsIcon.style.display = "";
    mascotIcon.style.display = "none";
  }

  function applySnap(edge: FloatEdge) {
    const { width, height } = getPanelSize();
    const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
    const viewportHeight = document.documentElement.clientHeight || window.innerHeight;
    const halfVisibleBounds = {
      minX: -width / 2,
      maxX: viewportWidth - width / 2,
      minY: -height / 2,
      maxY: viewportHeight - height / 2,
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

  function getTouchedEdge(): FloatEdge | null {
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

  // 拖动逻辑 - 分离拖动和点击检测
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let hasMoved = false;

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    // 只有移动超过阈值才启动拖动
    if (!state.dragging && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
      state.dragging = true;
      hasMoved = true;
      panel.classList.add("amc-float-dragging");
      // 计算初始偏移
      const rect = panel.getBoundingClientRect();
      state.dragOffsetX = e.clientX - rect.left;
      state.dragOffsetY = e.clientY - rect.top;
    }

    if (state.dragging) {
      setPanelPosition(e.clientX - state.dragOffsetX, e.clientY - state.dragOffsetY);
      state.snapped = null;
    }
  };

  const onMouseUp = (e: MouseEvent) => {
    if (isDragging) {
      if (state.dragging) {
        state.dragging = false;
        panel.classList.remove("amc-float-dragging");
        collapseIfTouchingEdge();
      }
      isDragging = false;
    }
  };

  // Handle events
  handle.addEventListener("mousedown", (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest(".amc-float-btn")) return;
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

  // Click to toggle collapse (only when not dragging)
  handle.addEventListener("click", (e: MouseEvent) => {
    if (!state.dragging && !hasMoved) {
      toggleCollapse();
    }
    // Reset dragging state
    state.dragging = false;
    hasMoved = false;
  });

  panel.addEventListener("click", (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest(".amc-float-handle")) return;
    if (!panel.classList.contains("amc-float-collapsed")) return;
    if (state.dragging || hasMoved) return;

    toggleCollapse();
  });

  // Touch support
  handle.addEventListener("touchstart", (e: TouchEvent) => {
    if ((e.target as HTMLElement).closest(".amc-float-btn")) return;
    e.preventDefault();

    const touch = e.touches[0];
    isDragging = true;
    startX = touch.clientX;
    startY = touch.clientY;
    state.dragging = false;
    hasMoved = false;
  }, { passive: false });

  document.addEventListener("touchmove", (e: TouchEvent) => {
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

  document.addEventListener("touchend", (e: TouchEvent) => {
    if (isDragging) {
      if (state.dragging) {
        state.dragging = false;
        panel.classList.remove("amc-float-dragging");
        collapseIfTouchingEdge();
      }
      isDragging = false;
    }
  });

  // Double click to toggle collapse
  handle.addEventListener("dblclick", (e: MouseEvent) => {
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

  // Initialize position after layout
  requestAnimationFrame(initPosition);
}
