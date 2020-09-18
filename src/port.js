import './style';
import { Component } from 'preact';
import get from 'lodash.get';
import set from 'lodash.set';

export default class Port extends Component {
	render() {
		const idx = get(this, 'props.index');
		let port = get(this, `props.ports[${idx}]`);

		const updatePort = (idx, location, value) => {
			port = set(port, `${location}`, value)
			this.props.updatePort(idx, port);
		}

		const updateVlans = (idx, location, value) => {
			let vlans = value.split(',').map(x => parseInt(x));
			updatePort(idx, location, vlans);
		}

		const pvid = get(port, 'pvid');
		const vlans = get(port, 'vlans');
		const tagged = get(port, 'tagged');
		const poeMode = get(port, 'poe.mode');
		const poeEnabled = get(port, 'poe.enabled');
		const stp = get(port, 'stp');
		const lacp = get(port, 'lacp');
	
		return (
			<div style={{ margin: '1%', border: '3px solid lightgray'}}>
				<h3 style={{ textAlign: 'center' }}>{ `Port ${idx}` }</h3>
				<div style={{ margin: '5%', display: 'inline-block'}}>
					<label for="pvid">Port VLAN ID (ex: 1)</label>
					<input name="pvid" value={pvid}
						onChange={e => 
							updatePort(idx, 'pvid', e.target.value)
						}></input>
					<div>
						<label for="vlans">VLANs (ex: 1,3,5)</label>
						<input name="vlans" value={vlans}
							onChange={e => 
								updateVlans(idx, 'vlans', e.target.value)
							}></input>
					</div>
					<button type="button" value={tagged} onClick={e => 
							updatePort(idx, 'tagged', !tagged)
						}>{ tagged ? 'Disable' : 'Enable' } VLANs</button>
				</div>

				<div style={{ margin: '5%', display: 'inline-block'}}>
					<div>
						<label for="poe">PoE Mode</label>
						<select name="poe" selected={poeMode} onChange={e => 
							updatePort(idx, 'poe.mode', e.target.value)
						}>
							<option value="802.3af">802.3af</option>
							<option value="802.3at">802.3at</option>
						</select>
					</div>
					<div>
						<button type="button" value={poeEnabled} onClick={e => 
							updatePort(idx, 'poe.enabled', !poeEnabled)
						}>{ poeEnabled ? 'Disable' : 'Enable' } PoE</button>
					</div>
				</div>

				<div style={{ margin: '5%', display: 'inline-block'}}>
					<div>
						<button type="button" value={stp} onClick={e => 
							updatePort(idx, 'stp', !stp)
						}>{ stp ? 'Disable' : 'Enable' } STP</button>
					</div>
					<div>
						<button type="button" value={lacp} onClick={e => 
							updatePort(idx, 'lacp', !lacp)
						}>{ lacp ? 'Disable' : 'Enable' } LACP</button>
					</div>
				</div>
			</div>
		);
	}
}
