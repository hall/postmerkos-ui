import './style';
import { Component } from 'preact';
import { useState } from "react";
import { set, get, cloneDeep } from 'lodash';
import Ports from './ports';
import Legend from './legend';
import Table from './table';
import Button from './button';
import ReactModal from 'react-modal';
import axios from 'axios';
import useInterval from './hook';

// API endpoint of switch in prod
let endpoint = "/cgi-bin";
// a local file to test port layouts in dev
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
	endpoint = "/test/24";
}

// getConfig returns the latest config file
const getConfig = () => {
	return axios.get(`${endpoint}/config`);
}

// getStatus returns the latest status
const getStatus = () => {
	return axios.get(`${endpoint}/status`);
}

export default class App extends Component {
	state = {
		showPreview: false,
		status: {},
		poe: false,
	}
	uploadButton = () => {
		const [isButtonLoading, setIsButtonLoading] = useState(false);
		let config = get(this, "state.config")

		return (
			<Button
				onClick={() => {
					setIsButtonLoading(true);

					config["datetime"] = new Date().toISOString();
					this.setState({ config })
					if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
						axios.post(`${endpoint}/config`, JSON.stringify(config, null, 4))
							.then(resp => {
								setIsButtonLoading(false)
								this.setState({ configOnDisk: config, diff: {} });
							}
							);
					} else {
						setTimeout(() => {
							setIsButtonLoading(false);
							this.setState({ configOnDisk: config, diff: {} });
						}, 1000);

					}
				}}
				isLoading={isButtonLoading}
			>
				<svg className={Object.values(get(this, 'state.diff')).every(x => !x) ? "": "diff-foreground" } 
			        id="i-upload" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none"
					stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
					<path d="M9 22 C0 23 1 12 9 13 6 2 23 2 22 10 32 7 32 23 23 22 M11 18 L16 14 21 18 M16 14 L16 29" />
				</svg>
			</Button>
		);
	}

	// updatePort updates the config of portNumber at path with value
	updatePort = (portNumber, path, value) => {
		if (path == "vlans") {
			let value = value.split(',').map(x => parseInt(x));
		}

		let config = cloneDeep(this.state.config)
		config["ports"][portNumber] = set(config.ports[portNumber], path, value)
		this.setState({ config: config, diff: this.updateDiff(config, get(this, 'state.configOnDisk')) });
	}

	async componentDidMount() {
		const incoming = (await getConfig()).data;
		const status = (await getStatus()).data;
		if (get(status, "device", "").endsWith("P")) {
			this.setState({ poe: true })
		}
		this.setState({
			config: incoming,
			configOnDisk: incoming,
			diff: {},
			status: status
		});
	}

	// updateDiff returns an object whose values are in b but not a
	updateDiff = (a, b) => {
		let parent = this;
		var r = {};
		_.each(a, function (v, k) {
			if (b[k] === v) return;
			r[k] = _.isObject(v) ? parent.updateDiff(v, b[k]) : v;
		});
		return r;
	}

	render() {
		ReactModal.setAppElement('html');
		const config = get(this, 'state.config');

		useInterval(async () => {
			let status = (await getStatus()).data
			this.setState({ status: status });
		}, 1000 * 3); // seconds

		return (
			<div>
				<div id="heading">
					<div style={{
						display: "flex",
						flexWrap: "wrap"
					}}>
						<diw>
							<h1 style={{ marginBottom: "-0.75rem" }}>postmerkOS</h1>
							<span style={{ fontSize: "0.9rem", marginLeft: "0.5em" }}>
								{/* VERSION */} dev {/* NOTE: do not remove; this is replaced in CI */}
							</span>
						</diw>

						<div style={{ display: "flex", marginLeft: "auto" }}>
							{config && <div id="buttons">
								{this.uploadButton()}

								<button
									title="view config"
									onClick={() => this.setState({ showPreview: true })}>
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

								<Legend poe={this.state.poe} />
							</div>}
						</div>
					</div>
					<div>
						<div>{get(this.state.status, "device")}</div>
						<div>{this.state.status.datetime}</div>

						{this.state.status &&
							Object.keys(get(this.state.status, "temperature", {})).map((type, value) => {
								return <div>
									<div>{type}:&nbsp;
										{this.state.status.temperature[type].map((c) => {
											return c.toFixed(1) + " "
										})}
										(<span style={{ fontSize: "0.8em" }}>&deg;C</span>)
									</div>
								</div>
							})
						}
					</div>
				</div>
				{config &&
					<div>
						<Ports
							config={config}
							status={this.state.status}
							poe={this.state.poe
							} />
						<Table ports={config["ports"]}
							config={config}
							updatePort={this.updatePort}
							status={this.state.status}
							poe={this.state.poe}
							diff={get(this, 'state.diff')}
						/>
					</div>
				}
			</div>
		);
	}
}
