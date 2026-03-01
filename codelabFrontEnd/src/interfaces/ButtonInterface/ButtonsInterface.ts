export default interface PropsButtons{
    text : string;
    typeButton : "button" | "submit" | "reset"; 
    className : string;
    onClick : () => void;
}

export interface ButtonsInterface {
    text : string;
    typeButton : "button" | "submit" | "reset"; 
    className : string;
    icon : string;
    onClick : () => void;
    disabled : boolean;
}