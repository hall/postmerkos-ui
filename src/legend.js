
import { Component } from 'preact';
import Port from './port';

// list of possible port states
let states = [
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
        "help": "poe enabled (in 802.3at/af mode)",
        "port": {
            "poe": {
                "enabled": true,
                "standard": "802.3at"
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
]

export default class Legend extends Component {

    render() {
        return (
            <div style={{
                position: "absolute",
                zIndex: 1
            }}>
                <details style={{
                    display: "flex",
                    border: "1px black solid"
                }}>
                    <summary>Legend</summary>
                    <dl>
                        {states.map(s => {
                            return (
                                <span
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginBottom: "10px"
                                    }}
                                >
                                    <dt><Port number="X" port={s["port"]} /></dt>
                                    <dd
                                        style={{
                                            marginLeft: "10px",
                                        }}
                                    >
                                        {s["help"]}
                                    </dd>
                                </span>
                            )
                        })}
                    </dl>
                </details>
            </div>
        );
    }
}
