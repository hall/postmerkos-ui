import { useRef } from 'preact/hooks';

const HELP = {
	port: {
		title: 'Port Settings',
		terms: [
			{ term: 'Speed', desc: 'Read-only. Shows the negotiated link speed (e.g. 100M, 1G, 10G). Empty when no link is established.' },
			{ term: 'PoE', desc: '802.3at provides up to 30W; 802.3af provides up to 15.4W. Click a mode to enable it, click again to disable. Power column shows real-time wattage.' },
			{ term: 'Storm control', desc: 'Limits broadcast and multicast flooding to prevent a single misbehaving device from saturating the network.' },
		],
	},
	vlan: {
		title: 'VLAN Settings',
		intro: 'A VLAN (Virtual LAN) segments traffic on a single physical switch into isolated broadcast domains. The port mode is inferred from the vlans and native fields.',
		terms: [
			{ term: 'VLANs', desc: 'Enter a single VLAN ID for access mode (all traffic untagged), or multiple IDs separated by commas or ranges (e.g. 10,20 or 10-20) for trunk/hybrid mode (tagged traffic).' },
			{ term: 'Native', desc: 'The VLAN sent and received without a tag. Only applies when multiple VLANs are configured. Setting a native VLAN enables hybrid mode; leaving it empty uses trunk mode (all tagged).' },
			{ term: 'Filter', desc: 'Ingress filter. When enabled, drops incoming frames whose VLAN ID is not in the allowed list.' },
		],
		example: 'To put a port on VLAN 10, enter 10 in vlans. To carry VLANs 10 and 20 between switches, enter 10,20. To also send VLAN 10 untagged, set native to 10.',
	},
	stp: {
		title: 'STP Settings',
		intro: 'STP (Spanning Tree Protocol) prevents loops in networks with redundant paths by selectively blocking some ports.',
		terms: [
			{ term: 'Priority', desc: 'Lower value means more likely to become the root port (range 0\u2013255).' },
			{ term: 'Cost', desc: 'Path cost. Lower values are preferred when choosing which path to forward traffic on.' },
			{ term: 'Edge', desc: 'Marks the port as connected to an end device (not another switch). Skips STP negotiation for faster link-up.' },
			{ term: 'State', desc: 'Read-only. Current STP state: forwarding, blocking, learning, or listening.' },
			{ term: 'Role', desc: 'Read-only. STP role: root, designated, alternate, or disabled.' },
		],
	},
};

export default function Help({ section }) {
	const dialogRef = useRef();
	const content = HELP[section];
	if (!content) return null;

	return (
		<span className="help-btn-wrap">
			<button
				className="help-btn"
				title={`${content.title} help`}
				onClick={(e) => {
					e.stopPropagation();
					dialogRef.current.showModal();
				}}
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
					<path d="M12 12 C12 8, 20 8, 20 12 C20 15, 16 14, 16 18 M16 22 L16 24" />
					<circle cx="16" cy="16" r="14" />
				</svg>
			</button>
			<dialog className="help-dialog" ref={dialogRef} onClick={(e) => {
				e.stopPropagation();
				if (e.target === dialogRef.current) dialogRef.current.close();
			}}>
				<h3>{content.title}</h3>
				{content.intro && <p>{content.intro}</p>}
				<dl>
					{content.terms.map((t) => (
						<span key={t.term}>
							<dt>{t.term}</dt>
							<dd>{t.desc}</dd>
						</span>
					))}
				</dl>
				{content.example && <p className="help-example">{content.example}</p>}
			</dialog>
		</span>
	);
}
