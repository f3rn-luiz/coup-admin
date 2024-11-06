export interface Jogador {
	nome: string;
	vida: number;
	dinheiro: number;
}

export interface Afetar {
	tipo: null | string;
	reacao: null | ReacaoAfetar;
	alvo: null | number;
	vida: null | boolean;
	qtd: null | number;
}

export type ReacaoAfetar = 'bloqueado' | 'bloqueio falho' | 'bloqueio provado' | 'duvida falha' | 'duvida provada' | 'ok';

export interface VoltarJogada {
	jogadores: Jogador[] | null;
	historico: string[];
	vez: number;
	turno: number;
	rodada: number;
}
