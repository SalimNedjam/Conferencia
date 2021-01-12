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


        if (this.handleValidation()) {
            const formData = new URLSearchParams();
            formData.append('email', this.inputEmail.value);

            axios.get("http://localhost:8080/TwisterFinal/Reset?" + formData);
            this.props.forgotSuccess()
        }

    }

    handleValidation() {
        let errors = {};
        let formIsValid = true;

        //Email
        if (this.inputEmail.value === "") {
            formIsValid = false;
            errors["email"] = "Email: Cannot be empty";
        }
        else {
            let lastAtPos = this.inputEmail.value.lastIndexOf('@');
            let lastDotPos = this.inputEmail.value.lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && this.inputEmail.value.indexOf('@@') == -1 && lastDotPos > 2 && (this.inputEmail.value.length - lastDotPos) > 2)) {
                formIsValid = false;
                errors["email"] = "Email: Is not valid";
            }
        }

        this.setState({errors: errors});
        return formIsValid;
    };

    render() {
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
