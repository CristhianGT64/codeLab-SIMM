export interface ModulesNavBarInterface {
    text: string;
    icon: string;
    url : string;
    disable : boolean
}

export default interface NavBarInterface {
    nameBuild: string;
    modules: ModulesNavBarInterface[];
    nameUser : string;
}