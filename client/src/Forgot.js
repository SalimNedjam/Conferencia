import React, {Component} from "react";
import axios from 'axios'
import logo from './res/logo.png'

export default class Forgot extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: {},

        }
    }

    sendRequest() {
        if (this.checkForm()) {
            const formData = new URLSearchParams();
            formData.append('email', this.inputEmail.value);

            axios.get("http://localhost:8080/TwisterFinal/Reset?" + formData);
            this.props.forgotSuccess()
        }

    }

    checkForm() {
        let errors = {};
        let formIsValid = true;

        if (this.inputEmail.value === "") {
            formIsValid = false;
            errors["email"] = "Le champs ne peut être vide";
        }

        this.setState({errors});
        return formIsValid;
    };

    render() {
        return (
            <div class="container box box-auth mt-5 p-4 mb-5">
                <h2 class="mb-3">Mot de passe oublié</h2>
                
                {this.state.errors["email"] && 
                    <div class="alert alert-danger p-2" role="alert">
                        {this.state.errors["email"]}
                    </div>
                }

                <div class="mb-3">
                    <label 
                        class="form-check-label" 
                        for="emailInput">
                        Adresse e-mail
                    </label>
                    <input 
                        type="email" 
                        class="form-control"
                        ref={(inputEmail) => {
                            this.inputEmail = inputEmail
                        }}
                        onKeyPress={
                            event => {
                                if (event.key === "Enter")
                                    this.sendRequest();
                            }
                        }
                        id="emailInput"/>
                </div>

                <div class="d-flex justify-content-center">
                    <button 
                        type="button"
                        name="singup"
                        onClick={() => this.props.signin()}
                        class="btn btn-light m-1">
                        Annuler
                    </button>
                    <button 
                        type="button"
                        name="change"
                        onClick={() => this.props.changePassword()}
                        class="btn btn-light m-1">
                        Changer de mot de passe
                    </button>
                    <button
                        type="button"
                        name="connexion"
                        onClick={() => this.sendRequest()}
                        class="btn btn-primary m-1">
                        Suivant
                    </button>
                </div>
            </div>
        );

        return (
            <div className="Forgot">
                <div className="input_container">
                    <div className="logos">
                        <a>
                            <img src={logo} onClick={() => this.props.signin()} alt=""/>
                        </a>
                    </div>
                    <div>
                        <span className="errors">{this.state.errors["email"]}</span>

                        <input
                            onKeyPress={
                                event => {
                                    if (event.key === "Enter")
                                        this.sendRequest();
                                }
                            }
                            ref={(inputEmail) => {
                                this.inputEmail = inputEmail
                            }}
                            type="text" name="login" placeholder="Adresse e-mail"/>

                    </div>
                    <div>
                        <input type="submit" name="connexion" value="Suivant" className="myButton"
                               onClick={() => this.sendRequest()}/>
                        <div className="links">
                            <a onClick={() => this.props.signin()}>Revenir à
                                l'authentification</a>
                            <div id="link3" className="link">
                                <a className="ChangePasswordLink" onClick={() => this.props.changePassword()}>Changer de
                                    mot de passe</a>
                            </div>

                        </div>

                    </div>
                </div>


            </div>


        );

    }


}
