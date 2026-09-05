export const BLOCK_CONFIG = {
  lifehack: { title: "Лайфхаки", default: true },
  code_review: { title: "Код-ревью", default: true },
  extra: { title: "Дополнительно", default: false },
} as const;

export type BlockType = keyof typeof BLOCK_CONFIG;
