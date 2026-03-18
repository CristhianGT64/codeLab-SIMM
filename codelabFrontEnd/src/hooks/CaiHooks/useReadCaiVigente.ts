import { useQuery } from "@tanstack/react-query"
import { getCAIVigente } from "../../services/CaiService"


export const useReadCaiVigente = () => {
    useQuery({
        queryKey:['caiVigente'],
        queryFn: getCAIVigente
    })
}