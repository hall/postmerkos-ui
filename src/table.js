import { Component } from 'preact';
import { get } from 'lodash';

export default class Legend extends Component {

    // diffStyle returns the style of PORT number if there is a diff in FIELD
    diffStyle(port, field) {
        let style = {}
        if (get(get(this, 'props.diff'), `ports.${port}.${field}`) != null) {
            style = {
                backgroundColor: "lightcoral",
                border: "1px black solid",
            }
        }
        return style
    }

    render() {
        let ports = get(this, 'props.ports');
        let updatePort = get(this, 'props.updatePort');

        return (
            <table style={{
                margin: "0 auto",
                paddingBottom: "20px",
                width: "initial",

            }}>
                <tr>
                    <th>port</th>
                    <th>enabled</th>
                    <th>established</th>
                    <th>speed</th>
                    {ports["1"].poe && <th>power</th>}
                    <th>vlan</th>
                    <th>allowed</th>
                    <th>lacp</th>
                    <th>stp</th>
                    <th>poe</th>
                    <th>standard</th>
                </tr>
                {Object.keys(ports).map(port => {
                    let p = ports[port]
                    let enabled = get(p, "enabled")
                    let lacp = get(p, "lacp")
                    let stp = get(p, "stp")
                    let poeEnabled = get(p, "poe.enabled")
                    return (
                        <tr>
                            <td>{port}</td>

                            <td style={this.diffStyle(port, "enabled")} >
                                <input
                                    id="enabled"
                                    type="checkbox"
                                    value={enabled}
                                    defaultChecked={enabled}
                                    onChange={() => updatePort(port, 'enabled', !enabled)}
                                />
                            </td>

                            <td>{get(p, "link.established").toString()}</td>

                            <td>{get(p, "link.speed")}</td>

                            {p.poe && <td>{get(p, "poe.power")}</td>}

                            <td style={this.diffStyle(port, "vlan.pvid")} >
                                <input name="pvid" type="number" min="1" max="4094" value={get(p, 'vlan.pvid')}
                                    onChange={e =>
                                        updatePort(port, 'vlan.pvid', Number(e.target.value))
                                    }></input>
                            </td>

                            <td style={this.diffStyle(port, "vlan.allowed")} >
                                <input name="vlans" value={get(p, 'vlan.allowed')}
                                    onChange={e =>
                                        updatePort(port, 'vlan.allowed', e.target.value)
                                    }></input>
                            </td>

                            <td style={this.diffStyle(port, "lacp")} >
                                <input id="lacp" type="checkbox" value={lacp} defaultChecked={lacp} onChange={() =>
                                    updatePort(port, 'lacp', !lacp)
                                } />
                            </td>

                            <td style={this.diffStyle(port, "stp")} >
                                <input id="stp" type="checkbox" value={stp} defaultChecked={stp} onChange={() =>
                                    updatePort(port, 'stp', !stp)
                                } />
                            </td>

                            <td style={this.diffStyle(port, "poe.enabled")} >
                                <input id="poe" type="checkbox" value={poeEnabled} defaultChecked={poeEnabled} onClick={e => {
                                    if (get(port, "poe.standard") == undefined) {
                                        updatePort(port, 'poe', { "enabled": !poeEnabled, "standard": "802.3af" })
                                    } else {
                                        updatePort(port, 'poe.enabled', !poeEnabled)
                                    }
                                }} />
                            </td>

                            <td style={this.diffStyle(port, "poe.standard")} >
                                <select name="poeStandard" value={get(p, "poe.standard")} onChange={e =>
                                    updatePort(port, 'poe.standard', e.target.value)
                                }>
                                    <option value="802.3af">802.3af</option>
                                    <option value="802.3at">802.3at</option>
                                </select>
                            </td>
                        </tr>

                    )
                })
                }
            </table>
        );
    }
}