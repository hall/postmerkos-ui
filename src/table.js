import { Component } from 'preact';
import { get } from 'lodash';

export default class Legend extends Component {

    render() {
        let ports = get(this, 'props.ports');
        let updatePort = get(this, 'props.updatePort');

        return (
            <table style={{
                marginLeft: "auto",
                marginRight: "auto",
                // justifyContent: "center",
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
                    <th>mode</th>
                </tr>
                {Object.keys(ports).map(port => {
                    let p = ports[port]
                    let enabled = get(p, "enabled")
                    let lacp = get(p, "lacp")
                    let stp = get(p, "stp")
                    let poeEnabled = get(p, "poe.enabled")
                    return (
                        <tr>
                            <td>
                                {port}
                            </td>
                            <td>
                                <input id="enabled" type="checkbox" value={enabled} defaultChecked={enabled} onChange={() =>
                                    updatePort(port, 'enabled', !enabled)
                                } />
                            </td>
                            <td>
                                {get(p, "link.established").toString()}
                            </td>
                            <td>
                                {get(p, "link.speed")}
                            </td>
                            {p.poe && <td>
                                {get(p, "poe.power")}
                            </td>}
                            <td>
                                <input name="pvid" type="number" min="1" max="4094" value={get(p, 'vlan.pvid')}
                                    onChange={e =>
                                        updatePort(port, 'vlan.pvid', e.target.value)
                                    }></input>
                            </td>
                            <td>
                                <input name="vlans" value={get(p, 'vlan.allowed')}
                                    onChange={e =>
                                        updatePort(port, 'vlan.allowed', e.target.value)
                                    }></input>
                            </td>
                            <td>
                                <input id="lacp" type="checkbox" value={lacp} defaultChecked={lacp} onChange={() =>
                                    updatePort(port, 'lacp', !lacp)
                                } />
                            </td>
                            <td>
                                <input id="stp" type="checkbox" value={stp} defaultChecked={stp} onChange={() =>
                                    updatePort(port, 'stp', !stp)
                                } />
                            </td>
                            <td>
                                <input id="poe" type="checkbox" value={poeEnabled} defaultChecked={poeEnabled} onClick={e => {
                                    if (get(port, "poe.mode") == undefined) {
                                        updatePort(port, 'poe', { "enabled": !poeEnabled, "mode": "802.3af" })
                                    } else {
                                        updatePort(port, 'poe.enabled', !poeEnabled)
                                    }
                                }} />
                            </td>
                            <td>
                                <select name="poeMode" value={get(p, "poe.mode")} onChange={e =>
                                    updatePort(port, 'poe.mode', e.target.value)
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
