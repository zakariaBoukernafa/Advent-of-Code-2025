export type Operation = "+" | "*";

export type Problem = {
  numbers: bigint[];
  op: Operation;
};

export type Block = {
  start: number;
  end: number;
  op: Operation;
};

export type Parsed = {
  blocks: Block[];
  numberRows: string[];
};
