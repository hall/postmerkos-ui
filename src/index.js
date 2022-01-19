import './style';
import { Component } from 'preact';
import { set, get, cloneDeep } from 'lodash';
import Ports from './ports';
import Legend from './legend';
import Table from './table';
import ReactModal from 'react-modal';
import axios from 'axios';

let endpoint = "/cgi-bin/config"

const fetchConfig = () => {
	if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
		endpoint = '/test/48.json'
	}
	return axios.get(endpoint)
}

export default class App extends Component {
	state = {
		showPreview: false,
	}

	updatePort = (portNumber, path, value) => {
		if (path == "vlans") {
			let value = value.split(',').map(x => parseInt(x));
		}

		let config = cloneDeep(this.state.config)
		config["ports"][portNumber] = set(config.ports[portNumber], path, value)
		// console.log(`updating port ${portNumber} at ${path} with ${value}`)
		this.setState({ config });
	}

	async componentDidMount() {
		const incoming = (await fetchConfig()).data;
		this.setState({ config: incoming });
	}

	render() {
		ReactModal.setAppElement('html');
		const config = get(this, 'state.config');
		return (
			<div>
				<div id="heading">
					<div style="display: flex; flex-wrap: wrap">
						<h1>Freeraki v0.2</h1>

						<div style="display: flex; margin-left: auto">
							{config && <div>
								<button onClick={() => {
									config["date"] = new Date().toISOString();
									this.setState({ config })
									axios.post(endpoint, JSON.stringify(config, null, 4))
								}}>
									<svg id="i-upload" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
										<path d="M9 22 C0 23 1 12 9 13 6 2 23 2 22 10 32 7 32 23 23 22 M11 18 L16 14 21 18 M16 14 L16 29" />
									</svg>
								</button>
								<button onClick={() => this.setState({ showPreview: true })}>
									<svg id="i-eye" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
										<circle cx="17" cy="15" r="1" />
										<circle cx="16" cy="16" r="6" />
										<path d="M2 16 C2 16 7 6 16 6 25 6 30 16 30 16 30 16 25 26 16 26 7 26 2 16 2 16 Z" />
									</svg>
								</button>
								<ReactModal isOpen={this.state.showPreview}
									shouldCloseOnOverlayClick={true}
									onRequestClose={() => this.setState({ showPreview: false })}
								>
									<textarea readOnly="true"
										style={{
											resize: "none",
											height: "calc(100% - 12px)",
											position: "initial",
											zIndex: 100,
										}}>
										{JSON.stringify(config, null, 2)}
									</textarea>
								</ReactModal>
								<Legend />
							</div>}
						</div>
					</div>
					<div>{get(this.state.config, "device")}</div>
					<div>{get(this.state.config, "date")}</div>
					<div>{get(this.state.config, "temperature")}</div>
				</div>
				{config &&
					<div>
						<Ports config={config} />
						<Table ports={config["ports"]} updatePort={this.updatePort} />
					</div>
				}
			</div>
		);
	}
}
