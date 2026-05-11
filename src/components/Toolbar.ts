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
    snapped: "left" as "left" | "right" | null,
  };

  const edgeMargin = 16;

  function getDefaultPosition() {
    return { x: edgeMargin, y: edgeMargin };
  }

  function initPosition() {
    const pos = getDefaultPosition();
    panel.style.left = `${pos.x}px`;
    panel.style.top = `${pos.y}px`;
    panel.style.right = "auto";
    state.snapped = "left";
  }

  function snapToEdge(mouseX: number) {
    const viewportWidth = window.innerWidth;

    if (mouseX < viewportWidth / 2) {
      panel.style.left = `${edgeMargin}px`;
      panel.style.right = "auto";
      state.snapped = "left";
    } else {
      panel.style.left = "auto";
      panel.style.right = `${edgeMargin}px`;
      state.snapped = "right";
    }
  }

  function toggleCollapse() {
    const isCollapsed = panel.classList.contains("amc-float-collapsed");

    if (isCollapsed) {
      panel.classList.remove("amc-float-collapsed");
      handle.title = "拖动或点击折叠";
    } else {
      panel.classList.add("amc-float-collapsed");
      handle.title = "点击展开";
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
      panel.classList.add("amc-float-dragging");
      // 计算初始偏移
      const rect = panel.getBoundingClientRect();
      state.dragOffsetX = e.clientX - rect.left;
      state.dragOffsetY = e.clientY - rect.top;
    }

    if (state.dragging) {
      panel.style.left = `${e.clientX - state.dragOffsetX}px`;
      panel.style.top = `${e.clientY - state.dragOffsetY}px`;
      panel.style.right = "auto";
      state.snapped = null;
    }
  };

  const onMouseUp = (e: MouseEvent) => {
    if (isDragging) {
      if (state.dragging) {
        state.dragging = false;
        panel.classList.remove("amc-float-dragging");
        snapToEdge(e.clientX);
      }
      isDragging = false;
      hasMoved = false;
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
      panel.classList.add("amc-float-dragging");
      const rect = panel.getBoundingClientRect();
      state.dragOffsetX = touch.clientX - rect.left;
      state.dragOffsetY = touch.clientY - rect.top;
    }

    if (state.dragging) {
      panel.style.left = `${touch.clientX - state.dragOffsetX}px`;
      panel.style.top = `${touch.clientY - state.dragOffsetY}px`;
      panel.style.right = "auto";
      state.snapped = null;
    }
  }, { passive: false });

  document.addEventListener("touchend", (e: TouchEvent) => {
    if (isDragging) {
      if (state.dragging) {
        state.dragging = false;
        panel.classList.remove("amc-float-dragging");
        const touch = e.changedTouches[0];
        snapToEdge(touch.clientX);
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
    if (state.snapped === "left") {
      panel.style.left = `${edgeMargin}px`;
      panel.style.right = "auto";
    } else if (state.snapped === "right") {
      panel.style.left = "auto";
      panel.style.right = `${edgeMargin}px`;
    }
  }

  window.addEventListener("resize", onResize);

  // Initialize position after layout
  requestAnimationFrame(initPosition);
}
