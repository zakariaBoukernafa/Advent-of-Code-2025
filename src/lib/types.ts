export type PartResult = string | number;


export interface Solution<TParsed = unknown> {
  parse?: (input: string) => TParsed | Promise<TParsed>;
  part1: (input: TParsed) => PartResult | Promise<PartResult>;
  part2: (input: TParsed) => PartResult | Promise<PartResult>;
}
