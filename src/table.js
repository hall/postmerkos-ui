import { Component } from 'preact';
import { get } from 'lodash';

export default class Legend extends Component {

	// diffStyle returns the style of PORT number if there is a diff in FIELD
	diffStyle(port, field) {
		if (get(this, `props.diff.ports.${port}.${field}`) != null) {
			return "diff-background";
		}
	}

	render() {
		let ports = get(this, 'props.ports');
		let status = get(this, 'props.status');
		let poe = get(this, 'props.poe');
		let updatePort = get(this, 'props.updatePort');

		return (
			<table style={{
				margin: '0 auto',
				marginBottom: '20px',
				width: 'initial'
			}}
			>
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
					{/* {poe && <th>mode</th>} */}
				</tr>
				{Object.keys(ports).map(port => {
					// combine status and config
					let p = { ...status.ports[port], ...ports[port] };
					let enabled = get(p, 'enabled', true);
					let lacp = get(p, 'lacp');
					let stp = get(p, 'stp');
					let established = get(p, 'link.established');
					let poeEnabled = get(p, 'poe.enabled');
					return (
						<tr style={established || "opacity: 0.5;"}>

							<td className={this.diffStyle(port, 'enabled')} >
								{port}&nbsp;
								<input
									id="enabled"
									type="checkbox"
									value={enabled}
									defaultChecked={enabled}
									onChange={() => updatePort(port, 'enabled', !enabled)}
								/>
							</td>

							<td className={this.diffStyle(port, 'name')} >
								<input
									id="name"
									type="text"
									value={get(p, 'name')}
									onChange={(e) => updatePort(port, 'name', e.target.value)}
								/>
							</td>

							<td>{get(p, 'link.speed')}</td>

							{/* TODO: not found in the merged dict */}
							{poe && <td>{get(status.ports[port], "poe.power").toFixed(2)}</td>}


							<td className={this.diffStyle(port, "vlan.pvid")} >
								<input name="pvid" type="number" min="1" max="4094" 
							        value={get(p, 'vlan.pvid')}
									style={"width: 6ch;"}
									onChange={e =>
										updatePort(port, 'vlan.pvid', Number(e.target.value))
									}></input>
							</td>

							<td className={this.diffStyle(port, "vlan.allowed")} >
								<input name="vlans" value={get(p, 'vlan.allowed')}
									onChange={e =>
										updatePort(port, 'vlan.allowed', e.target.value)
									}></input>
							</td>

							<td className={this.diffStyle(port, "lacp")} >
								<input id="lacp" type="checkbox" value={lacp} defaultChecked={lacp} onChange={() =>
									updatePort(port, 'lacp', !lacp)
								} />
							</td>

							<td className={this.diffStyle(port, "stp")} >
								<input id="stp" type="checkbox" value={stp} defaultChecked={stp} onChange={() =>
									updatePort(port, 'stp', !stp)
								} />
							</td>

							{/* {poe &&
								<td className={this.diffStyle(port, "poe.enabled")} >
									<input id="poe" type="checkbox" value={poeEnabled} defaultChecked={poeEnabled} onClick={e => {
										if (get(port, "poe.mode") == undefined) {
											updatePort(port, 'poe', { "enabled": !poeEnabled, "mode": "802.3af" })
										} else {
											updatePort(port, 'poe.enabled', !poeEnabled)
										}
									}} />
								</td>
							} */}

							{poe &&
								<td className={this.diffStyle(port, "poe.mode")} >
									<select name="poeMode" value={get(p, "poe.mode")} onChange={e =>
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
				})
				}
			</table>
		);
	}
}
