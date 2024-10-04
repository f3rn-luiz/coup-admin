import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
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
	imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class GamePage implements OnDestroy {
	private _unsubscribeAll: Subject<any> = new Subject<any>();
	texto_rodape = '';

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

	constructor(private _gameService: GameService) {
		this.texto_rodape = _gameService.texto_rodape;
		_gameService._jogadores.pipe(takeUntil(this._unsubscribeAll)).subscribe({ next: (j) => (this.jogadores = j) });
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
		if (this.jogadores) {
			let forStop = false;
			for (this.vez; !forStop; ) {
				document.getElementById(`vez-${this.vez}`)?.classList.remove('vez-player');

				if (this.vez + 1 < this.jogadores.length) {
					this.vez++;
					if (this.jogadores[this.vez].vida > 0) {
						document.getElementById(`vez-${this.vez}`)?.classList.add('vez-player');
						forStop = true;
					}
				} else {
					this.vez = 0;
					if (this.jogadores[this.vez].vida > 0) {
						document.getElementById(`vez-${this.vez}`)?.classList.add('vez-player');
						forStop = true;
					}
				}
			}
			this._gameService.registrarTurno();
			this.isAcao = false;
		}
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
