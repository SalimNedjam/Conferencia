import React, {Component} from "react";
import Messages from "./Composants/Messages";
import PostMessage from "./Composants/PostMessage";
import axios from 'axios'
import ListFriend from "./Composants/ListFriend";
import {read_cookie} from "sfcookies";

export default class Accueil extends Component {

    constructor(props) {
        super(props);


        this.state = {
            data: null
        };


        this.componentDidMount = this.componentDidMount.bind(this);


    }


    componentDidMount() {
        const params = new URLSearchParams();

        params.append('key', read_cookie("key"));
        params.append('op', "friends");

        axios.get("http://localhost:8080/TwisterFinal/Messages?" + params)
            .then(res => {
                this.setState(() => {
                    return {data: res.data.Array};
                });

            });


    }

    render() {

        const {data} = this.state;

        return (

            <div className="Accueil">
                <div className="body">
                    <ListFriend getuserprofile={this.props.getuserprofile}
                    />
                    <div className="section">
                        <PostMessage reload={this.componentDidMount}/>

                        {
                            data &&
                            <div className="article_container">
                                {this.state.data.map((article) => (

                                    <Messages
                                        likes={article.likes}
                                        idUser={this.props.idUser}
                                        date={article.date}
                                        id={article.author.user_id}
                                        getuserprofile={this.props.getuserprofile}
                                        name={article.author.prenom}
                                        lastname={article.author.nom}
                                        login={article.author.login}
                                        content={article.message}
                                        listComment={article.comments}
                                        publication={article.picture}
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
