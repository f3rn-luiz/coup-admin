import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { GameService } from 'src/app/core/game.service';

@Component({
	selector: 'app-game-history',
	templateUrl: 'game-history.page.html',
	standalone: true,
	imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class GameHistoryPage implements OnDestroy {
	private _unsubscribeAll: Subject<any> = new Subject<any>();

	historico: string[] = [''];

	constructor(private _gameService: GameService) {
		this._gameService._historico_geral.pipe(takeUntil(this._unsubscribeAll)).subscribe({ next: (h) => (this.historico = h) });
	}

	ngOnDestroy(): void {
		this._unsubscribeAll.next(null);
		this._unsubscribeAll.complete();
	}
}
