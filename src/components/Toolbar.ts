import { selectionStore } from "./SelectionStore";
import { openModal } from "./Modal";

export function injectToolbar(): void {
  const toolbar = document.createElement("div");
  toolbar.id = "amc-float";
  toolbar.innerHTML = `
    <div class="amc-float-handle">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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

  const snapDistance = 10;
  const edgeMargin = 16;

  function getDefaultPosition(): Position {
    return { x: window.innerWidth - panel.offsetWidth - edgeMargin, y: window.innerHeight / 2 - panel.offsetHeight / 2 };
  }

  function initPosition(): void {
    const pos = getDefaultPosition();
    panel.style.left = `${pos.x}px`;
    panel.style.top = `${pos.y}px`;
    panel.style.right = "auto";
    state.snapped = "right";
  }

  function snapToEdge(mouseX: number): void {
    const panelRect = panel.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    if (mouseX < viewportWidth / 2) {
      // Snap left
      panel.style.left = `${edgeMargin}px`;
      panel.style.right = "auto";
      state.snapped = "left";
    } else {
      // Snap right
      panel.style.left = "auto";
      panel.style.right = `${edgeMargin}px`;
      state.snapped = "right";
    }
  }

  function onMouseDown(e: MouseEvent): void {
    if ((e.target as HTMLElement).closest(".amc-float-btn")) return;
    e.preventDefault();
    state.dragging = true;
    const rect = panel.getBoundingClientRect();
    state.offset.x = e.clientX - rect.left;
    state.offset.y = e.clientY - rect.top;
    panel.classList.add("amc-float-dragging");
  }

  function onMouseMove(e: MouseEvent): void {
    if (!state.dragging) return;
    const x = e.clientX - state.offset.x;
    const y = e.clientY - state.offset.y;
    panel.style.left = `${x}px`;
    panel.style.top = `${y}px`;
    panel.style.right = "auto";
    state.snapped = null;
  }

  function onMouseUp(e: MouseEvent): void {
    if (!state.dragging) return;
    state.dragging = false;
    panel.classList.remove("amc-float-dragging");
    snapToEdge(e.clientX);
  }

  function onResize(): void {
    if (state.snapped === "left") {
      panel.style.left = `${edgeMargin}px`;
      panel.style.right = "auto";
    } else if (state.snapped === "right") {
      panel.style.left = "auto";
      panel.style.right = `${edgeMargin}px`;
    }
  }

  handle.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
  window.addEventListener("resize", onResize);

  // Touch support
  handle.addEventListener("touchstart", (e: TouchEvent) => {
    if ((e.target as HTMLElement).closest(".amc-float-btn")) return;
    e.preventDefault();
    const touch = e.touches[0];
    state.dragging = true;
    const rect = panel.getBoundingClientRect();
    state.offset.x = touch.clientX - rect.left;
    state.offset.y = touch.clientY - rect.top;
    panel.classList.add("amc-float-dragging");
  }, { passive: false });

  document.addEventListener("touchmove", (e: TouchEvent) => {
    if (!state.dragging) return;
    const touch = e.touches[0];
    panel.style.left = `${touch.clientX - state.offset.x}px`;
    panel.style.top = `${touch.clientY - state.offset.y}px`;
    panel.style.right = "auto";
    state.snapped = null;
  });

  document.addEventListener("touchend", (e: TouchEvent) => {
    if (!state.dragging) return;
    state.dragging = false;
    panel.classList.remove("amc-float-dragging");
    const touch = e.changedTouches[0];
    snapToEdge(touch.clientX);
  });

  // Initialize position after layout
  requestAnimationFrame(initPosition);
}
