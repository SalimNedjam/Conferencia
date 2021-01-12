import React, {Component} from "react";
import Messages from "./Composants/Messages";
import "./Styles/Profile.css";
import ProfileHeader from "./Composants/ProfileHeader";
import axios from 'axios'
import PostMessage from "./Composants/PostMessage";
import Stat from "./Composants/Stat";
import {read_cookie} from "sfcookies";

export default class MyProfile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: null
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.reload = this.reload.bind(this);

    }


    componentDidMount() {
        this.reload();

    }

    reload() {
        this.setState({
            data: null
        });
        const params = new URLSearchParams();

        params.append('key', read_cookie("key"));
        params.append('op', "list");
        params.append('idUser', this.props.idUser);


        axios.get("http://localhost:8080/TwisterFinal/Messages?" + params)
            .then(res => {
                this.setState({
                    data: res.data.Array
                });


            });
    }


    render() {
        const data = this.state.data;
        return (

            <div className="Profile">
                {

                    <ProfileHeader
                        reload={this.reload}
                        holder={true}
                        id={this.props.idUser}
                        nom={this.props.nomUser}
                        prenom={this.props.prenomUser}
                        login={this.props.loginUser}
                    />

                }

                <div className="body">
                    {
                        data &&
                        <Stat getuserprofile={this.props.getuserprofile} twists={data.length}/>

                    }
                    <div className="section">
                        {

                            <PostMessage reload={this.componentDidMount}/>

                        }
                        {
                            data &&
                            <div className="article_container">
                                {this.state.data.map((article) => (

                                    <Messages
                                        date={article.date}
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
                                        likes={article.likes}
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
