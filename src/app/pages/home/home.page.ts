import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon } from '@ionic/angular/standalone';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	standalone: true,
	imports: [IonIcon, IonHeader, IonToolbar, IonTitle, IonContent, ReactiveFormsModule],
})
export class HomePage implements OnInit {
	configuracaoForm!: UntypedFormGroup;

	constructor(private _formBuilder: UntypedFormBuilder) {}

	ngOnInit(): void {
		this.configuracaoForm = this._formBuilder.group({
			numero_jogadores: [2, [Validators.min(2), Validators.max(10)]],
			numero_vidas: [2, [Validators.min(2)]],
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
}
