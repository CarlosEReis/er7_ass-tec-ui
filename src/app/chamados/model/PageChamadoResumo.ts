import { ChamadoResumo } from "./ChamadoResumo";

export interface PageChamadoResumo {
    content: ChamadoResumo[];
    size: number;
    page: number;
    last: boolean;
}