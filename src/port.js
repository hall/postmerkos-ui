import { Component } from 'preact';
import { get } from 'lodash';

export default class Port extends Component {
	getStyle(port) {
		let style = {
			display: 'flex',
			borderStyle: 'solid',
			borderWidth: '2px',
			borderSpacing: '2px',
			borderColor: 'grey',
			borderRadius: '5px',
			opacity: get(port, "enabled", true) ? "1" : "0.5",
			width: '3rem',
			height: '3rem',
			alignItems: "center",
			justifyContent: "center",
			cursor: "pointer",
			position: "relative",
		}
		switch (get(port, "link.speed")) {
			case 100:
				style["backgroundColor"] = "orange"
				style["color"] = "black";
				break
			case 1000:
				style["backgroundColor"] = "lightgreen"
				style["color"] = "black";
				break
			case 10000:
				style["backgroundColor"] = "lightblue"
				style["color"] = "black";
				break
		}
		if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			style["borderColor"] = 'lightgray';
		}
		return style
	}

	render() {
		let number = get(this, 'props.number');
		let port = get(this, 'props.port');

		return (
			<div
				// onClick={() => this.setState({ selectedPort: port })}
				style={this.getStyle(port)}>
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
				}}>{get(port, "poe.standard")?.substring(5)}</span>
				{number}<span style={{
					position: "absolute",
					fontSize: "0.6em",
					bottom: "0",
					right: "0",
					padding: "3px 3px",
				}}>{get(port, "vlan.pvid")}</span>
			</div>

		);
	}
}
