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
	_rodada: BehaviorSubject<number> = new BehaviorSubject(1);
	_turno: BehaviorSubject<number> = new BehaviorSubject(0);
	_historico_geral: BehaviorSubject<string[] | null> = new BehaviorSubject<string[] | null>(null);

	constructor() {}

	registrarAcao(tipo: number) {}
}
