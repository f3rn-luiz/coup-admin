import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: '', loadComponent: () => import('./pages/login/login.page').then((p) => p.LoginPage) },
	{ path: 'config', loadComponent: () => import('./pages/config/config.page').then((p) => p.ConfigPage) },
];
