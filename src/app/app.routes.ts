import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: '', loadComponent: () => import('./pages/login/login.page').then((p) => p.LoginPage) },
	{ path: 'home', loadComponent: () => import('./pages/conf/conf.page').then((p) => p.ConfPage) },
];
