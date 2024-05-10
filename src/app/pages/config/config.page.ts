import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { GameService } from 'src/app/core/game.service';
import { Jogador } from 'src/app/core/game.type';

@Component({
	selector: 'app-config',
	templateUrl: 'config.page.html',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class ConfigPage implements OnInit, OnDestroy {
	private _unsubscribeAll: Subject<any> = new Subject<any>();

	texto_rodape = '';

	configuracao1Form!: UntypedFormGroup;
	configuracao2Form!: UntypedFormGroup;

	fase_conf = 0;
	jogadores: Jogador[] | null = [];

	constructor(
		private _changeDetectorsRef: ChangeDetectorRef,
		private _formBuilder: UntypedFormBuilder,
		private _route: Router,
		private _gameService: GameService,
	) {
		_gameService._jogadores.pipe(takeUntil(this._unsubscribeAll)).subscribe({ next: (j) => (this.jogadores = j) });
		this.texto_rodape = _gameService.texto_rodape;
	}

	ngOnInit(): void {
		this.configuracao1Form = this._formBuilder.group({
			numero_jogadores: [0, [Validators.min(2), Validators.max(10)]],
			numero_vidas: [0, [Validators.min(1)]],
			dinheiro_inicial: [0, [Validators.min(0)]],
			custo_golpe_estado: [0, [Validators.min(0)]],
			golpe_estado_obrigatorio: [0, [Validators.min(0)]],
		});

		this._gameService._numero_jogadores.pipe(takeUntil(this._unsubscribeAll)).subscribe({ next: (c) => this.configuracao1Form.get('numero_jogadores')?.setValue(c) });
		this._gameService._numero_vidas.pipe(takeUntil(this._unsubscribeAll)).subscribe({ next: (c) => this.configuracao1Form.get('numero_vidas')?.setValue(c) });
		this._gameService._dinheiro_inicial.pipe(takeUntil(this._unsubscribeAll)).subscribe({ next: (c) => this.configuracao1Form.get('dinheiro_inicial')?.setValue(c) });
		this._gameService._custo_golpe_estado.pipe(takeUntil(this._unsubscribeAll)).subscribe({ next: (c) => this.configuracao1Form.get('custo_golpe_estado')?.setValue(c) });
		this._gameService._golpe_estado_obrigatorio.pipe(takeUntil(this._unsubscribeAll)).subscribe({ next: (c) => this.configuracao1Form.get('golpe_estado_obrigatorio')?.setValue(c) });

		this.configuracao2Form = this._formBuilder.group({
			nome_j0: [''],
			nome_j1: [''],
			nome_j2: [''],
			nome_j3: [''],
			nome_j4: [''],
			nome_j5: [''],
			nome_j6: [''],
			nome_j7: [''],
			nome_j8: [''],
			nome_j9: [''],
		});
	}

	ngOnDestroy(): void {
		this._unsubscribeAll.next(null);
		this._unsubscribeAll.complete();
	}

	aumentarValor(campo: string) {
		this.configuracao1Form.get(campo)?.setValue(this.configuracao1Form.get(campo)?.value + 1);
	}

	diminuirValor(campo: string) {
		if (this.configuracao1Form.get(campo)?.value - 1 >= 0) this.configuracao1Form.get(campo)?.setValue(this.configuracao1Form.get(campo)?.value - 1);
	}

	qtdJogadores() {
		return new Array(this.configuracao1Form.get('numero_jogadores')?.value);
	}

	configurarJogadores() {
		let jogadores: Jogador[] = [];
		for (let i = 0; i < this.configuracao1Form.get('numero_jogadores')?.value; i++) {
			jogadores = [...jogadores, { nome: this.configuracao2Form.get(`nome_j${i}`)?.value.trim(), vida: this.configuracao1Form.get('numero_vidas')?.value, dinheiro: this.configuracao1Form.get('dinheiro_inicial')?.value }];
		}
		this._gameService._jogadores.next(jogadores);
		this._changeDetectorsRef.markForCheck();
	}

	enviarConfiguracao() {
		if (this.fase_conf === 0) {
			if (this.configuracao1Form.valid) {
				this._gameService._numero_jogadores.next(this.configuracao1Form.get('numero_jogadores')?.value);
				this._gameService._numero_vidas.next(this.configuracao1Form.get('numero_vidas')?.value);
				this._gameService._dinheiro_inicial.next(this.configuracao1Form.get('dinheiro_inicial')?.value);
				this._gameService._custo_golpe_estado.next(this.configuracao1Form.get('custo_golpe_estado')?.value);
				this._gameService._golpe_estado_obrigatorio.next(this.configuracao1Form.get('golpe_estado_obrigatorio')?.value);
				this.fase_conf++;
				this._changeDetectorsRef.markForCheck();
			}
		} else if (this.fase_conf === 1) {
			let conf2_val = true;
			for (let i = 0; i < this.configuracao1Form.get('numero_jogadores')?.value; i++) {
				if (this.configuracao2Form.get(`nome_j${i}`)?.value.trim() === '') conf2_val = false;
			}
			if (conf2_val) {
				this.configurarJogadores();
				this._route.navigateByUrl('players');
			}
		}
	}
}
