import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon } from '@ionic/angular/standalone';
import { GameService } from 'src/app/core/game.service';

@Component({
	selector: 'app-login',
	templateUrl: 'login.page.html',
	standalone: true,
	imports: [IonIcon, IonHeader, IonToolbar, IonTitle, IonContent, ReactiveFormsModule],
})
export class LoginPage implements OnInit {
	senhaForm!: UntypedFormGroup;

	texto_rodape = '';

	constructor(
		private _formBuilder: UntypedFormBuilder,
		private _gameService: GameService,
		private _router: Router,
	) {
		this.texto_rodape = _gameService.texto_rodape;
	}

	ngOnInit(): void {
		this.senhaForm = this._formBuilder.group({
			senha: [null],
		});
	}

	entrarAplicativo() {
		// if (this.senhaForm.value.senha !== '12345') this.senhaForm.get('senha')?.setValue(null);
		// else
		this._router.navigateByUrl('config');
	}
}
