export interface IpaginacionProps {
    inicio : number,
    fin : number,
    registros : any[],
    paginaActual : number,
    totalPaginas : number,
    action : (p : number) => void;
    
}