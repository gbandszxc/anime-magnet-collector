import { selectionStore } from "./SelectionStore";
import { openModal } from "./Modal";

export function injectToolbar(): void {
  const toolbar = document.createElement("div");
  toolbar.id = "amc-float";
  toolbar.innerHTML = `
    <div class="amc-float-handle" title="收起/展开">
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

interface Position {
  x: number;
  y: number;
}

function initFloatPanel(panel: HTMLElement): void {
  const handle = panel.querySelector(".amc-float-handle") as HTMLElement;

  const state: {
    dragging: boolean;
    offset: Position;
    snapped: "left" | "right" | null;
  } = {
    dragging: false,
    offset: { x: 0, y: 0 },
    snapped: null,
  };

  const edgeMargin = 16;
  const moveThreshold = 5; // 移动超过5px才算拖动

  function getDefaultPosition(): Position {
    return { x: edgeMargin, y: edgeMargin };
  }

  function initPosition(): void {
    const pos = getDefaultPosition();
    panel.style.left = `${pos.x}px`;
    panel.style.top = `${pos.y}px`;
    panel.style.right = "auto";
    state.snapped = "left";
  }

  function snapToEdge(mouseX: number): void {
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

  function toggleCollapse(): void {
    const isCollapsed = panel.classList.contains("amc-float-collapsed");

    if (isCollapsed) {
      panel.classList.remove("amc-float-collapsed");
      handle.title = "收起/展开";
      if (state.snapped === "left") {
        panel.style.left = `${edgeMargin}px`;
        panel.style.right = "auto";
      } else {
        panel.style.left = "auto";
        panel.style.right = `${edgeMargin}px`;
      }
    } else {
      panel.classList.add("amc-float-collapsed");
      handle.title = "展开";
      if (state.snapped === "left") {
        panel.style.left = `${edgeMargin}px`;
        panel.style.right = "auto";
      } else {
        panel.style.left = "auto";
        panel.style.right = `${edgeMargin}px`;
      }
    }
  }

  // 鼠标按下
  let dragStartPos: Position | null = null;

  handle.addEventListener("mousedown", (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest(".amc-float-btn")) return;
    e.preventDefault();
    dragStartPos = { x: e.clientX, y: e.clientY };
    state.dragging = false;
  });

  document.addEventListener("mousemove", (e: MouseEvent) => {
    if (!dragStartPos) return;

    const dx = e.clientX - dragStartPos.x;
    const dy = e.clientY - dragStartPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > moveThreshold) {
      // 开始拖动
      state.dragging = true;
      const rect = panel.getBoundingClientRect();
      state.offset.x = e.clientX - rect.left;
      state.offset.y = e.clientY - rect.top;
      panel.classList.add("amc-float-dragging");
      dragStartPos = null;
    }

    if (state.dragging) {
      panel.style.left = `${e.clientX - state.offset.x}px`;
      panel.style.top = `${e.clientY - state.offset.y}px`;
      panel.style.right = "auto";
      state.snapped = null;
    }
  });

  document.addEventListener("mouseup", (e: MouseEvent) => {
    if (state.dragging) {
      state.dragging = false;
      panel.classList.remove("amc-float-dragging");
      snapToEdge(e.clientX);
    } else if (dragStartPos) {
      // 点击事件
      toggleCollapse();
    }
    dragStartPos = null;
  });

  // Touch support
  handle.addEventListener("touchstart", (e: TouchEvent) => {
    if ((e.target as HTMLElement).closest(".amc-float-btn")) return;
    e.preventDefault();
    const touch = e.touches[0];
    dragStartPos = { x: touch.clientX, y: touch.clientY };
    state.dragging = false;
  }, { passive: false });

  document.addEventListener("touchmove", (e: TouchEvent) => {
    if (!dragStartPos) return;
    const touch = e.touches[0];

    const dx = touch.clientX - dragStartPos.x;
    const dy = touch.clientY - dragStartPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > moveThreshold) {
      state.dragging = true;
      const rect = panel.getBoundingClientRect();
      state.offset.x = touch.clientX - rect.left;
      state.offset.y = touch.clientY - rect.top;
      panel.classList.add("amc-float-dragging");
      dragStartPos = null;
    }

    if (state.dragging) {
      panel.style.left = `${touch.clientX - state.offset.x}px`;
      panel.style.top = `${touch.clientY - state.offset.y}px`;
      panel.style.right = "auto";
      state.snapped = null;
    }
  });

  document.addEventListener("touchend", (e: TouchEvent) => {
    if (state.dragging) {
      state.dragging = false;
      panel.classList.remove("amc-float-dragging");
      const touch = e.changedTouches[0];
      snapToEdge(touch.clientX);
    } else if (dragStartPos) {
      toggleCollapse();
    }
    dragStartPos = null;
  });

  // 双击手柄也可折叠
  handle.addEventListener("dblclick", (e: MouseEvent) => {
    e.preventDefault();
    toggleCollapse();
  });

  function onResize(): void {
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
