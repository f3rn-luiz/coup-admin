import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonContent, IonFooter, IonHeader, IonIcon, IonRippleEffect, IonToolbar } from '@ionic/angular/standalone';
import { Subject, takeUntil } from 'rxjs';
import { GameService } from 'src/app/core/game.service';
import { Jogador } from 'src/app/core/game.type';

@Component({
	selector: 'app-players',
	templateUrl: 'players.page.html',
	standalone: true,
	imports: [IonFooter, IonIcon, IonRippleEffect, IonContent, IonToolbar, IonHeader, CommonModule, ReactiveFormsModule],
})
export class PlayersPage implements OnInit, OnDestroy {
	private _unsubscribeAll: Subject<any> = new Subject<any>();

	jogadoresForm!: UntypedFormGroup;
	form_iniciado: boolean = false;

	numero_jogadores: number = 0;
	numero_vidas: number = 0;
	dinheiro_inicial: number = 0;

	constructor(
		private _router: Router,
		private _gameService: GameService,
		private _formBuilder: UntypedFormBuilder,
		private _alertController: AlertController,
	) {
		_gameService._numero_jogadores.pipe(takeUntil(this._unsubscribeAll)).subscribe({
			next: (v) => {
				this.form_iniciado = false;
				this.numero_jogadores = v;
				this.iniciarFormGroup();
			},
		});
		_gameService._numero_vidas.pipe(takeUntil(this._unsubscribeAll)).subscribe({ next: (v) => (this.numero_vidas = v) });
		_gameService._dinheiro_inicial.pipe(takeUntil(this._unsubscribeAll)).subscribe({ next: (v) => (this.dinheiro_inicial = v) });
	}

	ngOnInit(): void {
		this.iniciarFormGroup();
	}

	ngOnDestroy(): void {
		this._unsubscribeAll.next(null);
		this._unsubscribeAll.complete();
	}

	iniciarFormGroup() {
		this.jogadoresForm = this._formBuilder.group({});
		for (let i = 0; i < this.numero_jogadores; i++) this.jogadoresForm.addControl(`nome_jog_${i}`, this._formBuilder.control(''));
		this.form_iniciado = true;
	}

	voltarConfig = () => this._router.navigateByUrl('config');

	quantidadeJogadores() {
		return new Array(this.numero_jogadores);
	}

	embaralharJogadores() {
		if (this.jogadoresForm.value) {
			let pre_jog: string[] = [];
			for (let i = 0; i < this.numero_jogadores; i++) pre_jog.push(this.jogadoresForm.get(`nome_jog_${i}`)?.value);
			pre_jog = pre_jog.sort(() => Math.random() - 0.5);
			for (let i = 0; i < this.numero_jogadores; i++) this.jogadoresForm.get(`nome_jog_${i}`)?.setValue(pre_jog[i]);
		}
	}

	async mostrarAlerta() {
		const alert = await this._alertController.create({
			mode: 'ios',
			header: 'Campos em branco!',
			subHeader: 'Preencha todos os campos corretamente!',
			buttons: ['OK'],
		});
		alert.present();
	}

	conferirJogadores(): boolean {
		let tudo_ok = true;
		for (let i = 0; i < this.numero_jogadores; i++) {
			if (this.jogadoresForm.get(`nome_jog_${i}`)?.value.trim() === '') {
				tudo_ok = false;
				break;
			}
		}
		return tudo_ok;
	}

	confirmarJogadores() {
		if (this.conferirJogadores()) {
			let jogadores: Jogador[] = [];
			for (let i = 0; i < this.numero_jogadores; i++) jogadores.push({ nome: this.jogadoresForm.get(`nome_jog_${i}`)?.value.trim(), vida: this.numero_vidas, dinheiro: this.dinheiro_inicial });
			this._gameService._jogadores.next(jogadores);
			this._gameService.resetarPartida();
			this._router.navigateByUrl('game');
		} else this.mostrarAlerta();
	}
}
