import { render } from 'preact';
import './style.css';
import { useState, useEffect, useRef, useCallback } from 'preact/hooks';
import Ports from './ports';
import Legend from './legend';
import Table from './table';
import Button from './button';

const WS_URL = import.meta.env.DEV
	? `ws://${location.host}/ws`
	: `ws://${location.hostname}:4001`;

// Set a nested value by dot-separated path
const setPath = (obj, path, value) => {
	const keys = path.split('.');
	const result = structuredClone(obj);
	let current = result;
	for (let i = 0; i < keys.length - 1; i++) {
		if (current[keys[i]] == null) current[keys[i]] = {};
		current = current[keys[i]];
	}
	current[keys[keys.length - 1]] = value;
	return result;
};

const computeDiff = (a, b) => {
	const r = {};
	if (!a || !b) return r;
	Object.keys(a).forEach(k => {
		if (b[k] === a[k]) return;
		r[k] = (typeof a[k] === 'object' && a[k] !== null)
			? computeDiff(a[k], b[k])
			: a[k];
	});
	return r;
};

function App() {
	const [config, setConfig] = useState(null);
	const [configOnDisk, setConfigOnDisk] = useState(null);
	const [diff, setDiff] = useState({});
	const [status, setStatus] = useState({});
	const [poe, setPoe] = useState(false);
	const [error, setError] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [tab, setTab] = useState(() => new URLSearchParams(location.search).get('tab') || 'ports');
	const dialogRef = useRef();
	const wsRef = useRef(null);

	const switchTab = (t) => {
		setTab(t);
		history.replaceState(null, '', '?tab=' + t);
	};

	useEffect(() => {
		let reconnectTimer;
		let ws;

		const connect = () => {
			ws = new WebSocket(WS_URL);
			wsRef.current = ws;

			ws.onmessage = (e) => {
				const msg = JSON.parse(e.data);
				if (msg.type === 'status') {
					setStatus(msg.data);
					if ((msg.data.device ?? '').endsWith('P')) setPoe(true);
				} else if (msg.type === 'config') {
					setConfig(msg.data);
					setConfigOnDisk(msg.data);
					setDiff({});
				}
				setError(null);
			};

			ws.onerror = () => setError('WebSocket connection failed');

			ws.onclose = () => {
				wsRef.current = null;
				reconnectTimer = setTimeout(connect, 3000);
			};
		};

		connect();

		return () => {
			clearTimeout(reconnectTimer);
			if (ws) ws.close();
		};
	}, []);

	const uploadConfig = useCallback(() => {
		setUploading(true);
		const updated = structuredClone(config);
		updated.datetime = new Date().toISOString();
		setConfig(updated);

		const ws = wsRef.current;
		if (ws && ws.readyState === WebSocket.OPEN) {
			ws.send(JSON.stringify({ type: 'config', data: updated }));
			setUploading(false);
			setConfigOnDisk(updated);
			setDiff({});
		} else {
			setUploading(false);
			console.error('WebSocket not connected');
		}
	}, [config]);

	const updatePort = (portNumber, path, value) => {
		const updated = structuredClone(config);
		updated.ports[portNumber] = setPath(updated.ports[portNumber], path, value);
		setConfig(updated);
		setDiff(computeDiff(updated, configOnDisk));
	};

	if (error && !config) {
		return (
			<div id="heading">
				<h1>postmerkOS</h1>
				<div className="error">{error}</div>
			</div>
		);
	}

	return (
		<div>
			<div id="heading">
				<div className="heading-bar">
					<div>
						<h1>postmerkOS</h1>
						<span className="version">
							{/* VERSION */} dev {/* NOTE: do not remove; this is replaced in CI */}
						</span>
					</div>

					<div className="heading-actions">
						{config && <div id="buttons">
							<Button
								onClick={uploadConfig}
								isLoading={uploading}
							>
								<svg className={Object.values(diff).every(x => !x) ? "" : "diff-foreground"}
									id="i-upload" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none"
									stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
									<path d="M9 22 C0 23 1 12 9 13 6 2 23 2 22 10 32 7 32 23 23 22 M11 18 L16 14 21 18 M16 14 L16 29" />
								</svg>
							</Button>

							<button
								title="view config"
								onClick={() => dialogRef.current.showModal()}>
								<svg id="i-eye" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
									<circle cx="17" cy="15" r="1" />
									<circle cx="16" cy="16" r="6" />
									<path d="M2 16 C2 16 7 6 16 6 25 6 30 16 30 16 30 16 25 26 16 26 7 26 2 16 2 16 Z" />
								</svg>
							</button>

							<dialog className="config-preview" ref={dialogRef} onClick={(e) => {
								if (e.target === dialogRef.current) dialogRef.current.close();
							}}>
								<textarea readOnly="true">
									{JSON.stringify(config, null, 2)}
								</textarea>
							</dialog>

							<Legend poe={poe} />

							<a href="https://github.com/hall/postmerkos-ui" target="_blank" rel="noopener noreferrer"
								title="GitHub">
								<button>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
										<path d="M10 9 L3 17 10 25 M22 9 L29 17 22 25 M18 7 L14 27" />
									</svg>
								</button>
							</a>
						</div>}
					</div>
				</div>
				<div>
					<div>{status.device}</div>
					<div>{status.datetime}</div>

					{status &&
						Object.keys(status.temperature ?? {}).map(type => (
							<div key={type}>
								{type}:&nbsp;
								{status.temperature[type].map((c, i) => (
									<span key={i}>{c.toFixed(1)} </span>
								))}
								(<span className="status-temp">&deg;C</span>)
							</div>
						))
					}
				</div>
			</div>
			{config &&
				<div>
					<Ports
						config={config}
						status={status}
						poe={poe}
						tab={tab}
					/>
					<div className="tabs toggle">
						{['ports', 'vlans', 'stp'].map(t => (
							<button key={t} className={tab === t ? 'active' : ''} onClick={() => switchTab(t)}>
								{t}
							</button>
						))}
					</div>
					<Table ports={config.ports}
						config={config}
						updatePort={updatePort}
						status={status}
						poe={poe}
						diff={diff}
						tab={tab}
					/>
				</div>
			}
		</div>
	);
}

render(<App />, document.getElementById('app'));
