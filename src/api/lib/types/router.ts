import { Handler } from "./netlify";

export interface Routes {
    [key: string]: Handler;
}