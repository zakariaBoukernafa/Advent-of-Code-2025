import { Solution } from "../../../lib/types";
import DisjointSet from "./disjointSet";
import EdgeHeap, { compareEdges } from "./edgeHeap";
import { Edge, Parsed, Position } from "./types";

const CONNECTIONS = 1000;

const parse = (input: string): Parsed => {
  const positions = input
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const [x, y, z] = line.split(",").map(Number);
      return { x, y, z };
    });

  return { positions };
};

const squaredDistance = (a: Position, b: Position): number => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return dx * dx + dy * dy + dz * dz;
};

const selectClosestEdges = (positions: Position[], limit: number): Edge[] => {
  const heap = new EdgeHeap(limit);

  for (let a = 0; a < positions.length; a += 1) {
    for (let b = a + 1; b < positions.length; b += 1) {
      const distance = squaredDistance(positions[a], positions[b]);
      heap.add({ a, b, distance });
    }
  }

  return heap.toArray().sort(compareEdges);
};

const generateAllEdges = (positions: Position[]): Edge[] => {
  const edges: Edge[] = [];

  for (let a = 0; a < positions.length; a += 1) {
    for (let b = a + 1; b < positions.length; b += 1) {
      edges.push({ a, b, distance: squaredDistance(positions[a], positions[b]) });
    }
  }

  edges.sort(compareEdges);
  return edges;
};

const productOfLargestCircuits = (positions: Position[], edges: Edge[]): string => {
  const dsu = new DisjointSet(positions.length);
  for (const edge of edges) {
    dsu.union(edge.a, edge.b);
  }

  const largest = dsu
    .componentSizes()
    .sort((a, b) => b - a)
    .slice(0, 3);

  while (largest.length < 3) largest.push(1);

  const result = largest.reduce((product, size) => product * BigInt(size), 1n);
  return result.toString();
};

const findLastConnection = (positions: Position[], edges: Edge[]): Edge => {
  const dsu = new DisjointSet(positions.length);
  let components = positions.length;

  for (const edge of edges) {
    if (dsu.find(edge.a) === dsu.find(edge.b)) continue;
    dsu.union(edge.a, edge.b);
    components -= 1;

    if (components === 1) return edge;
  }

  return edges[edges.length - 1];
};

const solution: Solution<Parsed> = {
  parse,
  part1: ({ positions }) => {
    const edges = selectClosestEdges(positions, CONNECTIONS);
    return productOfLargestCircuits(positions, edges);
  },
  part2: ({ positions }) => {
    const edges = generateAllEdges(positions);
    const last = findLastConnection(positions, edges);
    const product = BigInt(positions[last.a].x) * BigInt(positions[last.b].x);
    return product.toString();
  },
};

export default solution;
