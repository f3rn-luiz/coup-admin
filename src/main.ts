import { bootstrapApplication } from '@angular/platform-browser';
import { PreloadAllModules, RouteReuseStrategy, provideRouter, withPreloading } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

addIcons(allIcons);

bootstrapApplication(AppComponent, {
	providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, provideIonicAngular(), provideRouter(routes, withPreloading(PreloadAllModules))],
});
