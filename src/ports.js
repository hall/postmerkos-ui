import './style';
import { Component } from 'preact';
import Port from './port';
import get from 'lodash.get';
import { merge } from 'lodash';


export default class PortManagement extends Component {
	state = {
		selectedPort: 1,
		spfCount: 0,
	}

	getColor(port) {
		if (!get(port, "enabled")) {
			return "lightgray"
		}
		// if (get(port, "poe.enabled")) {
		// 	return "lightgreen"
		// }
		if (get(port, "link.established")) {
			return "lightyellow"
		}
		return "initial"
	}

	constructor(props) {
		super(props)
		let config = get(this, "props.config")

		let count = get(config, "ports").length
		// assume 2 rows of ports, for 10+ ports
		let rows = count > 10 ? 2 : 1;
		// assume 4 spf ports, if 10+ total ports
		let spf = count > 10 ? 4 : 2;
		// assume ports are grouped into counts of 12
		let groups = Math.floor(get(config, "ports").length / 12);

		this.state["spfCount"] = spf
		this.setState({
			style: {
				gridTemplateColumns: `repeat(${((get(config, "ports").length - spf) / rows) + (groups > 1 ? groups - 1 : groups)}, 1fr)`,
			}
		})
	}

	render() {
		let config = get(this, "props.config")
		let ports = get(config, "ports")

		const compare = (a, b) => {
			let firstSpf = ports.length - this.state.spfCount
			if (a.port > firstSpf || b.port > firstSpf)
				return a.port - b.port
			return b.port % 2 - a.port % 2
		}

		return (
			<div>
				<div style={{
					marginLeft: "calc(-50vw + 50%)",
					marginRight: "calc(-50vw + 50%)",
					display: "flex",
					justifyContent: "center",
				}}>
					<div id="ports" style={merge({
						display: "inline-grid",
						justifyItems: "center",
						margin: "4rem 1rem",
						overflowX: "auto",
						gridColumnGap: "2px",
						gridRowGap: "2px",
						position: "relative",
					}, this.state.style)}>
						{
							ports.sort(compare).map(port => {
								let p = <div
									onClick={() => this.setState({ selectedPort: port.port })}
									style={{
										display: 'flex',
										borderColor: this.state.selectedPort == port.port ? 'black' : 'lightgray',
										borderStyle: 'solid',
										borderWidth: '2px',
										borderSpacing: '2px',
										borderRadius: '5px',
										backgroundColor: this.getColor(port),
										color: this.getColor(port).startsWith("light") ? "black" : "inherit",
										width: '3rem',
										height: '3rem',
										alignItems: "center",
										justifyContent: "center",
										cursor: "pointer",
										position: "relative",
									}}>
									<span style={{
										position: "absolute",
										left: "0",
										top: "0",
										color: "blue",
										marginTop: "0em",
										marginLeft: "0.1em",
										display: get(port, "lacp") ? "initial" : "none",
									}}>&bull;</span>
									<span style={{
										position: "absolute",
										left: "0",
										top: "0",
										color: "red",
										marginTop: "0.5em",
										marginLeft: "0.1em",
										display: get(port, "stp") ? "initial" : "none",
									}}>&bull;</span>
									<span style={{
										position: "absolute",
										right: "0",
										top: "0",
										fontSize: "0.5em",
										color: "green",
										marginTop: "0.5em",
										marginRight: "0.3em",
										display: get(port, "poe.enabled") ? "initial" : "none",
									}}>{get(port, "poe.mode")?.substr(get(port, "poe.mode").length - 2)}</span>
									{port.port}<span style={{
										position: "absolute",
										fontSize: "0.6em",
										bottom: "0",
										right: "0",
										padding: "3px 3px",
									}}>{get(port, "vlan.pvid")}</span>
								</div>
								let idx = port.port % 12
								if ((idx == 0 || idx == 11) && ports.length - port.port > 12) {
									return [p, <div style={{ padding: "1rem" }}></div>]
								}
								return p
							})
						}
					</div>
				</div>
				<Port
					port={ports[ports.findIndex(e => e.port == this.state.selectedPort)]}
					number={this.state.selectedPort}
					updatePort={this.props.updatePort}
				/>
			</div >
		);
	}
}
