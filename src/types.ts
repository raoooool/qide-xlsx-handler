export type Rule = {
  id: string;
  name: string;
  rules: [string, string, string][];
  createdTime: string;
  modifiedTime?: string;
};

export type DataRule = {
  [key: string]: string;
  startRow: string;
};
