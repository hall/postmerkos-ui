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
		<table style={{
			margin: '0 auto',
			marginBottom: '20px',
			width: 'initial'
		}}>
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
					return (
						<tr key={port} style={established ? {} : { opacity: 0.5 }}>

							<td className={diffStyle(port, 'enabled')} >
								{port}&nbsp;
								<input
									id="enabled"
									type="checkbox"
									value={enabled}
									defaultChecked={enabled}
									onChange={() => updatePort(port, 'enabled', !enabled)}
								/>
							</td>

							<td className={diffStyle(port, 'name')} >
								<input
									id="name"
									type="text"
									value={p.name}
									onChange={(e) => updatePort(port, 'name', e.target.value)}
								/>
							</td>

							<td>{p.link?.speed}</td>

							{poe && <td>{status?.ports?.[port]?.poe?.power?.toFixed(2)}</td>}

							<td className={diffStyle(port, "vlan.pvid")} >
								<input name="pvid" type="number" min="1" max="4094"
									value={p.vlan?.pvid}
									style={{ width: "6ch" }}
									onChange={e =>
										updatePort(port, 'vlan.pvid', Number(e.target.value))
									} />
							</td>

							<td className={diffStyle(port, "vlan.allowed")} >
								<input name="vlans" value={p.vlan?.allowed}
									onChange={e =>
										updatePort(port, 'vlan.allowed', e.target.value)
									} />
							</td>

							<td className={diffStyle(port, "lacp")} >
								<input id="lacp" type="checkbox" value={lacp} defaultChecked={lacp} onChange={() =>
									updatePort(port, 'lacp', !lacp)
								} />
							</td>

							<td className={diffStyle(port, "stp")} >
								<input id="stp" type="checkbox" value={stp} defaultChecked={stp} onChange={() =>
									updatePort(port, 'stp', !stp)
								} />
							</td>

							{poe &&
								<td className={diffStyle(port, "poe.mode")} >
									<select name="poeMode" value={p.poe?.mode} onChange={e =>
										updatePort(port, 'poe.mode', e.target.value)
									}>
										<option value="at">802.3at</option>
										<option value="af">802.3af</option>
										<option value="disable">disabled</option>
									</select>
								</td>
							}
						</tr>
					)
				})}
			</tbody>
		</table>
	);
}
