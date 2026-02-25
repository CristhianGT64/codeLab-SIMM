import { useQuery } from '@tanstack/react-query';
import { fetchData } from '../services/pokeApiService';

const useFetchData = () => 
   useQuery({
    queryKey: ['data'],
    queryFn: fetchData,
  });
;

export default useFetchData;