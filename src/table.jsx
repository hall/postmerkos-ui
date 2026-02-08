export default function Table({ ports, status, poe, updatePort, diff }) {
	const diffStyle = (port, field) => {
		const parts = field.split('.');
		let val = diff?.ports?.[port];
		for (const part of parts) {
			val = val?.[part];
		}
		if (val != null) return "diff-background";
	};

	return (
		<table className="port-table">
			<thead>
				<tr>
					<th>enabled</th>
					<th>name</th>
					<th>speed</th>
					{poe && <th>power</th>}
					<th>vlan</th>
					<th>allowed</th>
					<th>lacp</th>
					<th>stp</th>
					{poe && <th>poe</th>}
				</tr>
			</thead>
			<tbody>
				{Object.keys(ports).map(port => {
					let p = { ...status?.ports?.[port], ...ports[port] };
					let enabled = p.enabled ?? true;
					let lacp = p.lacp;
					let stp = p.stp;
					let established = p.link?.established;
					let poeMode = p.poe?.mode;
					return (
						<tr key={port} className={established ? '' : 'inactive'}>

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

							<td className={diffStyle(port, "vlan.pvid")}>
								<input className="vlan-input" type="number" min="1" max="4094"
									value={p.vlan?.pvid}
									onChange={e =>
										updatePort(port, 'vlan.pvid', Number(e.target.value))
									} />
							</td>

							<td className={diffStyle(port, "vlan.allowed")}>
								<input value={p.vlan?.allowed}
									onChange={e =>
										updatePort(port, 'vlan.allowed', e.target.value)
									} />
							</td>

							<td className={diffStyle(port, "lacp")}>
								<span className="toggle">
									<button
										className={lacp ? 'active' : ''}
										onClick={() => updatePort(port, 'lacp', !lacp)}
									/>
								</span>
							</td>

							<td className={diffStyle(port, "stp")}>
								<span className="toggle">
									<button
										className={stp ? 'active' : ''}
										onClick={() => updatePort(port, 'stp', !stp)}
									/>
								</span>
							</td>

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
						</tr>
					)
				})}
			</tbody>
		</table>
	);
}
