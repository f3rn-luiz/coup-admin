import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon } from '@ionic/angular/standalone';
import { Subject, takeUntil } from 'rxjs';
import { GameService } from 'src/app/core/game.service';
import { Jogador } from 'src/app/core/game.type';

@Component({
	selector: 'app-game',
	templateUrl: 'game.page.html',
	styles: [
		`
			.vez-player {
				color: white !important;
			}
		`,
	],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [IonIcon, IonHeader, IonToolbar, IonTitle, IonContent, CommonModule, ReactiveFormsModule],
})
export class GamePage implements OnDestroy {
	private _unsubscribeAll: Subject<any> = new Subject<any>();

	jogadores: Jogador[] | null = [];

	vez: number = 0;
	turno: number = 0;
	rodada: number = 0;
	historico: string[] = [''];

	custo_golpe_estado: number = 0;
	golpe_estado_obrigatorio: number = 0;

	isHistorico: boolean = false;

	isAcao: boolean = false;
	acao: any = null;
	jogadorClick: number = -1;
	isClick: any = null;

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
		_gameService._turno.pipe(takeUntil(this._unsubscribeAll)).subscribe({ next: (t) => (this.turno = t) });
		_gameService._rodada.pipe(takeUntil(this._unsubscribeAll)).subscribe({ next: (r) => (this.rodada = r) });
		_gameService._historico_geral.pipe(takeUntil(this._unsubscribeAll)).subscribe({ next: (h) => (this.historico = h) });
		_gameService._golpe_estado_obrigatorio.pipe(takeUntil(this._unsubscribeAll)).subscribe({ next: (g) => (this.golpe_estado_obrigatorio = g) });
		_gameService._custo_golpe_estado.pipe(takeUntil(this._unsubscribeAll)).subscribe({ next: (g) => (this.custo_golpe_estado = g) });
	}

	ngOnDestroy(): void {
		this._unsubscribeAll.next(null);
		this._unsubscribeAll.complete();
	}

	ionViewDidEnter() {
		document.getElementById(`vez-0`)?.classList.add('vez-player');
	}

	registrarTurno() {
		if (this.jogadores && this.vez + 1 < this.jogadores.length) {
			document.getElementById(`vez-${this.vez}`)?.classList.remove('vez-player');
			this.vez++;
			document.getElementById(`vez-${this.vez}`)?.classList.add('vez-player');
		} else {
			document.getElementById(`vez-${this.vez}`)?.classList.remove('vez-player');
			this.vez = 0;
			document.getElementById(`vez-${this.vez}`)?.classList.add('vez-player');
		}
		this._gameService.registrarTurno();
	}

	registrarAcao(qtd: number, ganhou: boolean) {
		this._gameService.registrarAcao(this.acao, qtd, ganhou, this.jogadorClick);
		this.acao = null;
		this.isAcao = false;
		this.jogadorClick = -1;
		if (!this.isClick) this.registrarTurno();
		this.isClick = null;
	}
}
