import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon } from '@ionic/angular/standalone';
import { Subject, takeUntil } from 'rxjs';
import { GameService } from 'src/app/core/game.service';
import { Jogador } from 'src/app/core/game.type';

@Component({
	selector: 'app-game',
	templateUrl: 'game.page.html',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [IonIcon, IonHeader, IonToolbar, IonTitle, IonContent, CommonModule, ReactiveFormsModule],
})
export class GamePage implements OnDestroy {
	private _unsubscribeAll: Subject<any> = new Subject<any>();

	jogadores: Jogador[] | null = [];

	turno: number = 0;
	rodada: number = 1;

	constructor(
		private _changeDetectorsRef: ChangeDetectorRef,
		private _router: Router,
		private _gameService: GameService,
	) {
		_gameService._jogadores.pipe(takeUntil(this._unsubscribeAll)).subscribe({
			next: (j) => {
				this.jogadores = j;
				_changeDetectorsRef.markForCheck();
			},
		});
	}

	ngOnDestroy(): void {
		this._unsubscribeAll.next(null);
		this._unsubscribeAll.complete();
	}
	backButton() {
		this._router.navigateByUrl('config');
	}

	randomizarPosicoes() {
		if (this.jogadores) {
			const pre_jogads: Jogador[] | null = this.jogadores.sort(() => Math.random() - 0.5);
			this._gameService._jogadores.next(pre_jogads);
		}
	}
}
