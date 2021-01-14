import React, {Component} from "react";
import axios from 'axios'

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
        label: "Confirmation de mot de passe",
        minLength: 6,
    },
    nom: {
        mandatory: true,
        name: 'lastname',
        type: 'text',
        label: "Nom",
    },
    prenom: {
        mandatory: true,
        name: 'firstname',
        type: 'text',
        label: "Prénom",
    },
}

export default class Register extends Component {


    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            text: true
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
                }
            }

            axios.post("http://localhost:8080/Project_war/CreateUser", params)
            .then(res => {
                if (res.data.code === undefined) {
                    this.props.signin();
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
        }

        this.setState({errors});
        return formIsValid;
    }

    renderItem(index, item) {
        return (
            <div class="mb-4">
                <label 
                    for={item.label + "-input"}
                    class="form-label">
                    {item.label}
                    {item.mandatory &&
                        <span class="text-danger"> *</span>
                    }

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
                    ref={(input) => {
                        this.inputs[index] = input;
                    }}
                    onKeyPress={
                        event => {
                            if (event.key === "Enter")
                                this.createUser();
                        }
                    }/>
            </div>
        )
    }

    render() {
        return (
            <div class="container box box-auth mt-5 p-4 mb-5">
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
                    {Object.keys(FORM).map((item) => this.renderItem(item, FORM[item]))}
                </form>
                <div class="d-flex justify-content-center">
                    <button
                        type="button"
                        name="connexion"
                        onClick={() => this.createUser()}
                        class="btn btn-primary m-1">
                        Inscription
                    </button>
                    <button 
                        type="button"
                        name="connexion"
                        onClick={() => this.props.signin()}
                        class="btn btn-light m-1">
                        J'ai déjà un compte
                    </button>
                </div>
            </div>
        )
    }

}
