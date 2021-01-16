import React, {Component} from "react";
import Navigation from "./Navigation";
import './Styles/MainPage.css'
import './Styles/Acceuil.css'
import {bake_cookie, read_cookie} from 'sfcookies';
import axios from 'axios'

export default class MainPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            key: "",
            Userlogin: "",
            Userid: "",
            Usernom: "",
            Userprenom: "",
            showLogin: "",
            showId: "",
            showNom: "",
            showPrenom: "",
            connected: false,
            current: "loading",
            searchUser: null,
            searchMessage: null
        };

        this.getConnected = this.getConnected.bind(this);
        this.setLogout = this.setLogout.bind(this);
        this.signIn = this.signIn.bind(this);
        this.signUp = this.signUp.bind(this);
        this.forgot = this.forgot.bind(this);
        this.forgotSuccess = this.forgotSuccess.bind(this);
        this.getProfile = this.getProfile.bind(this);
        this.getAccueil = this.getAccueil.bind(this);
        this.getUserProfile = this.getUserProfile.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.resetSuccess = this.resetSuccess.bind(this);
        this.doSearch = this.doSearch.bind(this);


    }

    componentDidMount() {
        const keySession = read_cookie("key");
        if (keySession !== "") {
            const params = new URLSearchParams();
            params.append('key', read_cookie("key"));
            axios.post("http://localhost:8080/Project_war/Login", params)
                .then(res => {
                    if (res.data.code === undefined) {
                        this.setState({
                            key: keySession,
                            Userlogin: res.data.login,
                            Userid: res.data.user,
                            Usernom: res.data.nom,
                            Userprenom: res.data.prenom,
                            connected: true,
                            current: "accueil",
                        });
                    }

                })
        }
    }

    componentWillUpdate() {
        const keySession = read_cookie("key");
        if (keySession !== "") {
            const params = new URLSearchParams();
            params.append('key', read_cookie("key"));
            axios.post("http://localhost:8080/Project_war/Login", params)
                .then(res => {
                    if (res.data.code !== undefined) {
                        bake_cookie("key", "");
                        this.setState({
                            connected: false,
                            current: "signin",
                        });
                    }
                })
        }
    }

    render() {

        return (<div className="MainPage">
            <Navigation
                login={this.getConnected}
                logout={this.setLogout}
                signin={this.signIn}
                signup={this.signUp}
                forgot={this.forgot}
                getprofile={this.getProfile}
                getaccueil={this.getAccueil}
                forgotSuccess={this.forgotSuccess}
                resetSuccess={this.resetSuccess}
                getuserprofile={this.getUserProfile}
                changePassword={this.changePassword}
                doSearch={this.doSearch}

                isConnected={this.state.connected}
                current={this.state.current}

                idShow={this.state.showId}
                loginShow={this.state.showLogin}
                nomShow={this.state.showNom}
                prenomShow={this.state.showPrenom}

                idUser={this.state.Userid}
                loginUser={this.state.Userlogin} i
                nomUser={this.state.Usernom}
                prenomUser={this.state.Userprenom}


                searchUser={this.state.searchUser}
                searchMessage={this.state.searchMessage}


            />
        </div>);


    }

    getConnected(key) {
        bake_cookie("key", key);
        this.componentDidMount();

    }

    getUserProfile(id, login, nom, prenom) {
        if (this.state.connected) {
            if (id === this.state.Userid)
                this.setState({
                    current: "profile",
                    showLogin: login,
                    showId: id,
                    showNom: nom,
                    showPrenom: prenom,
                });
            else
                this.setState({
                    current: "profileShow",
                    showLogin: login,
                    showId: id,
                    showNom: nom,
                    showPrenom: prenom,
                });

        }

    }

    getProfile() {
        if (this.state.connected)
            this.setState({
                current: "profile"
            });
    }

    doSearch(searchUser, searchMessage) {
        if (this.state.connected)
            this.setState({
                current: "search",
                searchUser: searchUser,
                searchMessage: searchMessage
            });
    }

    getAccueil() {
        if (this.state.connected)
            this.setState({
                current: "accueil"
            });
    }

    setLogout() {
        bake_cookie("key", "");
        this.setState({
            key: "",
            Userlogin: "",
            Userid: "",
            Usernom: "",
            Userprenom: "",
            connected: false,
            current: "signin"
        });

    }

    signIn() {
        if (!this.state.connected)
            this.setState({
                current: "signin"
            });
    }

    signUp() {
        if (!this.state.connected)
            this.setState({
                current: "register"
            });
    }

    forgot() {
        if (!this.state.connected)
            this.setState({
                current: "forgot"
            });
    }

    forgotSuccess() {
        if (!this.state.connected)
            this.setState({
                current: "forgotSuccess"
            });
    }

    resetSuccess() {
        if (!this.state.connected)
            this.setState({
                current: "resetSuccess"
            });
    }

    changePassword() {
        if (!this.state.connected)
            this.setState({
                current: "changePassword"
            });
    }


}
