import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	resolve: {
		alias: {
			$lib: path.resolve('src/lib'),
			$components: path.resolve('src/components'),
			$utils: path.resolve('src/utils'),
			$services: path.resolve('src/services'),
			$store: path.resolve('src/store'),
			$: path.resolve('src')
		}
	}
};

export default config;
