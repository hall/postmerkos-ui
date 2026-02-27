import { useState } from 'preact/hooks';
import Help from './help';

const SECTIONS = [
	{
		key: 'port',
		label: 'Port',
		defaultExpanded: true,
		columns: (poe) => [
			{ key: 'speed', label: 'speed', tooltip: 'Current link speed in Mbps' },
			...(poe ? [
				{ key: 'power', label: 'power', tooltip: 'Power consumption in watts' },
				{ key: 'poe', label: 'poe', tooltip: 'Power over Ethernet mode' },
			] : []),
			{ key: 'storm', label: 'storm', tooltip: 'Limits broadcast/multicast flooding' },
		],
	},
	{
		key: 'vlan',
		label: 'VLAN',
		defaultExpanded: false,
		columns: () => [
			{ key: 'vlans', label: 'vlans', tooltip: 'VLAN IDs: single = access, comma/range = trunk/hybrid' },
			{ key: 'native', label: 'native', tooltip: 'Untagged VLAN on trunk/hybrid (enables hybrid mode)' },
			{ key: 'ingress_filter', label: 'filter', tooltip: 'Drop inbound frames with VLANs not in the allowed list' },
		],
	},
	{
		key: 'stp',
		label: 'STP',
		defaultExpanded: false,
		columns: () => [
			{ key: 'enabled', label: 'enabled', tooltip: 'Enable Spanning Tree Protocol on this port' },
			{ key: 'priority', label: 'priority', tooltip: 'Lower values are preferred for root port election' },
			{ key: 'cost', label: 'cost', tooltip: 'Path cost — lower values are preferred paths' },
			{ key: 'edge', label: 'edge', tooltip: 'Skip STP negotiation (for end devices, not switches)' },
			{ key: 'state', label: 'state', tooltip: 'Current STP state: forwarding, blocking, learning, or listening' },
			{ key: 'role', label: 'role', tooltip: 'STP role: root, designated, alternate, or disabled' },
		],
	},
];

// Check if a vlans string represents multiple VLANs (comma-separated or range)
const isMultipleVlans = (v) => /[,\-]/.test(String(v ?? ''));

