type IconType = "box" | "up" | "down" | "alert";


export interface IstatCard {
    label : string,
    value : string | number,
    valueColor : string,
    icon : IconType,
}
