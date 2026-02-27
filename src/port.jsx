export default function Port({ number, port, poe }) {
	let className = 'port';

	const speed = port?.link?.speed;
	const enabled = port?.enabled ?? true;

	if (speed) className += ` speed-${speed}`;
	if (!enabled) className += ' disabled';

	return (
		<div className={className} title={port?.name}>
			{port?.stp?.enabled && <span className="port-badge port-badge-stp">&bull;</span>}
			{poe && port?.poe?.enabled && port?.poe?.mode !== 'disable' && <span className="port-poe">{port?.poe?.mode}</span>}
			{number}
			<span className="port-vlan">{port?.vlan?.pvid}</span>
		</div>
	);
}
