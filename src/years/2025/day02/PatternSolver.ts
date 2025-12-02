import { RangeSet } from "./RangeSet";

export class PatternSolver {
    private ranges: RangeSet;

    constructor(ranges: RangeSet) {
        this.ranges = ranges;
    }

    private digitCount(value: number): number {
        return Math.floor(Math.log10(value)) + 1;
    }

    public sumDoubleRepeats(): number {
        const maxEnd = this.ranges.getMaxEnd();
        if (maxEnd === 0) return 0;

        const maxDigits = this.digitCount(maxEnd);
        const maxPatternDigits = Math.floor(maxDigits / 2);
        const pow10: number[] = Array.from({ length: maxDigits + 1 }, (_, i) => 10 ** i);

        let totalSum = 0;

        for (let patternDigits = 1; patternDigits <= maxPatternDigits; patternDigits++) {
            const minPattern = pow10[patternDigits - 1];
            const maxPattern = pow10[patternDigits] - 1;
            const multiplier = pow10[patternDigits] + 1;

            for (let pattern = minPattern; pattern <= maxPattern; pattern++) {
                const value = pattern * multiplier;
                if (value > maxEnd) break;
                if (this.ranges.contains(value)) totalSum += value;
            }
        }

        return totalSum;
    }

    public sumAnyRepeats(): number {
        const maxEnd = this.ranges.getMaxEnd();
        if (maxEnd === 0) return 0;

        const maxDigits = this.digitCount(maxEnd);
        const maxPatternDigits = Math.floor(maxDigits / 2);
        const pow10: number[] = Array.from({ length: maxDigits + 1 }, (_, i) => 10 ** i);

        const seenValues = new Set<number>();
        let totalSum = 0;

        for (let patternDigits = 1; patternDigits <= maxPatternDigits; patternDigits++) {
            const minPattern = pow10[patternDigits - 1];
            const maxPattern = pow10[patternDigits] - 1;
            const maxRepeats = Math.floor(maxDigits / patternDigits);

            for (let repeatCount = 2; repeatCount <= maxRepeats; repeatCount++) {
                const totalDigits = patternDigits * repeatCount;
                if (totalDigits > maxDigits) break;

                const multiplier =
                    (pow10[totalDigits] - 1) / (pow10[patternDigits] - 1);

                for (let pattern = minPattern; pattern <= maxPattern; pattern++) {
                    const value = pattern * multiplier;
                    if (value > maxEnd) break;
                    if (!this.ranges.contains(value)) continue;
                    if (seenValues.has(value)) continue;
                    seenValues.add(value);
                    totalSum += value;
                }
            }
        }

        return totalSum;
    }
}
