import { useQuery } from "@tanstack/react-query"
import { ObtenerCaiVigente } from "../../services/CaiService"


const useReadCaiVigente = () => 
    useQuery({
        queryKey:['caiVigente'],
        queryFn: ObtenerCaiVigente
    })

export default useReadCaiVigente;