import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon } from '@ionic/angular/standalone';
import { GameService } from 'src/app/core/game.service';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	standalone: true,
	imports: [IonIcon, IonHeader, IonToolbar, IonTitle, IonContent, ReactiveFormsModule],
})
export class HomePage implements OnInit {
	configuracaoForm!: UntypedFormGroup;

	fase_conf = 0;

	constructor(
		private _formBuilder: UntypedFormBuilder,
		private _gameService: GameService,
	) {}

	ngOnInit(): void {
		this.configuracaoForm = this._formBuilder.group({
			numero_jogadores: [2, [Validators.min(2), Validators.max(10)]],
			numero_vidas: [2, [Validators.min(1)]],
			dinheiro_inicial: [0, [Validators.min(0)]],
			custo_golpe_estado: [7, [Validators.min(0)]],
			golpe_estado_obrigatorio: [10, [Validators.min(0)]],
		});
	}

	aumentarValor(campo: string) {
		this.configuracaoForm.get(campo)?.setValue(this.configuracaoForm.get(campo)?.value + 1);
	}

	diminuirValor(campo: string) {
		if (this.configuracaoForm.get(campo)?.value - 1 >= 0) this.configuracaoForm.get(campo)?.setValue(this.configuracaoForm.get(campo)?.value - 1);
	}

	enviarConfiguracao() {
		if (this.fase_conf === 0 && this.configuracaoForm.valid) {
			this._gameService._numero_jogadores.next(this.configuracaoForm.get('numero_jogadores')?.value);
			this._gameService._numero_vidas.next(this.configuracaoForm.get('numero_vidas')?.value);
			this._gameService._dinheiro_inicial.next(this.configuracaoForm.get('dinheiro_inicial')?.value);
			this._gameService._custo_golpe_estado.next(this.configuracaoForm.get('custo_golpe_estado')?.value);
			this._gameService._golpe_estado_obrigatorio.next(this.configuracaoForm.get('golpe_estado_obrigatorio')?.value);
		}
	}
}
