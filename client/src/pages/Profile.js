import React, {Component} from "react";
import {connect} from "react-redux";

import {read_cookie} from 'sfcookies';
import axios from 'axios';

import Header from '../components/Header';
import Button from '../components/Button';

const INFOS_FORM = {
  title: {
      name: 'title',
      type: 'select',
      values: ['Prof', 'Dr','Mr', 'Mrs', 'Ms'],
      label: "Titre",
  },
  prenom: {
      name: 'firstname',
      type: 'text',
      label: "Prénom",
  },
  nom: {
      name: 'lastname',
      type: 'text',
      label: "Nom",
  },
  institution: {
      name: 'institution',
      type: 'text',
      label: "Institution",
  },
  address: {
      name: 'address',
      type: 'text',
      label: "Adresse",
  },
  zip: {
      name: 'zip',
      type: 'text',
      label: "Code postal",
  },
  city: {
      name: 'city',
      type: 'text',
      label: "Ville",
  },
  country: {
      name: 'country',
      type: 'text',
      label: "Pays",
  },
  phone: {
      name: 'institution',
      type: 'text',
      label: "Téléphone",
  },
}

const PASSWORD_FORM = {
	oldPassword: {
		name: 'email',
		type: 'password',
		label: "Ancien mot de passe",
		minLength: 5,
	},
	password: {
			name: 'pass',
			type: 'password',
			label: "Nouveau mot de passe",
			minLength: 5,
	},
	confirmPassword: {
			verify: 'password',
			name: 'confirmPass',
			type: 'password',
			label: "Confirmation du mot de passe",
			minLength: 5,
	},
}

class Profile extends Component {

	constructor(props) {
		super(props);
		this.state = {
			errors: {},
			loading: false,
		};

		this.inputs = [];
	}

	componentDidMount() {
		const params = new URLSearchParams();
		params.append('key', read_cookie("key"));
		params.append('idUser', this.props.user.id);

		axios.post("http://localhost:8080/Project_war/GetUserInfos", params)
			.then(res => {
				if (res.data.code === undefined) {
				this.setState({infos: res.data});
				}
			}
		);
	}

	modifyUser() {
		if (this.checkInfosForm()) {
			const params = new URLSearchParams();
	
			for (let index in Object.keys(INFOS_FORM)) {
				index = Object.keys(INFOS_FORM)[index];
				if (!INFOS_FORM[index].verify) {
					params.append(index, this.inputs[index].value);
					console.log(this.inputs[index].value);
				}
				this.setState({loading: true});
		}
			

		// axios.post("http://localhost:8080/Project_war/CreateUser", params)
		// .then(res => {
		//     if (res.data.code === undefined) {
		//         window.location.href = '/login/ok';
		//     } else {
		//         let errors = {};
		//         errors["serverError"] = res.data.message;
		//         this.setState({errors})
		//     }
		// });
		}
	}

	changePassword() {
		if (this.checkPasswordForm()) {
			const params = new URLSearchParams();
			for (let index in Object.keys(PASSWORD_FORM)) {
				index = Object.keys(PASSWORD_FORM)[index];
				if (!PASSWORD_FORM[index].verify) {
					params.append(index, this.inputs[index].value);
					console.log(this.inputs[index].value);
				}
				this.setState({loading: true});
			}
		}
	}

	checkInfosForm() {
		let errors = {};
		let formIsValid = true;
		let scroll = false;

		for (let index in Object.keys(INFOS_FORM)) {
			index = Object.keys(INFOS_FORM)[index];
			let item = INFOS_FORM[index];
			if (!this.inputs[index] || this.inputs[index].value === "") {
				errors[index] = "Le champ ne peut être vide";
				formIsValid = false;
			} else if (item.regex && !this.inputs[index].value.match(item.regex)) {
				this.inputs[index].value = "";
				formIsValid = false;
				errors[index] = "Uniquement des caractères";
			} else if (item.minLength && this.inputs[index].value.length < item.minLength) {
				this.inputs[index].value = "";
				formIsValid = false;
				errors[index] = `Minimum ${item.minLength} caractères`;
			}
			if (!formIsValid && !scroll) {
				scroll = true;
				if (this.inputs[index]) {
					this.inputs[index].scrollIntoView()
				}
			}
		}
		this.setState({errors});
		return formIsValid;
	}

