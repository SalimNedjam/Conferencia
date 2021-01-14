import React, {Component} from "react";
import Accueil from "./Accueil";
import Authentification from "./Authentification";
import Register from "./Register";
import Forgot from "./Forgot";
import MyProfile from "./MyProfile";
import Success from "./Success";
import Header from "./components/Header";
import ShowProfile from "./ShowProfile";
import {read_cookie} from "sfcookies";
import ChangePassword from "./ChangePassword";
import SearchPage from "./SearchPage";

export default class Navigation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            connected: this.props.isConnected,
            current: this.props.current,

            key: read_cookie("key"),

            Userid: this.props.idUser,
            Userlogin: this.props.loginUser,
            Usernom: this.props.nomUser,
            Userprenom: this.props.prenomUser,

            showId: this.props.idShow,
            showLogin: this.props.loginShow,
            showNom: this.props.nomShow,
            showPrenom: this.props.prenomShow,

            searchUser: this.props.searchUser,
            searchMessage: this.props.searchMessage

        }


    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            connected: nextProps.isConnected,
            current: nextProps.current,
            key: read_cookie("key"),
            Userid: nextProps.idUser,
            Userlogin: nextProps.loginUser,
            Usernom: nextProps.nomUser,
            Userprenom: nextProps.prenomUser,


            showId: nextProps.idShow,
            showLogin: nextProps.loginShow,
            showNom: nextProps.nomShow,
            showPrenom: nextProps.prenomShow,

            searchUser: nextProps.searchUser,
            searchMessage: nextProps.searchMessage

        });


    }

    render() {
        const header = <Header
            doSearch={this.props.doSearch}
            logout={this.props.logout}
            getprofile={this.props.getprofile}
            idUser={this.state.Userid}
            nomUser={this.state.Usernom}
            prenomUser={this.state.Userprenom}
            loginUser={this.state.Userlogin}
            getaccueil={this.props.getaccueil}

        />;

        if (this.state.connected === true) {
            if (this.state.current === ("accueil")) {
                return (<nav>
                    {header}
                    <Accueil
                        getuserprofile={this.props.getuserprofile}
                        logout={this.props.logout}
                        getprofile={this.props.getprofile}
                        idUser={this.state.Userid}
                        Nom={this.state.Usernom}
                        Prenom={this.state.Userprenom}
                        loginUser={this.state.Userlogin}
                        getaccueil={this.state.getaccueil}


                    />
                </nav>)
            }
            else if (this.state.current === ("profile")) {
                return (<nav>
                    {header}

                    <MyProfile
                        getuserprofile={this.props.getuserprofile}
                        logout={this.props.logout}
                        getprofile={this.props.getprofile}
                        getaccueil={this.props.getaccueil}
                        current={this.state.current}
                        idUser={this.state.Userid}
                        nomUser={this.state.Usernom}
                        prenomUser={this.state.Userprenom}
                        loginUser={this.state.Userlogin}


                    />

                </nav>)
            }
            else if (this.state.current === ("profileShow")) {
                return (<nav>
                    {header}

                    <ShowProfile
                        getuserprofile={this.props.getuserprofile}
                        logout={this.props.logout}
                        getprofile={this.props.getprofile}
                        getaccueil={this.props.getaccueil}
                        current={this.state.current}
                        idUser={this.state.Userid}
                        idShow={this.state.showId}
                        nomShow={this.state.showNom}
                        prenomShow={this.state.showPrenom}
                        loginShow={this.state.showLogin}
                    />

                </nav>)
            }
            else if (this.state.current === ("search")) {
                return (<nav>
                    {header}
                    <SearchPage
                        getuserprofile={this.props.getuserprofile}
                        logout={this.props.logout}
                        getprofile={this.props.getprofile}
                        idUser={this.state.Userid}
                        Nom={this.state.Usernom}
                        Prenom={this.state.Userprenom}
                        loginUser={this.state.Userlogin}
                        getaccueil={this.state.getaccueil}
                        searchUser={this.state.searchUser}
                        searchMessage={this.state.searchMessage}


                    />
                </nav>)
            }


        }
        else {

            if (this.state.current === ("signin")) {
                return (<nav>

                    <Authentification login={this.props.login}
                                      signup={this.props.signup} forgot={this.props.forgot}/>
                </nav>)
            }
            else if (this.state.current === ("register")) {
                return (<nav>
                    <Register signin={this.props.signin}/>
                </nav>)
            }
            else if (this.state.current === ("forgot")) {
                return (<nav>
                    <Forgot changePassword={this.props.changePassword} signin={this.props.signin}
                            forgotSuccess={this.props.forgotSuccess}/>
                </nav>)
            }
            else if (this.state.current === ("forgotSuccess")) {
                return (<nav>
                    <Success message={"L'email de récupération a été envoyé avec succès."} signin={this.props.signin}/>
                </nav>)
            }
            else if (this.state.current === ("changePassword")) {
                return (<nav>
                    <ChangePassword signin={this.props.signin} resetSuccess={this.props.resetSuccess}/>
                </nav>)
            }
            else if (this.state.current === ("resetSuccess")) {
                return (<nav>
                    <Success message={"Votre mot de passe a été changé avec succès."} signin={this.props.signin}/>
                </nav>)
            }


        }


    }


}
