import { promises as fs } from "node:fs";
import path from "node:path";
import { inputPathFor } from "./paths";

export async function readInput(
  year: number,
  day: number,
  overridePath?: string,
): Promise<string> {
  const resolved = overridePath ? path.resolve(overridePath) : inputPathFor(year, day);
  try {
    return await fs.readFile(resolved, "utf8");
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") {
      throw new Error(
        `Input file not found at ${resolved}. Run ` +
          "`npm run new:day -- <day>` to scaffold files or create it manually.",
      );
    }
    throw error;
  }
}
