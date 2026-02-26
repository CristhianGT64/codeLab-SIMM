export interface ModulesNavBarInterface {
    text: string;
    icon: string;
    url : string;
}

export default interface NavBarInterface {
    nameBuild: string;
    modules: ModulesNavBarInterface[];
    nameUser : string;
}