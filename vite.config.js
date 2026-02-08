import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { createReadStream } from 'fs';
import { resolve } from 'path';

export default defineConfig({
	plugins: [
		preact(),
		{
			name: 'serve-dev-data',
			configureServer(server) {
				server.middlewares.use('/test', (req, res, next) => {
					const file = resolve('src/test', req.url.replace(/^\//, ''));
					res.setHeader('Content-Type', 'application/json');
					createReadStream(file).on('error', () => next()).pipe(res);
				});
			},
		},
	],
	build: {
		sourcemap: false,
		outDir: 'build',
	},
	publicDir: 'assets',
	server: {
		port: 8080,
	},
});
