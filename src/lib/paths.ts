import path from "node:path";

export const padDay = (day: number): string => day.toString().padStart(2, "0");

export const inputPathFor = (year: number, day: number): string =>
  path.resolve("inputs", String(year), `day${padDay(day)}.txt`);

export const solutionPathFor = (year: number, day: number): string =>
  path.resolve("src", "years", String(year), `day${padDay(day)}`, "index.ts");
