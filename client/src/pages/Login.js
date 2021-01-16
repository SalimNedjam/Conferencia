import React, {Component} from "react";
import axios from 'axios';
import {bake_cookie} from 'sfcookies';

export default class Login extends Component {

	constructor(props) {
		super(props);

		this.state = {
			error: "",
			checkbox: false
		}
	}

	checkValidity() {
		const params = new URLSearchParams();
		params.append('user', this.inputLogin.value);
		params.append('password', this.inputPassword.value);
		params.append('root', this.state.checkbox ? "true" : "false");

		axios.post("http://localhost:8080/Project_war/Login", params)
			.then(res => {
				if (res.data.key !== undefined) {
					bake_cookie("key", res.data.key);
					window.location.href = "/";
				}
				else {
					if (res.data.code !== -1)
						this.setState({
							error: res.data.message
						});
					else
						this.setState({
							error: "Veuillez remplir les champs"
						})
				}
			})


	}

	renderSignupMsg() {
		if (this.props.match.params && this.props.match.params.msg === "ok") return (
			<div class="container box-sm alert alert-success p-2" role="alert">
				Votre compte a été créé ! Connectez-vous
			</div>
		)
	}

	render() {
		return (
			<div class="mt-5">
				{this.renderSignupMsg()}
				<div class="container p-4 box box-sm">
					<form>
						<h1 class="mb-4">Conferentia</h1>
						{this.state.error && 
							<div class="alert alert-danger p-2" role="alert">
							{this.state.error}
							</div>
						}
						<div class="mb-4">
							<label 
								for="emailInput" 
								class="form-label">
								Adresse mail
							</label>
							<input 
								type="email"
								name="login"
								class="form-control"
								id="emailInput"
								ref={(inputLogin) => {
									this.inputLogin = inputLogin
								}}
								onKeyPress={
									event => {
										if (event.key === "Enter")
											this.checkValidity();
									}
								}
								aria-describedby="emailHelp"/>
						</div>
						<div class="mb-3">
							<label
								for="passwordInput" 
								class="form-label">
								Mot de passe
							</label>
							<input 
								type="password"
								name="pwd"
								class="form-control"
								ref={(inputPassword) => {
									this.inputPassword = inputPassword
								}}
								onKeyPress={
									event => {
										if (event.key === "Enter")
											this.checkValidity();
									}
								}
								id="passwordInput"/>
								<a onClick={() => this.props.forgot()}>
								Mot de passe oublié ?
							</a>
						</div>
						<div class="mb-3 form-check">
							<input 
								type="checkbox" 
								defaultChecked={this.state.checkbox}
								class="form-check-input"
								onChange={() => this.setState({
									checkbox: !this.state.checkbox
								})}
								id="checkInput"/>
							<label 
								class="form-check-label" 
								for="checkInput">
								Garder ma session active
							</label>
						</div>
						<div class="d-flex justify-content-center">
							<button
								type="button"
								name="connexion"
								onClick={() => this.checkValidity()}
								class="btn btn-primary m-1">
								Connexion
							</button>
							<button 
								type="button"
								name="signup"
								onClick={() => window.location.href = '/signup'}
								class="btn btn-light m-1">
								Inscription
							</button>
						</div>
					</form>
				</div>
			</div>
		);

	}
}