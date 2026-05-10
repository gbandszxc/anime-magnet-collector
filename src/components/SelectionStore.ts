type SelectionChangeCallback = (count: number) => void;

class SelectionStore {
  private selected = new Set<number>();
  private listeners = new Set<SelectionChangeCallback>();

  toggle(index: number): void {
    if (this.selected.has(index)) {
      this.selected.delete(index);
    } else {
      this.selected.add(index);
    }
    this.notify();
  }

  selectAll(indexes: number[]): void {
    indexes.forEach(i => this.selected.add(i));
    this.notify();
  }

  deselectAll(): void {
    this.selected.clear();
    this.notify();
  }

  isSelected(index: number): boolean {
    return this.selected.has(index);
  }

  getSelected(): number[] {
    return Array.from(this.selected);
  }

  getCount(): number {
    return this.selected.size;
  }

  onChange(callback: SelectionChangeCallback): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notify(): void {
    this.listeners.forEach(cb => cb(this.getCount()));
  }
}

export const selectionStore = new SelectionStore();
