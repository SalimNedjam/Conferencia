/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {Component} from "react";
import axios from 'axios';
import logo from './res/logo.png'


export default class Authentification extends Component {

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
                    this.props.login(res.data.key);
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

    render() {

        return (
            <div>

                <div className="input_container" id="connexion_main">
                    <div className="logos">
                        <a>
                            <img src={logo} alt=""/>
                        </a>
                    </div>
                    <div>
                        <span className="errors">{this.state.error}</span>

                        <input
                            onKeyPress={
                                event => {
                                    if (event.key === "Enter")
                                        this.checkValidity();
                                }
                            }
                            ref={(inputLogin) => {
                                this.inputLogin = inputLogin
                            }}
                            type="email" name="login" placeholder="Mail"/>
                        <input
                            onKeyPress={
                                event => {
                                    if (event.key === "Enter")
                                        this.checkValidity();
                                }
                            }
                            ref={(inputPassword) => {
                                this.inputPassword = inputPassword
                            }}
                            type="password" name="pwd" placeholder="Mot de passe"/>
                    </div>
                    <div>
                        <div className="Login">
                            <input type="submit" name="connexion" value="Suivant" className="myButton"
                                   onClick={() => this.checkValidity()}/>
                        </div>
                        <div className="submits">
                            <div className="links">
                                <div id="link1" className="link">
                                    <a onClick={() => this.props.signup()}>Pas encore inscrit
                                        ?</a>
                                </div>
                                <div id="link2" className="link">
                                    <a onClick={() => this.props.forgot()}>Mot de passe
                                        perdu</a>
                                </div>

                            </div>
                            <div>
                                <input type="checkbox" defaultChecked={this.state.checkbox}
                                       onChange={() => this.setState({checkbox: !this.state.checkbox})}/>
                                <span className="labels">Garder ma session active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


}
