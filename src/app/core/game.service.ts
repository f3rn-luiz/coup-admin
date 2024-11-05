import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Afetar, Jogador } from './game.type';

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
	_jogadores: BehaviorSubject<Jogador[] | null> = new BehaviorSubject<Jogador[] | null>([]);

	// EM JOGO
	_vez: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
	_turno: BehaviorSubject<number> = new BehaviorSubject(0);
	_rodada: BehaviorSubject<number> = new BehaviorSubject(1);
	_historico_geral: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

	constructor() {}

	registrarAcao(tipo: string, qtd: number, ganhou: boolean, afetar?: Afetar) {
		// tipo = vida / dinheiro / seguir || roubar / assassinar / golpe
		let vez = this._vez.getValue();
		let jogadores = this._jogadores.getValue();

		if (vez !== null && jogadores) {
			let mensagem = '';

			if (tipo === 'seguir') mensagem = `${jogadores[vez].nome} usou uma carta`;
			else if (tipo === 'vida') {
				jogadores[vez].vida = jogadores[vez].vida - qtd;
				mensagem = `${jogadores[vez].nome} perdeu ${qtd} vida${qtd > 1 ? 's' : ''}`;
			} else if (tipo === 'dinheiro') {
				if (ganhou) jogadores[vez].dinheiro = jogadores[vez].dinheiro + qtd;
				else jogadores[vez].dinheiro = jogadores[vez].dinheiro - qtd <= 0 ? 0 : jogadores[vez].dinheiro - qtd;
				mensagem = `${jogadores[vez].nome} ${ganhou ? 'recebeu' : 'perdeu'} $${qtd}`;
			} else if (tipo === 'afetar' && afetar && afetar.alvo !== null) {
				if (afetar.tipo === 'golpe') {
					jogadores[vez].dinheiro -= this._custo_golpe_estado.value;
					jogadores[afetar.alvo].vida -= qtd;
					mensagem = `${jogadores[vez].nome} deu um Golpe de Estado em ${jogadores[afetar.alvo].nome}\n(${jogadores[vez].nome}: -$${this._custo_golpe_estado.value} | ${jogadores[afetar.alvo].nome}: -${qtd}♥)`;
				}
			}
			this._historico_geral.next([mensagem, ...this._historico_geral.getValue()]);
		}

		this._jogadores.next(jogadores);
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
