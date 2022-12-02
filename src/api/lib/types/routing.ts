import { Handler } from "./netlify";

export interface SubRoutes {
    [key: string]: Handler;
}