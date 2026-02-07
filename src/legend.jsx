import { useRef } from 'preact/hooks';
import Port from './port';

const states = [
    {
        "help": "port is disabled",
        "port": {
            "enabled": false
        }
    },
    {
        "help": "link established at 100M",
        "port": {
            "link": {
                "speed": 100
            }
        }
    },
    {
        "help": "link established at 1000M",
        "port": {
            "link": {
                "speed": 1000
            }
        }
    },
    {
        "help": "link established at 10000M",
        "port": {
            "link": {
                "speed": 10000
            }
        }
    },
    {
        "help": "poe enabled (802.3at/af mode)",
        "port": {
            "poe": {
                "enabled": true,
                "mode": "802.3at"
            }
        }
    },
    {
        "help": "stp enabled",
        "port": {
            "stp": true
        }
    },
    {
        "help": "lacp enabled",
        "port": {
            "lacp": true
        }
    },
    {
        "help": "vlan id",
        "port": {
            "vlan": {
                "pvid": 10
            }
        }
    }
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
            <dialog ref={dialogRef} onClick={(e) => {
                if (e.target === dialogRef.current) dialogRef.current.close();
            }} style={{
                width: "fit-content",
                height: "fit-content",
            }}>
                <details open>
                    <summary
                        style={{
                            pointerEvents: "none",
                            listStyle: "none",
                            display: "none",
                        }}
                    >
                    </summary>
                    <dl>
                        {states
                            .filter(s => poe || !('poe' in s.port))
                            .map((s, i) => (
                                <span
                                    key={i}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginBottom: "10px"
                                    }}
                                >
                                    <dt><Port number="X" port={s.port} /></dt>
                                    <dd style={{ marginLeft: "10px" }}>
                                        {s.help}
                                    </dd>
                                </span>
                            ))}
                    </dl>
                </details>
            </dialog>
        </span>
    );
}
