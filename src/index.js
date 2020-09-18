import './style';
import { Component } from 'preact';
import SHA256 from 'js-sha256';
import axios from 'axios';
import cloneDeep from 'lodash.clonedeep';
import get from 'lodash.get';
import PortManagement from './ports';
import Login from './login'
import Credentials from './credentials'
import def_port from './defaults/port'

const def_config = {
	credentials: {
		username: 'admin',
		password: SHA256('admin')
	},
	ports: {
		'1': cloneDeep(def_port)
	}
};

const fetch = '/admin/switch.json';
const store = '/admin/save';

const getConfig = () => {
	return axios.get(fetch);
	/*return {
		"credentials": {
			"username": "login",
			"password": SHA256('test')
		},
		"ports": {}
	}; // Use this for testing the login */
}

const storeConfig = (config) => {
	axios.post(store, config)
}


const previewConfig = (config) => {
	const preview = cloneDeep(config)
	const pass = get(preview, 'credentials.password', '')
	preview.credentials.password = pass.substring(0, Math.min(pass.length, 3)) + '-HIDDEN';
	return preview;
};

export default class App extends Component {
	async validateUserLogin(username, password) {
		try {
			const incoming = await getConfig();
			if (get(incoming, 'credentials.username') == username ||
				get(incoming, 'credentials.password') == password) {
				this.setState({ config: incoming});
			}
		} catch (e) {
			this.setState({ config: def_config });
		}
	}
	

	async componentDidMount() {
		await this.validateUserLogin();
	}
	render() {
		const config = get(this, 'state.config');
		return (
			<div>
				<h1>Freeraki v0.1</h1>
				{ !config && 
						<Login validateUserLogin={(u, p) => this.validateUserLogin(u, p)}/> }
				{ config && 
					<PortManagement 
						config={config}
						addPort={() => { 
							let ports = get(config, 'ports');
							let length = Object.keys(ports).length;
							ports[length + 1] = cloneDeep(def_port);
							config.ports = ports;
							this.setState({ config: config });
						}}
						deletePort={() => {
							let ports = get(config, 'ports');
							let length = Object.keys(ports).length;
							delete ports[length];
							config.ports = ports;
							this.setState({ config: config });
						}}
						updatePort={(ports) => {
							config.ports = ports;
							this.setState({ config: config });
						}}
						saveChanges={() => {
							storeConfig(config);
						}} /> }
				{ config && 
					<Credentials config={config} updateCredentials={async (creds) =>{
						config.credentials = creds;
						this.setState({ config: config });
						await storeConfig(config);
					}}/>}

				{ config && <div>
					<h2>Preview</h2>
					<textarea readOnly="true" rows="20">
						{ JSON.stringify(previewConfig(config), null, 2 )}
					</textarea>
				</div> }
			</div>
		);
	}
}
