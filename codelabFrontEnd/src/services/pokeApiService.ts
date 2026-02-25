import settings from "../lib/settings";

export interface ContestType {
  name: string;
  url: string;
}

export interface ContestTypeResponse {
  count: number;
  results: ContestType[];
}

export const fetchData = async (): Promise<ContestTypeResponse> => {
  const response = await fetch(`${settings.prueba}/contest-type`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};