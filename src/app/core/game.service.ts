import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Jogador } from './game.type';

@Injectable({ providedIn: 'root' })
export class GameService {
	// FASE 1 - Básico da Partida
	_numero_jogadores: BehaviorSubject<number> = new BehaviorSubject(2);
	_numero_vidas: BehaviorSubject<number> = new BehaviorSubject(2);
	_dinheiro_inicial: BehaviorSubject<number> = new BehaviorSubject(0);
	_custo_golpe_estado: BehaviorSubject<number> = new BehaviorSubject(7);
	_golpe_estado_obrigatorio: BehaviorSubject<number> = new BehaviorSubject(10);

	// FASE 2 - Jogadores e Posições
	_jogadores: BehaviorSubject<Jogador[] | null> = new BehaviorSubject<Jogador[] | null>(null);

	// EM JOGO
	_turno: BehaviorSubject<number> = new BehaviorSubject(0);
	_rodada: BehaviorSubject<number> = new BehaviorSubject(1);
	_historico_geral: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(['']);

	constructor() {}

	registrarAcao(tipo: number, qtd: number, ganhou: boolean, jogador: number) {
		// 0 - Vida / 1 - Dinheiro
		let mensagem = '';
		let jogs = this._jogadores.getValue();
		if (jogs && tipo === 0) mensagem = `${jogs[jogador].nome} PERDEU ${qtd} vida${qtd > 1 ? 's' : ''}`;
		else if (jogs && tipo === 1) mensagem = `${jogs[jogador].nome} ${ganhou ? 'RECEBEU' : 'PERDEU'} $${qtd}`;
		this._historico_geral.next([...this._historico_geral.getValue(), mensagem]);

		// AÇÕES
		if (jogs && tipo === 0) {
			if (jogs[jogador].vida - qtd !== 0) jogs[jogador].vida = jogs[jogador].vida - qtd;
			else {
				jogs.splice(jogador, 1);
				this._numero_jogadores.next(jogs.length);
			}
		} else if (jogs && tipo === 1) {
			if (ganhou) jogs[jogador].dinheiro = jogs[jogador].dinheiro + qtd;
			else if (jogs[jogador].dinheiro - qtd <= 0) jogs[jogador].dinheiro = 0;
			else jogs[jogador].dinheiro = jogs[jogador].dinheiro - qtd;
		}

		this._jogadores.next(jogs);

		console.log('JOGS: ', jogs);

		console.log('HISTÓRICO: ', this._historico_geral.getValue());
	}

	registrarTurno() {
		const turn = this._turno.getValue();
		const roda = this._rodada.getValue();
		const joga = this._numero_jogadores.getValue();
		if ((turn + 1) / roda === joga) this._rodada.next(roda + 1);
		this._turno.next(turn + 1);
	}
}
