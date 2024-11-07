import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonContent, IonFooter, IonHeader, IonIcon, IonRippleEffect, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { Subject, takeUntil } from 'rxjs';
import { GameService } from 'src/app/core/game.service';
import { Afetar, Jogador, VoltarJogada } from 'src/app/core/game.type';
import { GameActionsPage } from './actions/game-actions.page';
import { GameHistoryPage } from './history/game-history.page';

@Component({
	selector: 'app-game',
	templateUrl: 'game.page.html',
	standalone: true,
	imports: [IonHeader, IonToolbar, IonContent, IonIcon, IonFooter, IonRippleEffect, CommonModule, ReactiveFormsModule],
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

	pre_voltar_jogada: null | VoltarJogada = null;
	voltar_jogada: null | VoltarJogada = null;

	custo_golpe_estado: number = 0;
	golpe_estado_obrigatorio: number = 0;

	constructor(
		private _gameService: GameService,
		private _modalController: ModalController,
		private _alertController: AlertController,
		private _router: Router,
	) {
		this.texto_rodape = _gameService.texto_rodape;
		_gameService._jogadores.pipe(takeUntil(this._unsubscribeAll)).subscribe({
			next: (j) => {
				this.jogadores = j;
				if (!j || j.length === 0) _router.navigateByUrl('');
			},
		});
		_gameService._turno.pipe(takeUntil(this._unsubscribeAll)).subscribe({ next: (t) => (this.turno = t) });
		_gameService._rodada.pipe(takeUntil(this._unsubscribeAll)).subscribe({ next: (r) => (this.rodada = r) });
		_gameService._historico_geral.pipe(takeUntil(this._unsubscribeAll)).subscribe({ next: (h) => (this.historico = h) });
		_gameService._golpe_estado_obrigatorio.pipe(takeUntil(this._unsubscribeAll)).subscribe({ next: (g) => (this.golpe_estado_obrigatorio = g) });
		_gameService._custo_golpe_estado.pipe(takeUntil(this._unsubscribeAll)).subscribe({ next: (g) => (this.custo_golpe_estado = g) });
	}

	ngOnDestroy(): void {
		this.resetarPartida();
		this._unsubscribeAll.next(null);
		this._unsubscribeAll.complete();
	}

	async mostrarHistorico() {
		const modal = await this._modalController.create({
			component: GameHistoryPage,
		});
		modal.present();
	}

	async mostrarAcoes() {
		if (!this.pre_voltar_jogada || this.pre_voltar_jogada.turno !== this.turno) this.pre_voltar_jogada = { jogadores: JSON.parse(JSON.stringify(this.jogadores)), historico: this.historico, vez: this.vez, turno: this.turno, rodada: this.rodada };
		this._gameService._vez.next(this.vez);
		const modal = await this._modalController.create({
			component: GameActionsPage,
		});
		modal.present();
		const { data } = await modal.onWillDismiss();
		if (data.tipo !== 'sair') {
			this.voltar_jogada = this.pre_voltar_jogada;
			if (data.afetar) this.registrarAcao(data.tipo, data.valor, data.ganhou, data.afetar);
			else this.registrarAcao(data.tipo, data.valor, data.ganhou);
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
			if (option.role === 'reiniciar') this.resetarPartida();
			else if (option.role === 'inicio') {
				this.resetarPartida();
				this._router.navigateByUrl('');
			}
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
				this.resetarPartida();
			} else if (option.role === 'inicio') {
				this.resetarPartida();
				this._router.navigateByUrl('');
			}
		}
	}

	verificarVivos() {
		if (this._gameService.contarVivos() === 1) {
			this.fim_jogo = true;
			this.mostrarGanhador();
		}
	}

	async voltarJogada() {
		const alert = await this._alertController.create({
			mode: 'ios',
			header: 'Tem certeza que deseja voltar a jogada?',
			subHeader: 'Esse recurso só pode ser usado uma vez por ação e não será possível voltar atrás',
			buttons: [
				{ text: 'OK', role: 'ok' },
				{ text: 'Cancelar', role: 'cancel' },
			],
		});
		alert.present();
		const option = await alert.onWillDismiss();

		if (option.role == 'ok' && this.voltar_jogada) {
			this._gameService._jogadores.next(this.voltar_jogada.jogadores);
			this._gameService._historico_geral.next(this.voltar_jogada.historico);
			this._gameService._turno.next(this.voltar_jogada.turno);
			this._gameService._rodada.next(this.voltar_jogada.rodada);
			this.vez = this.voltar_jogada.vez;

			this.pre_voltar_jogada = null;
			this.voltar_jogada = null;
		}
	}

	registrarTurno() {
		if (this.jogadores) {
			const ant_vez = this.vez;
			let forStop = false;
			for (this.vez; !forStop; ) {
				if (this.vez + 1 < this.jogadores.length) {
					this.vez++;
					if (this.jogadores[this.vez].vida > 0) forStop = true;
				} else {
					this.vez = 0;
					if (this.jogadores[this.vez].vida > 0) forStop = true;
				}
			}
			this._gameService.registrarTurno(ant_vez, this.vez);
		}
	}

	registrarAcao(acao: string, qtd: number, ganhou: boolean, afetar?: Afetar) {
		this._gameService.registrarAcao(acao, qtd, ganhou, afetar);
		this.registrarTurno();
	}

	resetarPartida() {
		this._gameService.resetarPartida();
		this.fim_jogo = false;
		this.vez = 0;
		this.pre_voltar_jogada = null;
		this.voltar_jogada = null;
	}
}
