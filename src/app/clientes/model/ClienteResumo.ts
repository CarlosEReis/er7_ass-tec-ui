export interface ClienteResumo {
    _id: string;
    nome: string;
    documento: string;
    tipoPessoa: string;
    Endereco: {
        localidade: number;
    }
}

export interface PageClienteResumo {
    content: ClienteResumo[];
    size: number;
    page: number;
    last: boolean;
}