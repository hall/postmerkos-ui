import './style';
import get from 'lodash.get';
import { Component } from 'preact';
import SHA256 from 'js-sha256';


export default class Login extends Component {
	state = {
		uname: get(this, 'props.config.credentials.username')
	}
	render() {
		return (
			<div style={{ textAlign: 'center', margin: '1%', border: '3px solid lightgray'}}>
				<h3 style={{ textAlign: 'center' }}>Change Credentials</h3>
				<div style={{ marginBottom: '10px'}}>
					<label for="username" style={{ margin: '2%'}}>Username</label>
					<input name="username" id="username" value={this.state.uname} onChange={e => 
						this.setState({ uname: e.target.value })
					} style={{ display: 'inline-block' }}></input>

					<label for="password" style={{ margin: '2%'}}>Password</label>
					<input name="password" type="password" id="password" onChange={e => 
						this.setState({ pass: SHA256(e.target.value) })
					} style={{ display: 'inline-block' }}></input>

					<button type="button" onClick={
						() => this.props.updateCredentials({ username: this.state.uname, password: this.state.pass})
					}>Save Username / Password </button>
				</div>
			</div>
		);
	}
}
