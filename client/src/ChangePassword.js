import React, {Component} from "react";
import axios from 'axios'
import logo from './res/logo.png'

const FORM = {
    lgin: {
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
    newPassword: {
        mandatory: true,
        name: 'pass',
        type: 'password',
        label: "Mot de passe",
        minLength: 6,
    },
}


export default class ChangePassword extends Component {


    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            text: true
        }

        this.inputs = [];
    }

    sendRequest() {
        if (this.handleValidation()) {
            const params = new URLSearchParams();

            for (let index in Object.keys(FORM)) {
                index = Object.keys(FORM)[index];
                params.append(index, this.inputs[index].value);
            }

            params.append('login', this.inputLogin.value);
            params.append('password', this.inputPassword.value);
            params.append('newPassword', this.inputNewPassword.value);

            axios.post("http://localhost:8080/TwisterFinal/Reset", params)
                .then(res => {
                    if (res.data.code === undefined)
                        this.props.resetSuccess();
                    else {
                        let errors = {};
                        errors["serverError"] = res.data.message;
                        this.setState({
                            errors: errors
                        })
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
            }
        }

        this.setState({errors});
        return formIsValid;
    }


    handleValidation() {
        let errors = {};
        let formIsValid = true;

        //login
        if (this.inputLogin.value === "") {
            formIsValid = false;
            errors["login"] = "Login: Cannot be empty";
        }

        //password
        if (this.inputPassword.value === "") {
            formIsValid = false;
            errors["password"] = "Password: Cannot be empty";
        }

        //password
        if (this.inputNewPassword.value === "") {
            formIsValid = false;
            errors["newPassword"] = "Password: Cannot be empty";
        }
        else if (this.inputNewPassword.value.length < 6) {
            this.inputNewPassword.value = "";
            formIsValid = false;
            errors["newPassword"] = "Password: Too short, the minimum is 6 letters";
        }


        this.setState({errors: errors});
        return formIsValid;
    };


    render() {

        return (
            <div className="input_container">
                <div className="logos">
                    <a>
                        <img src={logo} onClick={() => this.props.signin()} alt=""/>
                    </a>
                </div>
                <div className="register">
                    <span className="errors">{this.state.errors["serverError"]}</span>

                    <span className="errors">{this.state.errors["login"]}</span>

                    <input
                        onKeyPress={
                            event => {
                                if (event.key === "Enter")
                                    this.sendRequest();
                            }
                        }
                        ref={(inputLogin) => {
                            this.inputLogin = inputLogin
                        }}
                        type="text" name="login" placeholder="Login ou adresse e-mail"/>

                    <span className="errors">{this.state.errors["password"]}</span>

                    <input
                        onKeyPress={
                            event => {
                                if (event.key === "Enter")
                                    this.sendRequest();
                            }
                        }
                        ref={(inputPassword) => {
                            this.inputPassword = inputPassword
                        }}
                        type="password" name="pass" placeholder="Ancien mot de passe"/>


                    <span className="errors">{this.state.errors["newPassword"]}</span>

                    <input
                        onKeyPress={
                            event => {
                                if (event.key === "Enter")
                                    this.sendRequest();
                            }
                        }
                        ref={(inputNewPassword) => {
                            this.inputNewPassword = inputNewPassword
                        }}
                        type="password" name="pass" placeholder="Nouveau mot de passe"/>


                    <div>
                        <input type="submit" name="inscription" value="Suivant" className="myButton"
                               onClick={() => this.sendRequest()}/>

                        <div className="links">
                            <a onClick={() => this.props.signin()}>Revenir à
                                l'authentification ? </a>

                        </div>
                    </div>
                </div>
            </div>

        );
    }


}
