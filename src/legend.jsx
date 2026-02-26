import { useRef } from 'preact/hooks';
import Port from './port';

const states = [
    { help: "port is disabled", port: { enabled: false } },
    { help: "link established at 100M", port: { link: { speed: 100 } } },
    { help: "link established at 1G", port: { link: { speed: 1000 } } },
    { help: "link established at 10G", port: { link: { speed: 10000 } } },
    { help: "poe enabled (802.3at/af mode)", port: { poe: { enabled: true, mode: "at" } } },
    { help: "stp enabled", port: { stp: { enabled: true } } },
    { help: "vlan id", port: { vlan: { pvid: 10 } } },
    { help: "stp forwarding", port: { link: { established: true }, stp: { state: "forwarding" } }, tab: "stp" },
    { help: "stp blocking", port: { link: { established: true }, stp: { state: "blocking" } }, tab: "stp" },
    { help: "stp learning", port: { link: { established: true }, stp: { state: "learning" } }, tab: "stp" },
    { help: "vlan group (colored by pvid)", port: { enabled: true, vlan: { pvid: 10 } }, tab: "vlans" },
];

export default function Legend({ poe }) {
    const dialogRef = useRef();

    return (
        <span>
            <button
                title="information"
                onClick={() => dialogRef.current.showModal()}>
                <svg id="i-info" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                    <path d="M16 14 L16 23 M16 8 L16 10" />
                    <circle cx="16" cy="16" r="14" />
                </svg>
            </button>
            <dialog className="legend" ref={dialogRef} onClick={(e) => {
                if (e.target === dialogRef.current) dialogRef.current.close();
            }}>
                <dl>
                    {states
                        .filter(s => poe || !('poe' in s.port))
                        .map((s, i) => (
                            <span key={i} className="legend-item">
                                <dt><Port number="X" port={s.port} poe={poe} tab={s.tab} /></dt>
                                <dd>{s.help}</dd>
                            </span>
                        ))}
                </dl>
            </dialog>
        </span>
    );
}
