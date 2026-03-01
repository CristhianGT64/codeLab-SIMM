import settings from "../lib/settings";
import type ContestTypeResponse from "../interfaces/ReponseApi";


export const fetchData = async (): Promise<ContestTypeResponse> => {
  const response = await fetch(`${settings.prueba}/contest-type`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};