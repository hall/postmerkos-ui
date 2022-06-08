import './style';
import { Component } from 'preact';
import Port from './port';
import get from 'lodash.get';
import { merge } from 'lodash';


export default class Ports extends Component {
	state = {
		selectedPort: 1,
		spfCount: 0,
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
		let status = get(this, "props.status")
		let ports = get(config, "ports")
		let poe = get(this, "props.poe")
		let count = Object.keys(ports).length

		const compare = (a, b) => {
			if (count < 12) {
				// don't sort switches with less than 1 port group
				return a - b
			}
			let firstSpf = count - this.state.spfCount
			if (a > firstSpf || b > firstSpf)
				return a - b
			return b % 2 - a % 2
		}

		return (
			<div>
				<div style={{
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
								let p =
									<Port number={port} port={{ ...status["ports"][port], ...ports[port] }} poe={poe} />
								let idx = port % 12
								if ((idx == 0 || idx == 11)) {
									return [p, <div style={{ padding: "1rem" }}></div>]
								}
								return p
							})
						}
					</div>
				</div>
			</div >
		);
	}
}
