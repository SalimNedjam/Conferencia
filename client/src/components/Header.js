import React, {Component} from "react";
import logo from '../res/logo.png'
import axios from 'axios'
import {read_cookie} from "sfcookies";

export default class Header extends Component {

   
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
      return (
        <nav class="navbar navbar-light bg-light">
          <div class="container-fluid">
            <a class="navbar-brand">Conferentia</a>
            <div class="d-flex">
              <div class="p-2 d-flex align-items-center">
                {this.props.prenomUser} {this.props.nomUser}
              </div>
              <button 
                class="btn btn-outline-primary" 
                onClick={() => this.disconnect()}
                type="submit">
                Déconnexion
              </button>
            </div>
          </div>
        </nav>
      )
    }

}
