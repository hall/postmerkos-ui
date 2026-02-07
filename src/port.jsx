export default function Port({ number, port, poe }) {
	let className = 'port';
	const speed = port?.link?.speed;
	if (speed) className += ` speed-${speed}`;
	if (!(port?.enabled ?? true)) className += ' disabled';

	return (
		<div className={className}>
			{port?.lacp && <span className="port-badge port-badge-lacp">&bull;</span>}
			{port?.stp && <span className="port-badge port-badge-stp">&bull;</span>}
			{poe && port?.poe?.enabled && <span className="port-poe">{port?.poe?.mode?.substring(5)}</span>}
			{number}
			<span className="port-vlan">{port?.vlan?.pvid}</span>
		</div>
	);
}
