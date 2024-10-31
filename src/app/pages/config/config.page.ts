import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonContent, IonFooter, IonHeader, IonIcon, IonRippleEffect, IonToolbar } from '@ionic/angular/standalone';
import { Subject, takeUntil } from 'rxjs';
import { GameService } from 'src/app/core/game.service';

@Component({
	selector: 'app-config',
	templateUrl: 'config.page.html',
	standalone: true,
	imports: [IonFooter, IonIcon, IonRippleEffect, IonContent, IonToolbar, IonHeader, CommonModule, ReactiveFormsModule],
})
export class ConfigPage implements OnInit, OnDestroy {
	private _unsubscribeAll: Subject<any> = new Subject<any>();

	configuracaoForm!: UntypedFormGroup;

	constructor(
		private _formBuilder: UntypedFormBuilder,
		private _route: Router,
		private _gameService: GameService,
		private _alertController: AlertController,
	) {}

	ngOnInit(): void {
		this.configuracaoForm = this._formBuilder.group({
			numero_jogadores: [0, [Validators.min(2)]],
			numero_vidas: [0, [Validators.min(1)]],
			dinheiro_inicial: [0, [Validators.min(0)]],
			custo_golpe_estado: [0, [Validators.min(0)]],
			golpe_estado_obrigatorio: [0, [Validators.min(0)]],
		});

		this._gameService._numero_jogadores.pipe(takeUntil(this._unsubscribeAll)).subscribe({ next: (v) => this.configuracaoForm.get('numero_jogadores')?.setValue(v) });
		this._gameService._numero_vidas.pipe(takeUntil(this._unsubscribeAll)).subscribe({ next: (v) => this.configuracaoForm.get('numero_vidas')?.setValue(v) });
		this._gameService._dinheiro_inicial.pipe(takeUntil(this._unsubscribeAll)).subscribe({ next: (v) => this.configuracaoForm.get('dinheiro_inicial')?.setValue(v) });
		this._gameService._custo_golpe_estado.pipe(takeUntil(this._unsubscribeAll)).subscribe({ next: (v) => this.configuracaoForm.get('custo_golpe_estado')?.setValue(v) });
		this._gameService._golpe_estado_obrigatorio.pipe(takeUntil(this._unsubscribeAll)).subscribe({ next: (v) => this.configuracaoForm.get('golpe_estado_obrigatorio')?.setValue(v) });
	}

	ngOnDestroy(): void {
		this._unsubscribeAll.next(null);
		this._unsubscribeAll.complete();
	}

	aumentarValor(campo: string) {
		this.configuracaoForm.get(campo)?.setValue(this.configuracaoForm.get(campo)?.value + 1);
	}

	diminuirValor(campo: string) {
		if (this.configuracaoForm.get(campo)?.value - 1 >= 0 && this.verificarValorMinimo(campo)) this.configuracaoForm.get(campo)?.setValue(this.configuracaoForm.get(campo)?.value - 1);
	}

	verificarValorMinimo(campo: string) {
		if (campo === 'numero_jogadores' && this.configuracaoForm.get(campo)?.value - 1 < 2) return false;
		else if (campo === 'numero_vidas' && this.configuracaoForm.get(campo)?.value - 1 < 1) return false;
		else return true;
	}

	voltarHome = () => this._route.navigateByUrl('');

	resetarConfiguracao = () => this._gameService.resetarConfiguracao();

	async mostrarAlerta() {
		const alerta = await this._alertController.create({
			header: 'Configure Corretamente!',
			subHeader: 'A configuração da partida não está correta. Revise os itens e tente novamente.',
			buttons: ['OK'],
		});
		alerta.present();
	}

	enviarConfiguracao() {
		if (this.configuracaoForm.valid) {
			this._gameService._numero_jogadores.next(this.configuracaoForm.get('numero_jogadores')?.value);
			this._gameService._numero_vidas.next(this.configuracaoForm.get('numero_vidas')?.value);
			this._gameService._dinheiro_inicial.next(this.configuracaoForm.get('dinheiro_inicial')?.value);
			this._gameService._custo_golpe_estado.next(this.configuracaoForm.get('custo_golpe_estado')?.value);
			this._gameService._golpe_estado_obrigatorio.next(this.configuracaoForm.get('golpe_estado_obrigatorio')?.value);
			this._route.navigateByUrl('players');
		} else this.mostrarAlerta();
	}
}
