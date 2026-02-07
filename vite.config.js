import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
	plugins: [preact()],
	build: {
		// Disable sourcemaps for production (matches old preact.config.js)
		sourcemap: false,
		// Output to 'build' directory for compatibility with existing scripts
		outDir: 'build',
	},
	// Make test data available in dev mode
	publicDir: 'assets',
	server: {
		port: 8080,
	},
});
