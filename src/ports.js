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

		let count = Object.keys(get(config, "ports")).length
		// assume 2 rows of ports, for 10+ ports
		let rows = count > 10 ? 2 : 1;
		// assume 4 spf ports, if 10+ total ports
		let spf = count > 10 ? 4 : 2;
		// assume ports are grouped into counts of 12
		let groups = Math.floor(count / 12);

		this.state["spfCount"] = spf
		this.setState({
			style: {
				gridTemplateColumns: `repeat(${((count - spf) / rows) + (groups > 1 ? groups : groups)}, 1fr)`,
			}
		})
	}

	render() {
		let config = get(this, "props.config")
		let ports = get(config, "ports")
		let count = Object.keys(ports).length

		const compare = (a, b) => {
			let firstSpf = count - this.state.spfCount
			if (a > firstSpf || b > firstSpf)
				return a - b
			return b % 2 - a % 2
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
							Object.keys(ports).sort(compare).map(port => {
								let p = <div
									onClick={() => this.setState({ selectedPort: port })}
									style={{
										display: 'flex',
										borderColor: this.state.selectedPort == port ? 'black' : 'lightgray',
										borderStyle: 'solid',
										borderWidth: '2px',
										borderSpacing: '2px',
										borderRadius: '5px',
										backgroundColor: this.getColor(ports[port]),
										color: this.getColor(ports[port]).startsWith("light") ? "black" : "inherit",
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
										display: get(ports[port], "lacp") ? "initial" : "none",
									}}>&bull;</span>
									<span style={{
										position: "absolute",
										left: "0",
										top: "0",
										color: "red",
										marginTop: "0.5em",
										marginLeft: "0.1em",
										display: get(ports[port], "stp") ? "initial" : "none",
									}}>&bull;</span>
									<span style={{
										position: "absolute",
										right: "0",
										top: "0",
										fontSize: "0.5em",
										color: "green",
										marginTop: "0.5em",
										marginRight: "0.3em",
										display: get(ports[port], "poe.enabled") ? "initial" : "none",
									}}>{get(ports[port], "poe.standard")?.substring(5)}</span>
									{port}<span style={{
										position: "absolute",
										fontSize: "0.6em",
										bottom: "0",
										right: "0",
										padding: "3px 3px",
									}}>{get(ports[port], "vlan.pvid")}</span>
								</div>
								let idx = port % 12
								if ((idx == 0 || idx == 11)) {
									return [p, <div style={{ padding: "1rem" }}></div>]
								}
								return p
							})
						}
					</div>
				</div>
				<Port
					port={ports[this.state.selectedPort]}
					number={this.state.selectedPort}
					updatePort={this.props.updatePort}
				/>
			</div >
		);
	}
}
