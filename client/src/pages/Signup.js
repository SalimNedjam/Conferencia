import React, {Component} from "react";
import axios from 'axios';

const FORM = {
    mail: {
        mandatory: true,
        name: 'email',
        type: 'email',
        label: "Adresse mail",
    },
    password: {
        mandatory: true,
        name: 'pass',
        type: 'password',
        label: "Mot de passe",
        minLength: 6,
    },
    confirmPassword: {
        verify: 'password',
        mandatory: true,
        name: 'confirmPass',
        type: 'password',
        label: "Confirmation du mot de passe",
        minLength: 6,
    },
    title: {
        mandatory: true,
        name: 'title',
        type: 'select',
        values: ['Prof', 'Dr','Mr', 'Mrs', 'Ms'],
        label: "Titre",
    },
    prenom: {
        mandatory: true,
        name: 'firstname',
        type: 'text',
        label: "Prénom",
    },
    nom: {
        mandatory: true,
        name: 'lastname',
        type: 'text',
        label: "Nom",
    },
    institution: {
        mandatory: true,
        name: 'institution',
        type: 'text',
        label: "Institution",
    },
    address: {
        mandatory: true,
        name: 'address',
        type: 'text',
        label: "Adresse",
    },
    zip: {
        mandatory: true,
        name: 'zip',
        type: 'text',
        label: "Code postal",
    },
    city: {
        mandatory: true,
        name: 'city',
        type: 'text',
        label: "Ville",
    },
    country: {
        mandatory: true,
        name: 'country',
        type: 'text',
        label: "Pays",
    },
    phone: {
        mandatory: true,
        name: 'institution',
        type: 'text',
        label: "Téléphone",
    },
}

export default class Signup extends Component {


    constructor(props) {
        super(props);

        this.state = {
			errors: {},
			loading: false,
        };

        this.inputs = [];
    }

    createUser() {
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

            axios.post("http://localhost:8080/Project_war/CreateUser", params)
            .then(res => {
                if (res.data.code === undefined) {
                    window.location.href = '/login/ok';
                } else {
                    let errors = {};
                    errors["serverError"] = res.data.message;
                    this.setState({errors})
                }
            });
        }
    }

    checkForm() {
        let errors = {};
		let formIsValid = true;
		let scroll = false;

        for (let index in Object.keys(FORM)) {
            index = Object.keys(FORM)[index];
            let item = FORM[index];
            if (item.mandatory && this.inputs[index].value === "") {
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
                    ref={() => {
                        this.inputs[index] = {value: item.values[0]};
                    }}
                    onChange={(e) => {
                        this.inputs[index] = {value: e.target.value};
                    }}>
                    {item.values.map((value) => <option value={value}>{value}</option>)}
                </select>
          );
        } else {
            jsx = (
            <input 
                type={item.type}
                name={item.name}
                class="form-control"
                id={item.label + "-input"}
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

    render() {
        return (
			<div>
				<div class="container box box-sm mt-5 p-4 mb-5">
					
					<h1 class="mb-3">Inscription</h1>
					<p class="mb-4">
						Les champs obligatoires sont marqués par
						<span class="text-danger"> * </span>.
					</p>

					{this.state.errors["serverError"] && 
						<div class="alert alert-danger p-2" role="alert">
							{this.state.errors["serverError"]}
						</div>
					}

					{this.state.errors["email"] && 
						<div class="alert alert-danger p-2" role="alert">
							{this.state.errors["email"]}
						</div>
					}

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
								onClick={() => this.createUser()}
								class="btn btn-primary m-1">
								Inscription
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
						<button 
							type="button"
							name="connexion"
							disabled={this.state.loading}
							onClick={() => window.location.href = '/login'}
							class="btn btn-light m-1">
							J'ai déjà un compte
						</button>
					</div>
				</div>
			</div>
        )
    }

}
