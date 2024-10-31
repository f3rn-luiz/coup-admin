import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Jogador } from './game.type';

@Injectable({ providedIn: 'root' })
export class GameService {
	public texto_rodape = 'By: Luiz F Souza - v1.4.0';

	// FASE 1 - Básico da Partida
	_numero_jogadores: BehaviorSubject<number> = new BehaviorSubject(2);
	_numero_vidas: BehaviorSubject<number> = new BehaviorSubject(2);
	_dinheiro_inicial: BehaviorSubject<number> = new BehaviorSubject(0);
	_custo_golpe_estado: BehaviorSubject<number> = new BehaviorSubject(7);
	_golpe_estado_obrigatorio: BehaviorSubject<number> = new BehaviorSubject(10);

	// FASE 2 - Jogadores e Posições
	_jogadores: BehaviorSubject<Jogador[] | null> = new BehaviorSubject<Jogador[] | null>([
		// { nome: 'Luiz', vida: 0, dinheiro: 7 },
		// { nome: 'Bia', vida: 1, dinheiro: 5 },
		// { nome: 'Xande', vida: 0, dinheiro: 3 },
		// { nome: 'Tiago', vida: 0, dinheiro: 9 },
		// { nome: 'Iago', vida: 2, dinheiro: 10 },
		// { nome: 'Otavio', vida: 0, dinheiro: 4 },
		// { nome: 'Gu', vida: 2, dinheiro: 4 },
		// { nome: 'Matheus', vida: 2, dinheiro: 3 },
		// { nome: 'Bianca', vida: 0, dinheiro: 10 },
		// { nome: 'Daniel', vida: 0, dinheiro: 6 },
	]);

	// EM JOGO
	_turno: BehaviorSubject<number> = new BehaviorSubject(0);
	_rodada: BehaviorSubject<number> = new BehaviorSubject(1);
	_historico_geral: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([
		// 'Gu RECEBEU $2',
		// 'Daniel RECEBEU $2',
		// 'Daniel RECEBEU $2',
		// 'Daniel RECEBEU $2',
		// 'Daniel RECEBEU $2',
		// 'Daniel RECEBEU $2',
		// 'Daniel RECEBEU $2',
		// 'Daniel RECEBEU $2',
		// 'Daniel RECEBEU $2',
		// 'Daniel RECEBEU $2',
		// 'Daniel RECEBEU $2',
		// 'Daniel RECEBEU $2',
		// 'Daniel RECEBEU $2',
		// 'Daniel RECEBEU $2',
		// 'Matheus RECEBEU $1',
		// 'Gu RECEBEU $2',
		// 'Otavio PERDEU 1 vida',
		// 'Iago RECEBEU $5',
		// 'Tiago RECEBEU $3',
		// 'Xande RECEBEU $3',
		// 'Xande PERDEU $2',
		// 'Bia RECEBEU $2',
		// 'Luiz PERDEU 1 vida',
		// 'Daniel RECEBEU $2',
		// 'Bianca PERDEU 1 vida',
		// 'Matheus RECEBEU $1',
		// 'Gu RECEBEU $2',
		// 'Iago RECEBEU $3',
		// 'Tiago RECEBEU $2',
		// 'Bianca RECEBEU $10',
		// 'Xande PERDEU 1 vida',
		// 'Bia RECEBEU $3',
		// 'Luiz PERDEU 1 vida',
		// 'Daniel PERDEU 1 vida',
		// 'Bianca PERDEU 1 vida',
		// 'Otavio PERDEU 1 vida',
		// 'Iago RECEBEU $2',
		// 'Tiago PERDEU 1 vida',
		// 'Xande PERDEU 1 vida',
		// 'Bia PERDEU 1 vida',
		// 'Luiz PERDEU 1 vida',
	]);

	constructor() {}

	registrarAcao(tipo: number, qtd: number, ganhou: boolean, jogador: number) {
		// 0 - Vida / 1 - Dinheiro
		let mensagem = '';
		let jogs = this._jogadores.getValue();
		if (jogs && tipo === 0) mensagem = `${jogs[jogador].nome} PERDEU ${qtd} vida${qtd > 1 ? 's' : ''}`;
		else if (jogs && tipo === 1) mensagem = `${jogs[jogador].nome} ${ganhou ? 'RECEBEU' : 'PERDEU'} $${qtd}`;
		this._historico_geral.next([mensagem, ...this._historico_geral.getValue()]);

		// AÇÕES
		if (jogs && tipo === 0) {
			jogs[jogador].vida = jogs[jogador].vida - qtd;
		} else if (jogs && tipo === 1) {
			if (ganhou) jogs[jogador].dinheiro = jogs[jogador].dinheiro + qtd;
			else if (jogs[jogador].dinheiro - qtd <= 0) jogs[jogador].dinheiro = 0;
			else jogs[jogador].dinheiro = jogs[jogador].dinheiro - qtd;
		}

		this._jogadores.next(jogs);
	}

	registrarTurno(ant: number, pro: number) {
		const turn = this._turno.getValue();
		const roda = this._rodada.getValue();
		if (ant > pro) this._rodada.next(roda + 1);
		this._turno.next(turn + 1);
	}

	contarVivos(): number {
		let vivos = 0;
		if (this._jogadores.value)
			this._jogadores.value.forEach((j) => {
				if (j.vida > 0) vivos++;
			});
		return vivos;
	}

	resetarConfiguracao() {
		this._numero_jogadores.next(2);
		this._numero_vidas.next(2);
		this._dinheiro_inicial.next(0);
		this._custo_golpe_estado.next(7);
		this._golpe_estado_obrigatorio.next(10);
		this._jogadores.next(null);
	}

	resetarPartida() {
		this._rodada.next(1);
		this._turno.next(0);
		this._historico_geral.next([]);
		this._jogadores.value?.map((j) => {
			j.dinheiro = this._dinheiro_inicial.value;
			j.vida = this._numero_vidas.value;
		});
	}

	resetarTUDO() {
		this.resetarConfiguracao();
		this.resetarPartida();
	}
}
