import React, {Component} from "react";
import Messages from "./Composants/Messages";
import "./Styles/Profile.css";
import ProfileHeader from "./Composants/ProfileHeader";
import axios from 'axios'
import Stat from "./Composants/Stat";
import {read_cookie} from "sfcookies";

export default class ShowProfile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: null,
            isFriend: false,
            isRequested: false,
            idShow: this.props.idShow,
            nomShow: this.props.nomShow,
            prenomShow: this.props.prenomShow,
            loginShow: this.props.loginShow,


        };


        this.componentDidMount = this.componentDidMount.bind(this);

    }

    componentDidMount() {

        this.getIsFriend();
        this.loadData();


    }

    getIsFriend() {
        const params3 = new URLSearchParams();

        params3.append('key', read_cookie("key"));
        params3.append('op', "requested");
        params3.append('id', this.state.idShow);


        axios.post("http://localhost:8080/TwisterFinal/Friends?", params3)
            .then(res => {
                this.setState({
                    isFriend: res.data.isFriend,
                    isRequested: res.data.isRequested

                })
            });

    }


    loadData() {
        const params = new URLSearchParams();

        params.append('key', read_cookie("key"));
        params.append('op', "list");
        params.append('idUser', this.state.idShow);


        axios.get("http://localhost:8080/TwisterFinal/Messages?" + params)
            .then(res => {
                this.setState(() => {
                    return {data: res.data.Array};
                });

            });
    }

    componentWillReceiveProps(nextProps) {
        this.getIsFriend();

        const params = new URLSearchParams();

        params.append('key', read_cookie("key"));
        params.append('op', "list");
        params.append('idUser', nextProps.idShow);
        this.setState({
            idShow: nextProps.idShow,
            nomShow: nextProps.nomShow,
            prenomShow: nextProps.prenomShow,
            loginShow: nextProps.loginShow,
        });

        axios.get("http://localhost:8080/TwisterFinal/Messages?" + params)
            .then(res => {
                this.setState({
                    data: res.data.Array,
                    idShow: nextProps.idShow,
                    nomShow: nextProps.nomShow,
                    prenomShow: nextProps.prenomShow,
                    loginShow: nextProps.loginShow,
                });

            });

    }


    render() {


        return (

            <div className="Profile">
                {
                    <ProfileHeader
                        id={this.state.idShow}
                        prenom={this.state.prenomShow}
                        nom={this.state.nomShow}
                        login={this.state.loginShow}
                    />

                }
                <div className="body">
                    {
                        this.state.data &&
                        <Stat isFriend={this.state.isFriend} isRequested={this.state.isRequested}
                              idShow={this.state.idShow} twists={this.state.data.length}/>
                    }
                    <div className="section">

                        {
                            this.state.data && this.state.isFriend &&
                            <div className="article_container">
                                {this.state.data.map((article) => (

                                    <Messages
                                        date={article.date}
                                        likes={article.likes}
                                        idUser={this.props.idUser}
                                        id={article.author.user_id}
                                        getuserprofile={this.props.getuserprofile}
                                        name={article.author.prenom}
                                        lastname={article.author.nom}
                                        login={article.author.login}
                                        publication={article.picture}
                                        content={article.message}
                                        listComment={article.comments}
                                        messageId={article.message_id}
                                        key={article.message_id}
                                        reload={this.componentDidMount}


                                    />

                                ))}

                            </div>
                        }
                    </div>
                </div>
            </div>


        );

    }


}
