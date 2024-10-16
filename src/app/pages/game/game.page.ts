import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonicModule, ModalController } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { GameService } from 'src/app/core/game.service';
import { Jogador } from 'src/app/core/game.type';
import { GameActionsPage } from './actions/game-actions.page';
import { GameHistoryPage } from './history/game-history.page';

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
	fim_jogo: boolean = false;
	historico: string[] = [];

	custo_golpe_estado: number = 0;
	golpe_estado_obrigatorio: number = 0;

	constructor(
		private _gameService: GameService,
		private _modalController: ModalController,
		private _alertController: AlertController,
		private _router: Router,
	) {
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

	async mostrarHistorico() {
		const modal = await this._modalController.create({
			component: GameHistoryPage,
		});
		modal.present();
	}

	async mostrarAcoes(jogador: number | null) {
		const modal = await this._modalController.create({
			component: GameActionsPage,
		});
		modal.present();
		const { data } = await modal.onWillDismiss();
		if (data.tipo !== 'sair') {
			if (data.tipo === 'turno') this.registrarTurno();
			else this.registrarAcao(data.tipo, data.valor, data.ganhou, jogador);
			this.verificarVivos();
		}
	}

	async mostrarOpcoes() {
		const alert = await this._alertController.create({
			mode: 'ios',
			header: 'OPÇÕES',
			buttons: [
				{ text: 'Reiniciar partida', role: 'reiniciar' },
				{ text: 'Ir para a tela inicial', role: 'inicio' },
				{ text: 'Fechar', role: 'cancel' },
			],
		});
		alert.present();
		const option = await alert.onWillDismiss();
		if (option.role !== 'cancel' && option.role !== 'backdrop') {
			if (option.role === 'reiniciar') this._gameService.resetarPartida();
			else if (option.role === 'inicio') this._router.navigateByUrl('');
		}
	}

	async mostrarGanhador() {
		const alert = await this._alertController.create({
			mode: 'ios',
			header: 'Fim de Jogo!',
			message: `${this.jogadores ? this.jogadores[this.vez].nome : '-'} ganhou!`,
			buttons: [
				{ text: 'Reiniciar partida', role: 'reiniciar' },
				{ text: 'Ir para a tela inicial', role: 'inicio' },
				{ text: 'Fechar', role: 'cancel' },
			],
		});
		alert.present();
		const option = await alert.onWillDismiss();
		if (option.role !== 'cancel' && option.role !== 'backdrop') {
			if (option.role === 'reiniciar') {
				this._gameService.resetarPartida();
				this.fim_jogo = false;
			} else if (option.role === 'inicio') this._router.navigateByUrl('');
		}
	}

	verificarVivos() {
		let vivos = 0;
		if (this.jogadores)
			this.jogadores.forEach((j) => {
				if (j.vida > 0) vivos++;
			});
		if (vivos === 1) {
			this.fim_jogo = true;
			this.mostrarGanhador();
		}
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
		}
	}

	registrarAcao(acao: string, qtd: number, ganhou: boolean, click: number | null) {
		this._gameService.registrarAcao(acao === 'vida' ? 0 : 1, qtd, ganhou, click ?? this.vez);
		if (click === null) this.registrarTurno();
	}
}
