import React, {Component} from "react";
import Search from "./Search";
import logo from '../res/logo.png'
import '../Styles/Head.css'
import axios from 'axios'
import {read_cookie} from "sfcookies";
import logo2 from '../res/logo2.png'
import logo3 from '../res/logo3.png'

export default class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            file: logo,
        };

    }

    componentDidMount() {
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();
    }

    resize() {
        if (window.innerWidth > 700) {
            this.setState({file: logo});

        }
        else if (window.innerWidth > 600) {
            this.setState({file: logo2});

        }
        else {
            this.setState({file: logo3});

        }

    }

    disconnect() {

        const params = new URLSearchParams();
        params.append('key', read_cookie("key"));

        axios.post("http://localhost:8080/Project_war/Logout", params)
            .then(() => {
                    this.props.logout()

                }
            );


    }

    render() {


        return (<div className="Head">
            <div className="logo">
                <a onClick={() => this.props.getaccueil()}>
                    <img src={this.state.file} alt=""/>
                </a>
            </div>
            <div className="liens">
                <a className="separatedLink"
                   onClick={() => this.props.getprofile()}>{this.props.prenomUser} {this.props.nomUser}</a>
                <a onClick={() => this.disconnect()}>Déconnexion</a>
            </div>
        </div>);


    }


}
