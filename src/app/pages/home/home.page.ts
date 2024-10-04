import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { GameService } from 'src/app/core/game.service';

@Component({
	selector: 'app-login',
	templateUrl: 'home.page.html',
	standalone: true,
	imports: [IonicModule],
})
export class LoginPage {
	texto_rodape = '';

	constructor(
		private _gameService: GameService,
		private _router: Router,
	) {
		this.texto_rodape = this._gameService.texto_rodape;
	}

	entrarAplicativo() {
		this._gameService.resetarTUDO();
		this._router.navigateByUrl('config');
	}
}
