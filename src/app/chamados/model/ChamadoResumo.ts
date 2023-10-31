export interface ChamadoResumo {
    _id: string;
    dataCriacao: Date;
    status: string;
    Cliente: {
        _id: string;
        nome: string;
        documentos: string;
    }
}