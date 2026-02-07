import './style.css';
import { useMemo } from 'preact/hooks';
import Port from './port';

export default function Ports({ config, status, poe }) {
	const ports = config.ports;
	const count = Object.keys(ports).length;

	const { gridStyle, spfCount } = useMemo(() => {
		let rows = count > 10 ? 2 : 1;
		let spf = count > 10 ? 4 : 2;
		let groups = Math.floor(count / 12);
		return {
			gridStyle: {
				gridTemplateColumns: `repeat(${((count - spf) / rows) + (groups > 1 ? groups : groups)}, 1fr)`,
			},
			spfCount: spf,
		};
	}, [count]);

	const compare = (a, b) => {
		if (count < 12) return a - b;
		let firstSpf = count - spfCount;
		if (a > firstSpf || b > firstSpf) return a - b;
		return b % 2 - a % 2;
	};

	return (
		<div>
			<div style={{
				display: "flex",
				justifyContent: "center",
			}}>
				<div id="ports" style={{
					display: "inline-grid",
					justifyItems: "center",
					margin: "4rem 1rem",
					overflowX: "auto",
					gridColumnGap: "2px",
					gridRowGap: "2px",
					position: "relative",
					...gridStyle
				}}>
					{
						Object.keys(ports).sort(compare).map(port => {
							let p =
								<Port key={port} number={port} port={{ ...status?.ports?.[port], ...ports[port] }} poe={poe} />
							let idx = port % 12
							if ((idx == 0 || idx == 11)) {
								return [p, <div key={`spacer-${port}`} style={{ padding: "1rem" }}></div>]
							}
							return p
						})
					}
				</div>
			</div>
		</div>
	);
}
