import React, {Component} from "react";
import ItemFriend from "./ItemFriend";

export default class ListSearch extends Component {

    constructor(props) {
        super(props);

        this.state = {
            searchUser: this.props.searchUser,
        }

    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            searchUser: nextProps.searchUser,
        })
    }

    render() {


        return (<div className="ListAmis">
            <div className="headAmis">Utilisateurs trouvé</div>
            {
                this.state.searchUser.length > 0 ?
                    <div className="list">
                        {this.state.searchUser.map((article) => (
                            <ItemFriend
                                getuserprofile={this.props.getuserprofile}
                                nom={article.nom}
                                login={article.login}
                                prenom={article.prenom}
                                id={article.user}
                                key={article.user}
                            />
                        ))}
                    </div>
                    :
                    <div className="noRes">Aucun résultat</div>

            }

        </div>);


    }


}