export default function Table({ ports, status, poe, updatePort, updatePortMulti, diff }) {
	const [sections, setSections] = useState(() => {
		const init = {};
		SECTIONS.forEach(s => { init[s.key] = s.defaultExpanded; });
		return init;
	});

	const toggle = (key) => setSections(prev => ({ ...prev, [key]: !prev[key] }));

	const diffStyle = (port, field) => {
		const parts = field.split('.');
		let val = diff?.ports?.[port];
		for (const part of parts) {
			val = val?.[part];
		}
		if (val != null) return "diff-background";
	};

	const vlansDiff = (port) =>
		diffStyle(port, 'vlan.mode') || diffStyle(port, 'vlan.pvid') || diffStyle(port, 'vlan.allowed');

	const handleVlansChange = (port, value, native) => {
		if (isMultipleVlans(value)) {
			updatePortMulti(port, {
				'vlan.mode': native ? 'hybrid' : 'trunk',
				'vlan.allowed': value,
				'vlan.pvid': Number(value.split(/[,\-]/)[0]) || 1,
			});
		} else {
			updatePortMulti(port, {
				'vlan.mode': 'access',
				'vlan.pvid': Number(value) || 1,
				'vlan.allowed': '',
				'vlan.untagged_vid': 0,
			});
		}
	};

	const handleNativeChange = (port, value, vlans) => {
		const n = Number(value) || 0;
		updatePortMulti(port, {
			'vlan.mode': n ? 'hybrid' : 'trunk',
			'vlan.untagged_vid': n,
		});
	};

	const expandedSections = SECTIONS.map(s => ({
		...s,
		expanded: sections[s.key],
		cols: s.columns(poe),
	}));

	return (
		<div className="table-scroll">
			<table className="port-table">
				<thead>
					<tr>
						<th rowSpan="2" className="sticky-col sticky-col-1"
							title="Port number — click to enable/disable">port</th>
						<th rowSpan="2" className="sticky-col sticky-col-2"
							title="Custom label for this port">name</th>
						{expandedSections.map(s => (
							<th key={s.key}
								colSpan={s.expanded ? s.cols.length : 1}
								className={`section-header section-toggle${s.expanded ? ' expanded' : ''}`}
								onClick={() => toggle(s.key)}
							>
								<span className="section-toggle-label">
									<span className="section-arrow">{s.expanded ? '▾' : '▸'}</span>
									{s.label}
									<Help section={s.key} />
								</span>
							</th>
						))}
					</tr>
					<tr>
						{expandedSections.map(s =>
							s.expanded
								? s.cols.map(col => (
									<th key={`${s.key}-${col.key}`} title={col.tooltip}>{col.label}</th>
								))
								: <th key={`${s.key}-collapsed`} className="collapsed-placeholder" />
						)}
					</tr>
				</thead>
				<tbody>
					{Object.keys(ports).map(port => {
						let p = { ...ports[port], ...status?.ports?.[port] };
						let enabled = p.enabled ?? true;
						let established = p.link?.established;
						let poeMode = p.poe?.mode;
						let vlanMode = p.vlan?.mode ?? 'access';
						let isAccess = vlanMode === 'access';
						let vlansValue = isAccess ? (p.vlan?.pvid ?? '') : (p.vlan?.allowed ?? '');
						let nativeValue = p.vlan?.untagged_vid || '';
						let stpEnabled = p.stp?.enabled ?? false;
						return (
							<tr key={port} className={established ? '' : 'inactive'}>
								<td className={`sticky-col sticky-col-1 ${diffStyle(port, 'enabled') ?? ''}`}>
									<span className="toggle">
										<button
											className={enabled ? 'active' : ''}
											onClick={() => updatePort(port, 'enabled', !enabled)}
										>{port}</button>
									</span>
								</td>

								<td className={`sticky-col sticky-col-2 ${diffStyle(port, 'name') ?? ''}`}>
									<input
										type="text"
										value={p.name}
										onChange={(e) => updatePort(port, 'name', e.target.value)}
									/>
								</td>

								{/* port section */}
								{sections.port ? (<>
									<td>{p.link?.speed}</td>
									{poe && <td>{status?.ports?.[port]?.poe?.power?.toFixed(2)}</td>}
									{poe &&
										<td className={diffStyle(port, "poe.mode")}>
											<span className="toggle">
												{[['at', 'high'], ['af', 'low']].map(([mode, label]) => (
													<button
														key={mode}
														className={poeMode === mode ? 'active' : ''}
														title={mode === 'at' ? '802.3at (30W)' : '802.3af (15.4W)'}
														onClick={() => updatePort(port, 'poe.mode', poeMode === mode ? 'disable' : mode)}
													>
														{label}
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
								</>) : <td />}

								{/* vlan section */}
								{sections.vlan ? (<>
									<td className={vlansDiff(port)}>
										<input
											value={vlansValue}
											onChange={e => handleVlansChange(port, e.target.value, nativeValue)}
										/>
									</td>
									<td className={diffStyle(port, "vlan.untagged_vid")}>
										<input className="vlan-input" type="number" min="1" max="4094"
											disabled={isAccess}
											value={nativeValue}
											onChange={e => handleNativeChange(port, e.target.value, vlansValue)}
										/>
									</td>
									<td className={diffStyle(port, "vlan.ingress_filter")}>
										<span className="toggle">
											<button
												className={p.vlan?.ingress_filter ? 'active' : ''}
												onClick={() => updatePort(port, 'vlan.ingress_filter', !p.vlan?.ingress_filter)}
											/>
										</span>
									</td>
								</>) : <td />}

								{/* stp section */}
								{sections.stp ? (<>
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
											onChange={e => updatePort(port, 'stp.priority', Number(e.target.value))}
										/>
									</td>
									<td className={diffStyle(port, "stp.cost")}>
										<input className="vlan-input" type="number" min="0"
											value={p.stp?.cost}
											onChange={e => updatePort(port, 'stp.cost', Number(e.target.value))}
										/>
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
								</>) : <td />}
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
