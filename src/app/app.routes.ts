import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: '', loadComponent: () => import('./pages/home/home.page').then((p) => p.LoginPage) },
	{ path: 'config', loadComponent: () => import('./pages/config/config.page').then((p) => p.ConfigPage) },
	{ path: 'players', loadComponent: () => import('./pages/players/players.page').then((p) => p.PlayersPage) },
	{ path: 'game', loadComponent: () => import('./pages/game/history/game-history.page').then((p) => p.GameHistoryPage) },
];
