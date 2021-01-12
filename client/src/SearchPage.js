import React, {Component} from "react";
import Messages from "./Composants/Messages";
import ListSearch from "./Composants/ListSearch";

export default class SearchPage extends Component {

    constructor(props) {
        super(props);


        this.state = {
            searchUsers: this.props.searchUser,
            searchMessage: this.props.searchMessage

        };

    }


    componentWillReceiveProps(nextProps) {
        this.setState({
            searchUsers: nextProps.searchUser,
            searchMessage: nextProps.searchMessage


        })


    }

    render() {

        return (

            <div className="Accueil">
                <div className="body">
                    {
                        <ListSearch searchUser={this.state.searchUsers} getuserprofile={this.props.getuserprofile}
                        />
                    }
                    <div className="section">

                        {

                            (this.state.searchMessage && this.state.searchMessage.length > 0) ?
                                <div className="article_container">
                                    {this.state.searchMessage.map((article) => (
                                        <Messages
                                            date={article.date}
                                            likes={article.likes}
                                            idUser={this.props.idUser}
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

                                        />
                                    ))}

                                </div> :
                                <div className="noResMessage">Aucun résultat</div>

                        }
                    </div>
                </div>
            </div>


        );

    }


}
