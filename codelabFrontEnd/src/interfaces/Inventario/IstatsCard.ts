type IconType = "box" | "up" | "down";


export interface IstatCard {
    label : string,
    value : string | number,
    valueColor : string,
    icon : IconType,
}