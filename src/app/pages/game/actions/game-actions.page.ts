import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonFooter, IonHeader, IonIcon, IonRippleEffect, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { Subject, takeUntil } from 'rxjs';
import { GameService } from 'src/app/core/game.service';
import { Afetar, Jogador, ReacaoAfetar, TipoAfetar } from 'src/app/core/game.type';

@Component({
	selector: 'app-game-history',
	templateUrl: 'game-actions.page.html',
	standalone: true,
	imports: [IonRippleEffect, IonFooter, IonIcon, IonContent, IonToolbar, IonHeader, CommonModule, ReactiveFormsModule],
})
export class GameActionsPage implements OnDestroy {
	private _unsubscribeAll: Subject<any> = new Subject<any>();

	vez: number | null = null;
	jogadores: Jogador[] | null = null;
	custo_golpe_estado: number = 0;

	acao: number | null = null;
	isAfetar: Afetar = { tipo: null, reacao: null, alvo: null, vida: null, qtd: null };

	constructor(
		private _gameService: GameService,
		private _modalController: ModalController,
	) {
		_gameService._vez.pipe(takeUntil(this._unsubscribeAll)).subscribe({ next: (v) => (this.vez = v) });
		_gameService._jogadores.pipe(takeUntil(this._unsubscribeAll)).subscribe({ next: (j) => (this.jogadores = j) });
		_gameService._custo_golpe_estado.pipe(takeUntil(this._unsubscribeAll)).subscribe({ next: (c) => (this.custo_golpe_estado = c) });
	}

	ngOnDestroy(): void {
		this.isAfetar = { tipo: null, reacao: null, alvo: null, vida: null, qtd: null };
		this._unsubscribeAll.next(null);
		this._unsubscribeAll.complete();
	}

	sairAcoes(tipo: string, valor: number, ganhou: boolean, afetar?: Afetar) {
		this._modalController.dismiss({ tipo, valor, ganhou, afetar });
	}

	confirmarAfetar(tipo: TipoAfetar, vida: boolean, qtd: number) {
		this.isAfetar = { tipo: tipo, reacao: null, alvo: null, vida: vida, qtd: qtd };
		if (tipo === 'ajuda' || tipo === 'taxar') this.acao = 3;
		else this.acao = 2;
	}

	confirmarJogador(jogador: number) {
		this.isAfetar.alvo = jogador;
		if (this.isAfetar.tipo === 'golpe' || this.isAfetar.tipo === 'ajuda' || this.isAfetar.tipo === 'taxar') this.sairAcoes('afetar', this.isAfetar.qtd ?? 1, false, this.isAfetar);
		else this.acao = 3;
	}

	confirmarReacao(reacao: ReacaoAfetar) {
		if (reacao !== 'ok') this.isAfetar.reacao = reacao;
		if (reacao !== 'ok' && (this.isAfetar.tipo === 'ajuda' || this.isAfetar.tipo === 'taxar')) this.acao = 2;
		else {
			if (this.isAfetar.tipo === 'ajuda' || this.isAfetar.tipo === 'taxar') this.isAfetar.alvo = 0;
			this.sairAcoes('afetar', this.isAfetar.tipo === 'roubar' || this.isAfetar.tipo === 'ajuda' ? 2 : this.isAfetar.tipo === 'taxar' ? 3 : 1, this.isAfetar.tipo === 'roubar' ? true : false, this.isAfetar);
		}
	}

	voltar() {
		if (this.acao !== null) {
			if (this.acao <= 1) this.acao = null;
			else if (this.isAfetar.tipo === 'ajuda' || this.isAfetar.tipo === 'taxar') {
				if (this.acao === 2) this.acao = 3;
				else if (this.acao === 3) this.acao = 0;
			} else this.acao = this.acao - 1;
		} else this.sairAcoes('sair', 0, false);
	}
}
