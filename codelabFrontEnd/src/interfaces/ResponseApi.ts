export interface ContestType {
  name: string;
  url: string;
}

export interface ContestTypeResponse {
  count: number;
  results: ContestType[];
}
