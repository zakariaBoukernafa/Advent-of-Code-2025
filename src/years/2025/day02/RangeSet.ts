export type Range = { start: number; end: number };

export class RangeSet {
    private ranges: Range[];

    constructor(ranges: Range[]) {
        this.ranges = this.sortRanges(ranges);
    }

    private sortRanges(ranges: Range[]): Range[] {
        return [...ranges].sort((a, b) => a.start - b.start);
    }

    public getRanges(): Range[] {
        return this.ranges;
    }

    public getMaxEnd(): number {
        if (this.ranges.length === 0) return 0;
        return this.ranges[this.ranges.length - 1].end;
    }

    public contains(value: number): boolean {
        let low = 0;
        let high = this.ranges.length - 1;
        while (low <= high) {
            const mid = (low + high) >> 1;
            const range = this.ranges[mid];
            if (value < range.start) {
                high = mid - 1;
            } else if (value > range.end) {
                low = mid + 1;
            } else {
                return true;
            }
        }
        return false;
    }
}
