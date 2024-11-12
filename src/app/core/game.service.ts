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
				mensagem = `${jogadores[vez].nome} perdeu ${qtd} vida${qtd > 1 ? 's' : ''}`;
				this.carmaAcao({ id: vez, vida: qtd, dinheiro: 0 }, null);
			} else if (tipo === 'dinheiro') {
				mensagem = `${jogadores[vez].nome} ${ganhou ? 'recebeu' : 'perdeu'} $${qtd}`;
				this.carmaAcao({ id: vez, vida: 0, dinheiro: ganhou ? qtd : -qtd }, null);
			} else if (tipo === 'afetar' && afetar && afetar.alvo !== null) {
				// Ação - Ajuda
				if (afetar.tipo === 'ajuda') {
					if (afetar.reacao === 'bloqueado') mensagem = `${jogadores[vez].nome} tentou pegar Ajuda Externa mas foi Bloqueado por ${jogadores[afetar.alvo].nome}`;
					else if (afetar.reacao === 'bloqueio falho') {
						mensagem = `${jogadores[vez].nome} pegou Ajuda Externa depois de um Bloqueio Falho de ${jogadores[afetar.alvo].nome}\n(${jogadores[vez].nome}: +$${qtd} | ${jogadores[afetar.alvo].nome}: -1♡)`;
						this.carmaAcao({ id: vez, vida: 0, dinheiro: qtd }, { id: afetar.alvo, vida: 1, dinheiro: 0 });
					} else if (afetar.reacao === 'bloqueio provado') {
						mensagem = `${jogadores[vez].nome} tentou pegar Ajuda Externa mas teve um Bloqueio Provado de ${jogadores[afetar.alvo].nome}\n(${jogadores[vez].nome}: -1♡)`;
						this.carmaAcao({ id: vez, vida: 1, dinheiro: 0 }, null);
					} else {
						mensagem = `${jogadores[vez].nome} pegou Ajuda Externa\n(${jogadores[vez].nome}: +$${qtd})`;
						this.carmaAcao({ id: vez, vida: 0, dinheiro: qtd }, null);
					}
				}
				// Ação - Assassinar
				else if (afetar.tipo === 'assassinar') {
					if (afetar.reacao === 'bloqueado') {
						mensagem = `${jogadores[vez].nome} tentou Assassinar ${jogadores[afetar.alvo].nome} mas foi Bloqueado\n(${jogadores[vez].nome}: -$3)`;
						this.carmaAcao({ id: vez, vida: 0, dinheiro: -3 }, null);
					} else if (afetar.reacao === 'bloqueio falho') {
						mensagem = `${jogadores[vez].nome} Assassinou ${jogadores[afetar.alvo].nome} depois de um Bloqueio Falho\n(${jogadores[vez].nome}: -$3 | ${jogadores[afetar.alvo].nome}: -2♡)`;
						this.carmaAcao({ id: vez, vida: 0, dinheiro: -3 }, { id: afetar.alvo, vida: 2, dinheiro: 0 });
					} else if (afetar.reacao === 'bloqueio provado') {
						mensagem = `${jogadores[vez].nome} tentou Assassinar ${jogadores[afetar.alvo].nome} que Provou seu Bloqueio\n(${jogadores[vez].nome}: -1♡ -$3)`;
						this.carmaAcao({ id: vez, vida: 1, dinheiro: -3 }, null);
					} else if (afetar.reacao === 'duvida falha') {
						mensagem = `${jogadores[vez].nome} tentou Assassinar ${jogadores[afetar.alvo].nome} mas Falhou na Dúvida\n(${jogadores[vez].nome}: -1♡ -$3)`;
						this.carmaAcao({ id: vez, vida: 1, dinheiro: -3 }, null);
					} else if (afetar.reacao === 'duvida provada') {
						mensagem = `${jogadores[vez].nome} Assassinou ${jogadores[afetar.alvo].nome} depois de uma Dúvida Provada\n(${jogadores[vez].nome}: -$3 | ${jogadores[afetar.alvo].nome}: -2♡)`;
						this.carmaAcao({ id: vez, vida: 0, dinheiro: -3 }, { id: afetar.alvo, vida: 2, dinheiro: 0 });
					} else {
						mensagem = `${jogadores[vez].nome} Roubou ${jogadores[afetar.alvo].nome}\n(${jogadores[vez].nome}: -$3 | ${jogadores[afetar.alvo].nome}: -1♡)`;
						this.carmaAcao({ id: vez, vida: 0, dinheiro: -3 }, { id: afetar.alvo, vida: 1, dinheiro: 0 });
					}
				}
				// Ação - Golpe
				else if (afetar.tipo === 'golpe') {
					mensagem = `${jogadores[vez].nome} deu um Golpe de Estado em ${jogadores[afetar.alvo].nome}\n(${jogadores[vez].nome}: -$${this._custo_golpe_estado.value} | ${jogadores[afetar.alvo].nome}: -${qtd}♡)`;
					this.carmaAcao({ id: vez, vida: 0, dinheiro: -this._custo_golpe_estado.value }, { id: afetar.alvo, vida: qtd, dinheiro: 0 });
				}
				// Ação - Outro
				else if (afetar.tipo === 'outro') {
					if (afetar.reacao === 'duvida falha') {
						mensagem = `${jogadores[vez].nome} tentou usar um Efeito em ${jogadores[afetar.alvo].nome} mas Falhou na Dúvida\n(${jogadores[vez].nome}: -1♡)`;
						this.carmaAcao({ id: vez, vida: 1, dinheiro: 0 }, null);
					} else if (afetar.reacao === 'duvida provada') {
						mensagem = `${jogadores[vez].nome} usou um Efeito em ${jogadores[afetar.alvo].nome} depois de uma Dúvida Provada\n(${jogadores[afetar.alvo].nome}: -1♡)`;
						this.carmaAcao({ id: vez, vida: 0, dinheiro: 0 }, { id: afetar.alvo, vida: 1, dinheiro: 0 });
					} else mensagem = `${jogadores[vez].nome} usou um Efeito em ${jogadores[afetar.alvo].nome}`;
				}
				// Ação - Roubar
				else if (afetar.tipo === 'roubar') {
					if (afetar.reacao === 'bloqueado') mensagem = `${jogadores[vez].nome} tentou Roubar ${jogadores[afetar.alvo].nome} mas foi Bloqueado\n(ninguém foi afetado)`;
					else if (afetar.reacao === 'bloqueio falho') {
						mensagem = `${jogadores[vez].nome} Roubou ${jogadores[afetar.alvo].nome} depois de um Bloqueio Falho\n(${jogadores[afetar.alvo].nome}: -1♡ -$${jogadores[afetar.alvo].dinheiro >= qtd ? qtd : jogadores[afetar.alvo].dinheiro} | ${jogadores[vez].nome}: +$${jogadores[afetar.alvo].dinheiro >= qtd ? qtd : jogadores[afetar.alvo].dinheiro})`;
						this.carmaAcao({ id: vez, vida: 0, dinheiro: jogadores[afetar.alvo].dinheiro >= qtd ? qtd : jogadores[afetar.alvo].dinheiro }, { id: afetar.alvo, vida: 1, dinheiro: qtd });
					} else if (afetar.reacao === 'bloqueio provado') {
						mensagem = `${jogadores[vez].nome} tentou Roubar ${jogadores[afetar.alvo].nome} que Provou seu Bloqueio\n(${jogadores[vez].nome}: -1♡)`;
						this.carmaAcao({ id: vez, vida: 1, dinheiro: 0 }, null);
					} else if (afetar.reacao === 'duvida falha') {
						mensagem = `${jogadores[vez].nome} tentou Roubar ${jogadores[afetar.alvo].nome} mas Falhou na Dúvida\n(${jogadores[vez].nome}: -1♡)`;
						this.carmaAcao({ id: vez, vida: 1, dinheiro: 0 }, null);
					} else if (afetar.reacao === 'duvida provada') {
						mensagem = `${jogadores[vez].nome} Roubou ${jogadores[afetar.alvo].nome} depois de uma Dúvida Provada\n(${jogadores[afetar.alvo].nome}: -1♡ -$${jogadores[afetar.alvo].dinheiro >= qtd ? qtd : jogadores[afetar.alvo].dinheiro} | ${jogadores[vez].nome}: +$${jogadores[afetar.alvo].dinheiro >= qtd ? qtd : jogadores[afetar.alvo].dinheiro})`;
						this.carmaAcao({ id: vez, vida: 0, dinheiro: jogadores[afetar.alvo].dinheiro >= qtd ? qtd : jogadores[afetar.alvo].dinheiro }, { id: afetar.alvo, vida: 1, dinheiro: qtd });
					} else {
						mensagem = `${jogadores[vez].nome} Roubou ${jogadores[afetar.alvo].nome}\n(${jogadores[afetar.alvo].nome}: -$${jogadores[afetar.alvo].dinheiro >= qtd ? qtd : jogadores[afetar.alvo].dinheiro} | ${jogadores[vez].nome}: +$${jogadores[afetar.alvo].dinheiro >= qtd ? qtd : jogadores[afetar.alvo].dinheiro})`;
						this.carmaAcao({ id: vez, vida: 0, dinheiro: jogadores[afetar.alvo].dinheiro >= qtd ? qtd : jogadores[afetar.alvo].dinheiro }, { id: afetar.alvo, vida: 0, dinheiro: qtd });
					}
				}
				// Ação - Taxar
				else if (afetar.tipo === 'taxar') {
					if (afetar.reacao === 'duvida falha') {
						mensagem = `${jogadores[vez].nome} tentou pegar Taxa mas Falhou na Dúvida de ${jogadores[afetar.alvo].nome}\n(${jogadores[vez].nome}: -1♡)`;
						this.carmaAcao({ id: vez, vida: 1, dinheiro: 0 }, null);
					} else if (afetar.reacao === 'duvida provada') {
						mensagem = `${jogadores[vez].nome} pegou Taxa depois de uma Dúvida Provada de ${jogadores[afetar.alvo].nome}\n(${jogadores[vez].nome}: +$${qtd} | ${jogadores[afetar.alvo].nome}: -1♡)`;
						this.carmaAcao({ id: vez, vida: 0, dinheiro: qtd }, { id: afetar.alvo, vida: 1, dinheiro: 0 });
					} else {
						mensagem = `${jogadores[vez].nome} pegou Taxa\n(${jogadores[vez].nome}: +$${qtd})`;
						this.carmaAcao({ id: vez, vida: 0, dinheiro: qtd }, null);
					}
				}
			}
			this._historico_geral.next([mensagem, ...this._historico_geral.getValue()]);
		}
		this._jogadores.next(jogadores);
	}

	carmaAcao(atacante: { id: number; vida: number; dinheiro: number }, alvo: null | { id: number; vida: number; dinheiro: number }) {
		let jogadores = this._jogadores.value;
		if (jogadores) {
			// assossiar resultado da ação ao atacante
			jogadores[atacante.id].vida = jogadores[atacante.id].vida - atacante.vida <= 0 ? 0 : jogadores[atacante.id].vida - atacante.vida;
			jogadores[atacante.id].dinheiro = jogadores[atacante.id].dinheiro + atacante.dinheiro <= 0 ? 0 : jogadores[atacante.id].dinheiro + atacante.dinheiro;
			// assossiar resultado da ação ao alvo (se houver)
			if (alvo !== null) {
				jogadores[alvo.id].vida = jogadores[alvo.id].vida - alvo.vida <= 0 ? 0 : jogadores[alvo.id].vida - alvo.vida;
				jogadores[alvo.id].dinheiro = jogadores[alvo.id].dinheiro - alvo.dinheiro <= 0 ? 0 : jogadores[alvo.id].dinheiro - alvo.dinheiro;
			}
			// confirmar os resultados
			this._jogadores.next(jogadores);
		}
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
