import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonFooter, IonHeader, IonIcon, IonRippleEffect, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { Subject, takeUntil } from 'rxjs';
import { GameService } from 'src/app/core/game.service';

@Component({
	selector: 'app-game-history',
	templateUrl: 'game-history.page.html',
	standalone: true,
	imports: [IonHeader, IonToolbar, IonContent, IonFooter, IonRippleEffect, IonIcon, CommonModule, ReactiveFormsModule],
})
export class GameHistoryPage implements OnDestroy {
	private _unsubscribeAll: Subject<any> = new Subject<any>();

	historico: string[] = [''];

	constructor(
		private _gameService: GameService,
		private _modalController: ModalController,
	) {
		this._gameService._historico_geral.pipe(takeUntil(this._unsubscribeAll)).subscribe({ next: (h) => (this.historico = h) });
	}

	ngOnDestroy(): void {
		this._unsubscribeAll.next(null);
		this._unsubscribeAll.complete();
	}

	sairHistorico() {
		this._modalController.dismiss();
	}
}
