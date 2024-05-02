import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'com.luizfsouza.coupadmin',
	appName: 'COUP Admin',
	webDir: 'www',
	plugins: {
		SplashScreen: {
			launchShowDuration: 3000,
			backgroundColor: '#000000',
			splashFullScreen: true,
			splashImmersive: true,
			showSpinner: true,
			androidSpinnerStyle: 'small',
			iosSpinnerStyle: 'small',
		},
	},
};

export default config;
