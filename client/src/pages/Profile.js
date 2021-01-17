import React, {Component} from "react";
import {connect} from "react-redux";

import {read_cookie} from 'sfcookies';
import axios from 'axios';

import Header from '../components/Header';

const FORM = {
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
			console.log(res.data);
			}
		}
		);
	}

	modifyUser() {
		if (this.checkForm()) {
            const params = new URLSearchParams();
        
            for (let index in Object.keys(FORM)) {
                index = Object.keys(FORM)[index];
                if (!FORM[index].verify) {
                    params.append(index, this.inputs[index].value);
                    console.log(this.inputs[index].value);
                }
			}
			
			this.setState({loading: true});

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

	checkForm() {
		let errors = {};
		let formIsValid = true;
		let scroll = false;

		for (let index in Object.keys(FORM)) {
			index = Object.keys(FORM)[index];
			let item = FORM[index];
			if (this.inputs[index].value === "") {
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
			} else if (item.verify && this.inputs[index].value !== this.inputs[item.verify].value) {
				this.inputs[item.verify].value = "";
				this.inputs[index].value = "";
				formIsValid = false;
				errors[item.verify] = "Mot de passe non identique";
			}
			if (!formIsValid && !scroll) {
				scroll = true;
				this.inputs[index].scrollIntoView()
			}
		}
		this.setState({errors});
		return formIsValid;
	}

	renderItem(index, item) {
		let jsx;
		if (item.type == 'select' && item.values) {
			jsx = (
				<select 
					class="form-select"
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
								this.createUser();
						}
					}/>
			);
		}

		return (
			<div class="mb-4">
				<label 
					for={item.label + "-input"}
					class="form-label">
					{item.mandatory &&
						<span class="text-danger">* </span>
					}
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

	renderInfos() {
		const { infos } = this.state;
		if (infos) return (
			<div class="box container box-md mt-5 p-3">
				<h2>{this.props.user.login}</h2>
				<hr/>
				<form>
					<fieldset disabled={this.state.loading}>
					{Object.keys(FORM).map((item) => this.renderItem(item, FORM[item]))}
					</fieldset>
				</form>
				<div class="d-flex justify-content-center">
					{!this.state.loading &&
					<button
						type="button"
						name="connexion"
						onClick={() => this.modifyUser()}
						class="btn btn-primary m-1">
						Modifier
					</button>
					}	
					{this.state.loading && 
					<button
						type="button"
						name="connexion"
						disabled
						class="btn btn-primary m-1">
						<div class="d-flex align-items-center">
						<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
						&nbsp;Chargement...
						</div>
					</button>
					}
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