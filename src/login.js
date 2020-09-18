import './style';
import { Component } from 'preact';
import SHA256 from 'js-sha256';


export default class Login extends Component {
	render() {
		return (
			<div>
                <label for="username">Username</label>
			    <input name="username" id="username" onChange={e => 
			        this.setState({ uname: e.target.value })
				}></input>

                <label for="password">Password</label>
			    <input name="password" type="password" id="password" onChange={e => 
			        this.setState({ pass: SHA256(e.target.value) })
				}></input>
				<button type="button" onClick={
                    () => this.props.validateUserLogin(this.state.uname, this.state.pass)
                }>Login</button>
			</div>
		);
	}
}
