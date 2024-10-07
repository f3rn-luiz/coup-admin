import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { GameService } from 'src/app/core/game.service';

@Component({
	selector: 'app-game-history',
	templateUrl: 'game-actions.page.html',
	standalone: true,
	imports: [IonicModule, CommonModule, ReactiveFormsModule],
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

	sairAcoes(tipo: string, valor: number | null, ganhou: boolean | null) {
		this._modalController.dismiss({ tipo, valor, ganhou });
	}
}
