class DisjointSet {
  private parents: number[];
  private sizes: number[];

  constructor(size: number) {
    this.parents = Array.from({ length: size }, (_, index) => index);
    this.sizes = Array<number>(size).fill(1);
  }

  find(node: number): number {
    let root = node;
    while (this.parents[root] !== root) {
      root = this.parents[root];
    }

    while (this.parents[node] !== node) {
      const next = this.parents[node];
      this.parents[node] = root;
      node = next;
    }

    return root;
  }

  union(a: number, b: number): void {
    const rootA = this.find(a);
    const rootB = this.find(b);
    if (rootA === rootB) return;

    if (this.sizes[rootA] < this.sizes[rootB]) {
      this.parents[rootA] = rootB;
      this.sizes[rootB] += this.sizes[rootA];
    } else {
      this.parents[rootB] = rootA;
      this.sizes[rootA] += this.sizes[rootB];
    }
  }

  componentSizes(): number[] {
    const result: number[] = [];
    for (let node = 0; node < this.parents.length; node += 1) {
      if (this.parents[node] === node) {
        result.push(this.sizes[node]);
      }
    }
    return result;
  }
}

export default DisjointSet;
