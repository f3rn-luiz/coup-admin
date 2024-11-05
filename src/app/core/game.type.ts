export interface Jogador {
	nome: string;
	vida: number;
	dinheiro: number;
}

export interface Afetar {
	tipo: string | null;
	alvo: null | number;
	vida: null | boolean;
	qtd: null | number;
}
