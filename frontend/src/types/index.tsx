export type Participant = string;

export type Block = {
  type: string;
  description: string | null;
  participants: Participant[];
};

export type Meeting = {
  date: string;
  time: string;
  blocks: Block[];
};

export type Employee = {
  id: number;
  full_name: string;
};

export type Option = { value: string; label: string };
