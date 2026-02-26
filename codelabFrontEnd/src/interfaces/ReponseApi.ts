export default interface ContestType {
  name: string;
  url: string;
}

export default interface ContestTypeResponse {
      count: number;
      results: ContestType[];
}