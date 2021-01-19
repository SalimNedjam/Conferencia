import React, {Component} from "react";
import {connect} from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

import {bake_cookie, read_cookie} from 'sfcookies';
import axios from 'axios';

import { setUser, unsetUser } from "./redux/actions";

import Home from './pages/Home';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Logout from './pages/Logout';
import NewConference from './pages/NewConference';
import Conference from './pages/Conference';

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loading: true,
		}
	}

	componentDidMount() {
		this.state.loading = true;
		this.islogin();
	}

	componentWillUpdate() {
		this.isLogout();
	}

	islogin() {
		const keySession = read_cookie("key");
		if (keySession !== "") {
			const params = new URLSearchParams();
			params.append('key', keySession);
			axios.post("http://localhost:8080/Project_war/Login", params)
			.then(res => {
				if (res.data.code === undefined) {
					this.props.setUser({
						key: keySession,
						login: res.data.login,
						id: res.data.user,
						isStaff: res.data.is_staff >= 1,
						admin: res.data.is_staff == 2,
						responsable: res.data.is_staff == 1,
						firstName: res.data.prenom,
						lastName: res.data.nom,
					});
				}
				this.setState({loading: false});
			})
		} else {
			this.setState({loading: false});
		}
	}

	isLogout() {
		const keySession = read_cookie("key");
		if (keySession !== "") {
			const params = new URLSearchParams();
			params.append('key', keySession);
			axios.post("http://localhost:8080/Project_war/Login", params)
				.then(res => {
					if (res.data.code !== undefined) {
						bake_cookie("key", "");
						this.props.unsetUser();
					}
				})
		}
	}

	render() {
		if (this.state.loading) return (<div></div>);
		if (this.props.user === undefined) {
			return (
				<Router>
					<div>
						<Switch>
							<Route path="/login/:msg" component={Login}/>
							<Route path="/login" component={Login}/>
							<Route path="/signup" component={Signup}/>
							<Redirect to="/login"/>
						</Switch>
					</div>
				</Router>
			);
		}
		return (
			<Router>
			  <div>
					<Switch>
						<Route path="/me">
							<Profile/>
						</Route>
						<Route path="/logout">
							<Logout/>
						</Route>
						{this.props.user.isStaff ? 
							<Route path="/new" component={NewConference}/> : 
							<Redirect from="/new" to="/"/>
						}
						<Route path="/new" component={NewConference}/>
						<Route path="/conf/:id" component={Conference}/>
						<Route path="/">
							<Home/>
							<Redirect to="/" />
						</Route>
					</Switch>
			  </div>
			</Router>
		);
	}
}

const mapStateToProps = state => {
	return {
	  user: state.user.user,
	};
}

export default connect(mapStateToProps, {setUser, unsetUser})(App);