	checkPasswordForm() {
		let errors = {};
		let formIsValid = true;
		let scroll = false;

		for (let index in Object.keys(PASSWORD_FORM)) {
			index = Object.keys(PASSWORD_FORM)[index];
			let item = PASSWORD_FORM[index];
			if (!this.inputs[index] || this.inputs[index].value === "") {
				errors[index] = "Le champ ne peut être vide";
				formIsValid = false;
			} else if (item.minLength && this.inputs[index].value.length < item.minLength) {
				this.inputs[index].value = "";
				formIsValid = false;
				errors[index] = `Minimum ${item.minLength} caractères`;
			} else if (item.verify && this.inputs[index].value !== this.inputs[item.verify].value) {
				this.inputs[item.verify].value = "";
				this.inputs[index].value = "";
				formIsValid = false;
				errors[index] = "Mot de passe non identique";
			}
			if (!formIsValid && !scroll) {
				scroll = true;
				if (this.inputs[index]) {
					this.inputs[index].scrollIntoView()
				}
			}
		}
		this.setState({errors});
		return formIsValid;
	}

	renderInfosItem(index, item) {
		let jsx;
		if (item.type == 'select' && item.values) {
			jsx = (
				<select 
					class="form-select"
					ref={() => {
						this.inputs[index] = {value: item.values[0]};
					}}
					onChange={(e) => {
						this.inputs[index] = {value: e.target.value};
					}}>
					{item.values.map((value) => {
						const selected = value == this.state.infos[index];
						if (selected) this.inputs[index] = {value};
						return (
							<option 
								value={value} 
								selected={selected}>
								{value}
							</option>
						)
					})}
				</select>
			);
		} else {
			jsx = (
				<input 
					type={item.type}
					name={item.name}
					class="form-control"
					id={item.label + "-input"}
					value={this.state.infos[index]}
					onChange={(e) => {
						let infos = this.state.infos;
						infos[index] = e.target.value;
						this.setState({infos: infos});
					}}
					readOnly={false}
					ref={(input) => {
						this.inputs[index] = input;
					}}
					onKeyPress={
						event => {
							if (event.key === "Enter")
								this.modifyUser();
						}
					}/>
			);
		}

		return (
			<div class="mb-4">
				<label 
					for={item.label + "-input"}
					class="form-label">
					{item.label}
				</label>
				{this.state.errors[index] && 
					<div class="alert alert-danger p-2" role="alert">
						{this.state.errors[index]}
					</div>
				}
				{jsx}
			</div>
		)
	}

	renderPasswordItem(index, item) {
		return (
			<div class="mb-4">
				<label 
					for={item.label + "-input"}
					class="form-label">
					{item.label}
				</label>
				{this.state.errors[index] && 
					<div class="alert alert-danger p-2" role="alert">
						{this.state.errors[index]}
					</div>
				}
				<input 
					type={item.type}
					name={item.name}
					class="form-control"
					id={item.label + "-input"}
					value={this.state.infos[index]}
					onChange={(e) => {
						let infos = this.state.infos;
						infos[index] = e.target.value;
						this.setState({infos: infos});
					}}
					readOnly={false}
					ref={(input) => {
						this.inputs[index] = input;
					}}
					onKeyPress={
						event => {
							if (event.key === "Enter")
								this.changePassword();
						}
					}/>
			</div>
		)
	}

	renderInfos() {
		const { infos, loading} = this.state;
		if (infos) return (
			<div class="box container box-md mt-5 p-3">
				<h2>{this.props.user.login}</h2>
				<hr/>
				<div>
				<form>
						<fieldset disabled={loading}>
						{Object.keys(PASSWORD_FORM).map((item) => this.renderPasswordItem(item, PASSWORD_FORM[item]))}
						</fieldset>
					</form>
						<div class="d-flex justify-content-center">
							<Button
								loading={loading}
								class="btn btn-primary m-1"
								onClick={() => this.changePassword()}
								title="Changer"
							/>
						</div>
				</div>
				<hr/>
				<div>
					<form>
						<fieldset disabled={loading}>
						{Object.keys(INFOS_FORM).map((item) => this.renderInfosItem(item, INFOS_FORM[item]))}
						</fieldset>
					</form>
					<div class="d-flex justify-content-center">
						<Button
							loading={loading}
							class="btn btn-primary m-1"
							onClick={() => this.modifyUser()}
							title="Modifier"
						/>
					</div>
				</div>
			</div>
		)

	}

	render() {
		return (
			<div class="mb-5">
				<Header/>
				{this.state.errors["serverError"] && 
					<div class="alert alert-danger p-2" role="alert">
					{this.state.errors["serverError"]}
					</div>
				}
				{this.renderInfos()}
			</div>
		)
	}

}

const mapStateToProps = state => {
  return {
    user: state.user.user,
  };
}

export default connect(mapStateToProps)(Profile);