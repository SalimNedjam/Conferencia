import React, {Component} from "react";
import axios from 'axios'
import logo from './res/logo.png'

export default class Register extends Component {


    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            text: true
        }


    }

    createUser() {
        if (this.handleValidation()) {
            const params = new URLSearchParams();
            params.append('password', this.inputPassword.value);
            params.append('mail', this.inputEmail.value);
            params.append('nom', this.inputLastname.value);
            params.append('prenom', this.inputFirsname.value);
            params.append('title', this.inputTitle.value);
            params.append('institution', this.inputInstitution.value);
            params.append('address', this.inputAddress.value);
            params.append('zip', this.inputZip.value);
            params.append('city', this.inputCity.value);
            params.append('country', this.inputCountry.value);
            params.append('phone', this.inputPhone.value);


            axios.post("http://localhost:8080/Project_war/CreateUser", params)
                .then(res => {
                    if (res.data.code === undefined)
                        this.props.signin();
                    else {
                        let errors = {};
                        errors["serverError"] = res.data.message;
                        this.setState({
                            errors: errors
                        })
                    }

                });
        }
        console.log(this.state.errors)


    }


    handleValidation() {
        let errors = {};
        let formIsValid = true;

        if (this.inputTitle.value === "") {
            formIsValid = false;
            errors["title"] = "Title: Cannot be empty";
        }

        //firstname
        if (this.inputFirsname.value === "") {
            formIsValid = false;
            errors["firstname"] = "Prenom: Cannot be empty";
        }
        else {
            if (!this.inputFirsname.value.match(/^[a-zA-Z]+$/)) {
                this.inputFirsname.value = "";

                formIsValid = false;
                errors["firstname"] = "Prenom: Only letters";
            }
        }


        //password
        if (this.inputPassword.value === "") {
            formIsValid = false;
            errors["password"] = "Password: Cannot be empty";
        }
        else {
            if (this.inputPassword.value.length < 5) {
                this.inputPassword.value = "";

                formIsValid = false;
                errors["password"] = "Password: Too short, the minimum is 6 letters";
            }
        }

        //lastname
        if (this.inputLastname.value === "") {
            formIsValid = false;
            errors["lastname"] = "Nom: Cannot be empty";
        }
        else {
            if (!this.inputLastname.value.match(/^[a-zA-Z]+$/)) {
                this.inputLastname.value = "";

                formIsValid = false;
                errors["lastname"] = "Nom: Only letters";
            }
        }

        if (this.inputInstitution.value === "") {
            formIsValid = false;
            errors["institution"] = "Institution: Cannot be empty";
        }

        if (this.inputAddress.value === "") {
            formIsValid = false;
            errors["address"] = "Address: Cannot be empty";
        }

        if (this.inputZip.value === "") {
            formIsValid = false;
            errors["zip"] = "Zip: Cannot be empty";
        }

        if (this.inputCity.value === "") {
            formIsValid = false;
            errors["city"] = "City: Cannot be empty";
        }

        if (this.inputCountry.value === "") {
            formIsValid = false;
            errors["country"] = "Country: Cannot be empty";
        }

        if (this.inputPhone.value === "") {
            formIsValid = false;
            errors["phone"] = "Phone: Cannot be empty";
        }



        //Email
        if (this.inputEmail.value === "") {
            formIsValid = false;
            errors["email"] = "Email: Cannot be empty";
        }
        else {
            let lastAtPos = this.inputEmail.value.lastIndexOf('@');
            let lastDotPos = this.inputEmail.value.lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && this.inputEmail.value.indexOf('@@') == -1 && lastDotPos > 2 && (this.inputEmail.value.length - lastDotPos) > 2)) {
                this.inputEmail.value = "";

                formIsValid = false;
                errors["email"] = "Email: Is not valid";
            }
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
                    <span className="errors">{this.state.errors["email"]}</span>

                    <input
                        onKeyPress={
                            event => {
                                if (event.key === "Enter")
                                    this.createUser();
                            }
                        }
                        ref={(inputEmail) => {
                            this.inputEmail = inputEmail
                        }}
                        type="email" name="email" placeholder="Adresse e-mail"/>

                    
                    <span className="errors">{this.state.errors["password"]}</span>

                    <input
                        onKeyPress={
                            event => {
                                if (event.key === "Enter")
                                    this.createUser();
                            }
                        }
                        ref={(inputPassword) => {
                            this.inputPassword = inputPassword
                        }}
                        type="password" name="pass" placeholder="Mot de passe"/>
                        
                    <span className="errors">{this.state.errors["title"]}</span>

                    <input
                        onKeyPress={
                            event => {
                                if (event.key === "Enter")
                                    this.createUser();
                            }
                        }
                        ref={(inputTitle) => {
                            this.inputTitle = inputTitle
                        }}
                        type="text" name="title" placeholder="Title"/>

                    
                    <span className="errors">{this.state.errors["firstname"]}</span>

                    <input
                        onKeyPress={
                            event => {
                                if (event.key === "Enter")
                                    this.createUser();
                            }
                        }
                        ref={(inputFirsname) => {
                            this.inputFirsname = inputFirsname
                        }}
                        type="text" name="firstname" placeholder="Nom"/>

                    <span className="errors">{this.state.errors["lastname"]}</span>

                    <input
                        onKeyPress={
                            event => {
                                if (event.key === "Enter")
                                    this.createUser();
                            }
                        }
                        ref={(inputLastname) => {
                            this.inputLastname = inputLastname
                        }}
                        type="text" name="lastname" placeholder="Pr&eacute;noms"/>

                        <span className="errors">{this.state.errors["institution"]}</span>

                    <input
                        onKeyPress={
                            event => {
                                if (event.key === "Enter")
                                    this.createUser();
                            }
                        }
                        ref={(inputInstitution) => {
                            this.inputInstitution = inputInstitution
                        }}
                        type="text" name="institution" placeholder="Institution"/>

                    <span className="errors">{this.state.errors["address"]}</span>

                    <input
                        onKeyPress={
                            event => {
                                if (event.key === "Enter")
                                    this.createUser();
                            }
                        }
                        ref={(inputAddress) => {
                            this.inputAddress = inputAddress
                        }}
                        type="text" name="address" placeholder="Address"/>

                    <span className="errors">{this.state.errors["zip"]}</span>

                    <input
                        onKeyPress={
                            event => {
                                if (event.key === "Enter")
                                    this.createUser();
                            }
                        }
                        ref={(inputZip) => {
                            this.inputZip = inputZip
                        }}
                        type="text" name="zip" placeholder="Zip"/>
                    
                    <span className="errors">{this.state.errors["city"]}</span>

                    <input
                        onKeyPress={
                            event => {
                                if (event.key === "Enter")
                                    this.createUser();
                            }
                        }
                        ref={(inputCity) => {
                            this.inputCity = inputCity
                        }}
                        type="text" name="city" placeholder="City"/>
                    
                    <span className="errors">{this.state.errors["country"]}</span>

                    <input
                        onKeyPress={
                            event => {
                                if (event.key === "Enter")
                                    this.createUser();
                            }
                        }
                        ref={(inputCountry) => {
                            this.inputCountry = inputCountry
                        }}
                        type="text" name="country" placeholder="Country"/>
                    
                    <span className="errors">{this.state.errors["phone"]}</span>

                    <input
                        onKeyPress={
                            event => {
                                if (event.key === "Enter")
                                    this.createUser();
                            }
                        }
                        ref={(inputPhone) => {
                            this.inputPhone = inputPhone
                        }}
                        type="text" name="phone" placeholder="Phone"/>
                    

                    
                </div>
                <div>
                    <input type="submit" name="inscription" value="Suivant" className="myButton"
                           onClick={() => this.createUser()}/>

                    <div className="links">
                        <a onClick={() => this.props.signin()}>Vous avez un compte ? </a>

                    </div>
                </div>
            </div>

        );
    }


}
