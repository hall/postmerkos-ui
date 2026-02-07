export default function Port({ number, port, poe }) {
	const style = {
		display: 'flex',
		borderStyle: 'solid',
		borderWidth: '2px',
		borderSpacing: '2px',
		borderColor: 'grey',
		borderRadius: '5px',
		opacity: (port?.enabled ?? true) ? "1" : "0.5",
		width: '3rem',
		height: '3rem',
		alignItems: "center",
		justifyContent: "center",
		cursor: "pointer",
		position: "relative",
	};
	switch (port?.link?.speed) {
		case 100:
			style.backgroundColor = "#ebcb8b";
			style.color = "black";
			break;
		case 1000:
			style.backgroundColor = "#8fbcbb";
			style.color = "black";
			break;
		case 10000:
			style.backgroundColor = "#a3be8c";
			style.color = "black";
			break;
	}
	if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
		style.borderColor = 'lightgray';
	}

	return (
		<div style={style}>
			<span style={{
				position: "absolute",
				left: "0",
				top: "0",
				color: "blue",
				marginTop: "0em",
				marginLeft: "0.1em",
				display: port?.lacp ? "initial" : "none",
			}}>&bull;</span>
			<span style={{
				position: "absolute",
				left: "0",
				top: "0",
				color: "red",
				marginTop: "0.5em",
				marginLeft: "0.1em",
				display: port?.stp ? "initial" : "none",
			}}>&bull;</span>
			{poe && <span style={{
				position: "absolute",
				right: "0",
				top: "0",
				fontSize: "0.5em",
				color: "green",
				marginTop: "0.5em",
				marginRight: "0.3em",
				display: port?.poe?.enabled ? "initial" : "none",
			}}>{port?.poe?.mode?.substring(5)}</span>}
			{number}<span style={{
				position: "absolute",
				fontSize: "0.6em",
				bottom: "0",
				right: "0",
				padding: "3px 3px",
			}}>{port?.vlan?.pvid}</span>
		</div>
	);
}
