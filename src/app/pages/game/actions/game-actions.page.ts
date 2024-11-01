import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonFooter, IonHeader, IonIcon, IonRippleEffect, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { Subject, takeUntil } from 'rxjs';
import { GameService } from 'src/app/core/game.service';

@Component({
	selector: 'app-game-history',
	templateUrl: 'game-actions.page.html',
	standalone: true,
	imports: [IonRippleEffect, IonFooter, IonIcon, IonContent, IonToolbar, IonHeader, CommonModule, ReactiveFormsModule],
})
export class GameActionsPage implements OnDestroy {
	private _unsubscribeAll: Subject<any> = new Subject<any>();

	custo_golpe_estado: number = 0;
	acao: number | null = null;

	constructor(
		private _gameService: GameService,
		private _modalController: ModalController,
	) {
		_gameService._custo_golpe_estado.pipe(takeUntil(this._unsubscribeAll)).subscribe({ next: (c) => (this.custo_golpe_estado = c) });
	}

	ngOnDestroy(): void {
		this._unsubscribeAll.next(null);
		this._unsubscribeAll.complete();
	}

	sairAcoes(tipo: string, valor: number, ganhou: boolean) {
		this._modalController.dismiss({ tipo, valor, ganhou });
	}
}
