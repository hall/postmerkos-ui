import { render } from 'preact';
import './style.css';
import { useState, useEffect, useRef } from 'preact/hooks';
import Ports from './ports';
import Legend from './legend';
import Table from './table';
import Button from './button';

// API endpoint of switch in prod
let endpoint = "/cgi-bin";
// a local file to test port layouts in dev
if (import.meta.env.DEV) {
	endpoint = "/test/24";
}

const getConfig = () => fetch(`${endpoint}/config`).then(r => r.json());
const getStatus = () => fetch(`${endpoint}/status`).then(r => r.json());

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
	const dialogRef = useRef();

	useEffect(() => {
		(async () => {
			try {
				const incoming = await getConfig();
				const statusData = await getStatus();
				if ((statusData.device ?? "").endsWith("P")) {
					setPoe(true);
				}
				setConfig(incoming);
				setConfigOnDisk(incoming);
				setDiff({});
				setStatus(statusData);
				setError(null);
			} catch (err) {
				console.error('Failed to load config/status:', err);
				setError('Failed to connect to switch. Check network connection.');
			}
		})();
	}, []);

	useEffect(() => {
		const id = setInterval(async () => {
			try {
				const statusData = await getStatus();
				setStatus(statusData);
				setError(null);
			} catch (err) {
				console.error('Failed to fetch status:', err);
			}
		}, 1000 * 3);
		return () => clearInterval(id);
	}, []);

	const uploadConfig = () => {
		setUploading(true);
		const updated = structuredClone(config);
		updated.datetime = new Date().toISOString();
		setConfig(updated);

		if (!import.meta.env.DEV) {
			fetch(`${endpoint}/config`, {
				method: 'POST',
				body: JSON.stringify(updated, null, 4),
			})
				.then(() => {
					setUploading(false);
					setConfigOnDisk(updated);
					setDiff({});
				})
				.catch(err => {
					setUploading(false);
					console.error('Failed to save config:', err);
				});
		} else {
			setTimeout(() => {
				setUploading(false);
				setConfigOnDisk(updated);
				setDiff({});
			}, 1000);
		}
	};

	const updatePort = (portNumber, path, value) => {
		if (path == "vlans") {
			value = value.split(',').map(x => parseInt(x));
		}
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
					/>
					<Table ports={config.ports}
						config={config}
						updatePort={updatePort}
						status={status}
						poe={poe}
						diff={diff}
					/>
				</div>
			}
		</div>
	);
}

render(<App />, document.getElementById('app'));
