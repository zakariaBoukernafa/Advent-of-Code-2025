import { Solution } from "../../../lib/types";
import { BatteryBank, Parsed } from "./types";



const parse = (input: string): Parsed =>
  input
    .trim()
    .split(/\r?\n/)
    .filter((line) => line.length > 0)
    .map((line) => line.split("").map((digit) => Number(digit)))

const solution: Solution<Parsed> = {
  parse,
  part1: (banks) => {
    const bestJoltage = (bank: BatteryBank): number => {
      const suffixMax: BatteryBank = Array(bank.length);
      for (let i = bank.length - 1, best = 0; i >= 0; i--) {
        best = Math.max(best, bank[i]);
        suffixMax[i] = best;
      }

      let bestPair = 0
      for (let i = 0; i < bank.length - 1; i++) {
        const second = suffixMax[i + 1];
        bestPair = Math.max(bestPair, bank[i] * 10 + second);
      }
      return bestPair;
    }
    return banks.reduce((sum, bank) => sum + bestJoltage(bank), 0);

  },
  part2: (banks) => {
    const pickMaxSubsequence = (bank: BatteryBank, target: number): BatteryBank => {
      if (target > bank.length) throw new Error(`Bank shorter than target: needed ${target}, got ${bank.length}`);
      let toDrop = bank.length - target;
      const stack: number[] = [];
      for (const digit of bank) {
        while (stack.length && toDrop > 0 && stack[stack.length - 1] < digit) {
          stack.pop();
          toDrop--;
        }
        stack.push(digit);
      }
      return stack.slice(0, target);
    };

    const toBigInt = (digits: BatteryBank) => BigInt(digits.join(""));

    const TARGET = 12;
    const total = banks.reduce<bigint>((sum, bank) => {
      const digits = pickMaxSubsequence(bank, TARGET);
      return sum + toBigInt(digits);
    }, 0n);

    return total.toString();
  },
};

export default solution;
