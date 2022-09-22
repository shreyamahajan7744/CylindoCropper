export type Frame =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | "13"
  | "14"
  | "15"
  | "16"
  | "17"
  | "18"
  | "19"
  | "20"
  | "21"
  | "22"
  | "23"
  | "24"
  | "25"
  | "26"
  | "27"
  | "28"
  | "29"
  | "30"
  | "31"
  | "32";

export interface ICropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ITemplate {
  id: string;
  frame?: Frame;
  cropArea?: ICropArea;
}

export interface ISize {
  width: number;
  height: number;
}
