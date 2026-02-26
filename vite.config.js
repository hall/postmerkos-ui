import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { WebSocketServer } from 'ws';
import { createConnection } from 'net';

function wsPlugin() {
	const host = process.env.SWITCH_HOST;

	return {
		name: 'ws-dev',
		configureServer(server) {
			server.httpServer.on('upgrade', (req, socket, head) => {
				if (req.url !== '/ws') return;

				if (host) {
					// Proxy mode: forward to real device
					const remote = createConnection({ host, port: 4001 }, () => {
						// Forward the original HTTP upgrade request to the remote server
						const headers = [`GET / HTTP/1.1`];
						for (const [key, value] of Object.entries(req.headers)) {
							// Replace host header with actual target
							if (key.toLowerCase() === 'host') {
								headers.push(`Host: ${host}:4001`);
							} else {
								headers.push(`${key}: ${value}`);
							}
						}
						remote.write(headers.join('\r\n') + '\r\n\r\n');
						if (head.length) remote.write(head);

						// Pipe responses back to client and subsequent data both ways
						remote.pipe(socket);
						socket.pipe(remote);
					});
					remote.on('error', () => socket.destroy());
					socket.on('error', () => remote.destroy());
					return;
				}

				// Mock mode: serve test data
				const wss = new WebSocketServer({ noServer: true });
				wss.handleUpgrade(req, socket, head, (ws) => {
					const configData = JSON.parse(
						readFileSync(resolve('src/test/24/config'), 'utf-8')
					);
					const statusData = JSON.parse(
						readFileSync(resolve('src/test/24/status'), 'utf-8')
					);

					ws.send(JSON.stringify({ type: 'config', data: configData }));
					ws.send(JSON.stringify({ type: 'status', data: statusData }));

					const interval = setInterval(() => {
						if (ws.readyState === ws.OPEN) {
							ws.send(JSON.stringify({ type: 'status', data: statusData }));
						}
					}, 3000);

					ws.on('message', (raw) => {
						const msg = JSON.parse(raw);
						if (msg.type === 'config') {
							// Echo back as acknowledgement
							ws.send(JSON.stringify({ type: 'config', data: msg.data }));
						}
					});

					ws.on('close', () => clearInterval(interval));
				});
			});
		},
	};
}

export default defineConfig({
	plugins: [
		preact(),
		wsPlugin(),
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
