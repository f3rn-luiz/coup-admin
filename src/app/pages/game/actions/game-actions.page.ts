import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonFooter, IonHeader, IonIcon, IonRippleEffect, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { Subject, takeUntil } from 'rxjs';
import { GameService } from 'src/app/core/game.service';
import { Afetar, Jogador } from 'src/app/core/game.type';

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
	isAfetar: Afetar = { tipo: null, alvo: null, vida: null, qtd: null };

	constructor(
		private _gameService: GameService,
		private _modalController: ModalController,
	) {
		_gameService._vez.pipe(takeUntil(this._unsubscribeAll)).subscribe({ next: (v) => (this.vez = v) });
		_gameService._jogadores.pipe(takeUntil(this._unsubscribeAll)).subscribe({ next: (j) => (this.jogadores = j) });
		_gameService._custo_golpe_estado.pipe(takeUntil(this._unsubscribeAll)).subscribe({ next: (c) => (this.custo_golpe_estado = c) });
	}

	ngOnDestroy(): void {
		this.isAfetar = { tipo: null, alvo: null, vida: null, qtd: null };
		this._unsubscribeAll.next(null);
		this._unsubscribeAll.complete();
	}

	sairAcoes(tipo: string, valor: number, ganhou: boolean, afetar?: Afetar) {
		this._modalController.dismiss({ tipo, valor, ganhou, afetar });
	}

	confirmarJogador(jogador: number) {
		this.isAfetar.alvo = jogador;

		if (this.isAfetar.tipo === 'golpe') this.sairAcoes('afetar', 1, false, this.isAfetar);
		else if (this.isAfetar.tipo === 'roubar' || this.isAfetar.tipo === 'assassinar') this.acao = 3;
	}
}
