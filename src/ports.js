import './style';
import { Component } from 'preact';
import Port from './port';
import get from 'lodash.get';
import set from 'lodash.set';


export default class PortManagement extends Component {
	render() {
		let ports = get(this, 'props.config.ports');

		const updatePort = (idx, port) => {
			ports = set(ports, `[${idx}]`, port)
			this.props.updatePort(ports);
		}
		return (
			<div>
				<div style={{ marginBottom: '10px'}}>
					<button type="button" onClick={ () => this.props.addPort() }>Add Port</button>
					<button type="button" onClick={ () => this.props.deletePort() }>Remove Port</button>
					<button type="button" onClick={ () => this.props.saveChanges() }style={{ float: 'right' }}>Save Changes</button>
				</div>
		
				<div>
					{
						Object.keys(ports).map(element => {
							return <Port ports={ports} index={element} updatePort={updatePort}/>
						})
					}
				</div>
			</div>
		);
	}
}
