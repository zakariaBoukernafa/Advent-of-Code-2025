import { Edge } from "./types";

export const compareEdges = (a: Edge, b: Edge): number =>
  a.distance - b.distance || a.a - b.a || a.b - b.b;

class EdgeHeap {
  private heap: Edge[] = [];

  constructor(private readonly limit: number) {}

  add(edge: Edge): void {
    if (this.heap.length < this.limit) {
      this.heap.push(edge);
      this.siftUp(this.heap.length - 1);
      return;
    }

    if (compareEdges(edge, this.heap[0]) < 0) {
      this.heap[0] = edge;
      this.siftDown(0);
    }
  }

  toArray(): Edge[] {
    return [...this.heap];
  }

  private siftUp(index: number): void {
    let current = index;
    while (current > 0) {
      const parent = (current - 1) >> 1;
      if (compareEdges(this.heap[current], this.heap[parent]) <= 0) break;
      [this.heap[current], this.heap[parent]] = [this.heap[parent], this.heap[current]];
      current = parent;
    }
  }

  private siftDown(index: number): void {
    let current = index;
    const { length } = this.heap;

    while (true) {
      const left = 2 * current + 1;
      const right = left + 1;
      let largest = current;

      if (left < length && compareEdges(this.heap[left], this.heap[largest]) > 0) {
        largest = left;
      }
      if (right < length && compareEdges(this.heap[right], this.heap[largest]) > 0) {
        largest = right;
      }
      if (largest === current) break;

      [this.heap[current], this.heap[largest]] = [this.heap[largest], this.heap[current]];
      current = largest;
    }
  }
}

export default EdgeHeap;
