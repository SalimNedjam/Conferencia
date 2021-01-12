import React, {Component} from "react";
import ItemFriend from "./ItemFriend";
import axios from 'axios'
import {read_cookie} from "sfcookies";

export default class ListFriend extends Component {

    constructor(props) {
        super(props);

        this.state = {
            followers: null,
            following: null
        }

    }

    componentDidMount() {
        const params1 = new URLSearchParams();

        params1.append('key', read_cookie("key"));
        params1.append('op', "follower");

        axios.get("http://localhost:8080/TwisterFinal/Friends?" + params1)
            .then(res => {
                this.setState(() => {
                    return {followers: res.data.Array};
                });

            });


        const params2 = new URLSearchParams();

        params2.append('key', read_cookie("key"));
        params2.append('op', "following");

        axios.get("http://localhost:8080/TwisterFinal/Friends?" + params2)
            .then(res => {
                this.setState(() => {
                    return {following: res.data.Array};
                });

            });
    }

    render() {

        const {followers, following} = this.state;

        return (<div className="ListAmis">
            <div className="headAmis">Liste d'abonnés</div>
            {
                (followers && followers.length > 0) ?
                    <div className="list">
                        {this.state.followers.map((article) => (
                            <ItemFriend
                                getuserprofile={this.props.getuserprofile}
                                nom={article.nom}
                                login={article.login}
                                prenom={article.prenom}
                                id={article.id_user}
                                key={article.id_user}
                            />
                        ))}
                    </div> :
                    <div className="noRes">Aucun abonné</div>
            }

            <div className="headAmis">Liste d'abonnements</div>
            {
                (following && following.length > 0) ?
                    <div className="list">
                        {this.state.following.map((article) => (
                            <ItemFriend
                                getuserprofile={this.props.getuserprofile}
                                nom={article.nom}
                                login={article.login}
                                prenom={article.prenom}
                                id={article.id_user}
                                key={article.id_user}
                            />
                        ))}
                    </div>
                    :
                    <div className="noRes">Aucun abonnement</div>

            }
        </div>);


    }


}
