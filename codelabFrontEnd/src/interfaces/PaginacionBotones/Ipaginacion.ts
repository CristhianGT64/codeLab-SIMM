export interface IpaginacionProps {
    inicio : number,
    fin : number,
    registros : readonly unknown[],
    paginaActual : number,
    totalPaginas : number,
    action : (p : number) => void;
    
}
