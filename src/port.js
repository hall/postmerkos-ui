import { Component } from 'preact';
import { get } from 'lodash';

export default class Port extends Component {
	render() {
		let number = get(this, 'props.number');
		let port = get(this, 'props.port');

		const updatePort = (path, value) => {
			this.props.updatePort(number, path, value)
		}

		const poeEnabled = get(port, 'poe.enabled');
		const enabled = get(port, 'enabled');
		const stp = get(port, 'stp');
		const lacp = get(port, 'lacp');

		return (
			<div style={{ margin: '1%', borderTop: '2px solid lightgray' }}>
				<h3 style={{ textAlign: 'center' }}>{`Port ${number}`}</h3>

				<div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", margin: "5%" }}>
					<div style={{ flex: "1" }}>
						<table>
							<tr>
								<td>Link</td>
								<td>{get(port, "link.established") ? "Established" : "Down"}</td>
							</tr>
							<tr>
								<td>Speed</td>
								<td>{get(port, "link.speed")} Mbps</td>
							</tr>
							{port.poe && <tr>
								<td>Power</td>
								<td>{get(port, "poe.power", "-")} W</td>
							</tr>}
						</table>
					</div>

					<div style={{ flex: "1 1 10%" }}>
						<label for="pvid">VLAN ID</label>
						<input name="pvid" type="number" min="1" max="4094" value={get(port, 'vlan.pvid')}
							onChange={e =>
								updatePort('vlan.pvid', e.target.value)
							}></input>
						<div>
							<label for="vlans">VLANs allowed <span style={{ fontSize: "0.8em" }}>(ex: <code>1-5,7</code>)</span></label>
							<input name="vlans" value={get(port, 'vlan.allowed')}
								onChange={e =>
									updatePort('vlan.allowed', e.target.value)
								}></input>
						</div>
					</div>
					<div>
						<div>
							<input id="enabled" type="checkbox" value={enabled} defaultChecked={enabled} onChange={() =>
								updatePort('enabled', !enabled)
							} /><label for="enabled"> Enabled</label>
						</div>
						<div>
							<input id="lacp" type="checkbox" value={lacp} defaultChecked={lacp} onChange={() =>
								updatePort('lacp', !lacp)
							} /><label for="lacp"> LACP</label>
						</div>
						<div>
							<input id="stp" type="checkbox" value={stp} defaultChecked={stp} onChange={() =>
								updatePort('stp', !stp)
							} /><label for="stp"> STP</label>
						</div>
						{port.poe &&
							<div>
								<input id="poe" type="checkbox" value={poeEnabled} defaultChecked={poeEnabled} onClick={e => {
									if (get(port, "poe.mode") == undefined) {
										updatePort('poe', { "enabled": !poeEnabled, "mode": "802.3af" })
									} else {
										updatePort('poe.enabled', !poeEnabled)
									}
								}
								} /><label for="poe"> PoE</label>
								<div style={{ marginTop: "0.5rem" }}>
									{/* <label for="poeMode">Mode</label> */}
									<select name="poeMode" value={get(port, "poe.mode")} onChange={e =>
										updatePort('poe.mode', e.target.value)
									}>
										<option value="802.3af">802.3af</option>
										<option value="802.3at">802.3at</option>
									</select>
								</div>
							</div>
						}
					</div>

				</div>
			</div>
		);
	}
}
