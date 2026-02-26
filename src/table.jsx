export default function Table({ ports, status, poe, updatePort, diff, tab }) {
	const diffStyle = (port, field) => {
		const parts = field.split('.');
		let val = diff?.ports?.[port];
		for (const part of parts) {
			val = val?.[part];
		}
		if (val != null) return "diff-background";
	};

	const PortsColumns = ({ port, p, enabled, poeMode }) => (
		<>
			<td className={diffStyle(port, 'enabled')}>
				<span className="toggle">
					<button
						className={enabled ? 'active' : ''}
						onClick={() => updatePort(port, 'enabled', !enabled)}
					>{port}</button>
				</span>
			</td>

			<td className={diffStyle(port, 'name')}>
				<input
					type="text"
					value={p.name}
					onChange={(e) => updatePort(port, 'name', e.target.value)}
				/>
			</td>

			<td>{p.link?.speed}</td>

			{poe && <td>{status?.ports?.[port]?.poe?.power?.toFixed(2)}</td>}

			{poe &&
				<td className={diffStyle(port, "poe.mode")}>
					<span className="toggle">
						{['at', 'af'].map(mode => (
							<button
								key={mode}
								className={poeMode === mode ? 'active' : ''}
								onClick={() => updatePort(port, 'poe.mode', poeMode === mode ? 'disable' : mode)}
							>
								{mode}
							</button>
						))}
					</span>
				</td>
			}

			<td className={diffStyle(port, 'storm_control')}>
				<span className="toggle">
					<button
						className={p.storm_control ? 'active' : ''}
						onClick={() => updatePort(port, 'storm_control', !p.storm_control)}
					/>
				</span>
			</td>
		</>
	);

	const VlansColumns = ({ port, p }) => {
		const mode = p.vlan?.mode ?? 'access';
		const isAccess = mode === 'access';
		return (
			<>
				<td>{port}</td>

				<td className={diffStyle(port, "vlan.mode")}>
					<select className="vlan-mode-select"
						value={mode}
						onChange={e => updatePort(port, 'vlan.mode', e.target.value)}
					>
						<option value="access">access</option>
						<option value="trunk">trunk</option>
						<option value="hybrid">hybrid</option>
					</select>
				</td>

				<td className={diffStyle(port, "vlan.pvid")}>
					<input className="vlan-input" type="number" min="1" max="4094"
						value={p.vlan?.pvid}
						onChange={e =>
							updatePort(port, 'vlan.pvid', Number(e.target.value))
						} />
				</td>

				<td className={diffStyle(port, "vlan.allowed")}>
					<input value={p.vlan?.allowed}
						disabled={isAccess}
						onChange={e =>
							updatePort(port, 'vlan.allowed', e.target.value)
						} />
				</td>

				<td className={diffStyle(port, "vlan.untagged_vid")}>
					<input className="vlan-input" type="number" min="1" max="4094"
						disabled={isAccess}
						value={p.vlan?.untagged_vid}
						onChange={e =>
							updatePort(port, 'vlan.untagged_vid', Number(e.target.value))
						} />
				</td>

				<td className={diffStyle(port, "vlan.ingress_filter")}>
					<span className="toggle">
						<button
							className={p.vlan?.ingress_filter ? 'active' : ''}
							onClick={() => updatePort(port, 'vlan.ingress_filter', !p.vlan?.ingress_filter)}
						/>
					</span>
				</td>
			</>
		);
	};

	const StpColumns = ({ port, p }) => {
		let stpEnabled = p.stp?.enabled ?? false;
		return (
			<>
				<td>{port}</td>

				<td className={diffStyle(port, "stp.enabled")}>
					<span className="toggle">
						<button
							className={stpEnabled ? 'active' : ''}
							onClick={() => updatePort(port, 'stp.enabled', !stpEnabled)}
						/>
					</span>
				</td>

				<td className={diffStyle(port, "stp.priority")}>
					<input className="vlan-input" type="number" min="0" max="255"
						value={p.stp?.priority}
						onChange={e =>
							updatePort(port, 'stp.priority', Number(e.target.value))
						} />
				</td>

				<td className={diffStyle(port, "stp.cost")}>
					<input className="vlan-input" type="number" min="0"
						value={p.stp?.cost}
						onChange={e =>
							updatePort(port, 'stp.cost', Number(e.target.value))
						} />
				</td>

				<td className={diffStyle(port, "stp.edge")}>
					<span className="toggle">
						<button
							className={p.stp?.edge ? 'active' : ''}
							onClick={() => updatePort(port, 'stp.edge', !p.stp?.edge)}
						/>
					</span>
				</td>

				<td>{p.stp?.state}</td>

				<td>{p.stp?.role}</td>
			</>
		);
	};

	const headers = {
		ports: <>
			<th>enabled</th>
			<th>name</th>
			<th>speed</th>
			{poe && <th>power</th>}
			{poe && <th>poe</th>}
			<th>storm</th>
		</>,
		vlans: <>
			<th>port</th>
			<th>mode</th>
			<th>pvid</th>
			<th>allowed</th>
			<th>untagged vid</th>
			<th>ingress filter</th>
		</>,
		stp: <>
			<th>port</th>
			<th>enabled</th>
			<th>priority</th>
			<th>cost</th>
			<th>edge</th>
			<th>state</th>
			<th>role</th>
		</>,
	};

	return (
		<table className="port-table">
			<thead>
				<tr>
					{headers[tab]}
				</tr>
			</thead>
			<tbody>
				{Object.keys(ports).map(port => {
					let p = { ...ports[port], ...status?.ports?.[port] };
					let enabled = p.enabled ?? true;
					let established = p.link?.established;
					let poeMode = p.poe?.mode;
					return (
						<tr key={port} className={established ? '' : 'inactive'}>
							{tab === 'ports' && <PortsColumns port={port} p={p} enabled={enabled} poeMode={poeMode} />}
							{tab === 'vlans' && <VlansColumns port={port} p={p} />}
							{tab === 'stp' && <StpColumns port={port} p={p} />}
							</tr>
					)
				})}
			</tbody>
		</table>
	);
}
