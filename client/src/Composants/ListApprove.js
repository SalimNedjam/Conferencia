import React, {Component} from "react";
import axios from 'axios'
import {read_cookie} from "sfcookies";
import ItemApprove from "./ItemApprove";

export default class ListApprove extends Component {

    constructor(props) {
        super(props);

        this.state = {
            requests: null,
        }

    }

    componentDidMount() {
        const params1 = new URLSearchParams();

        params1.append('key', read_cookie("key"));
        params1.append('op', "requests");

        axios.get("http://localhost:8080/TwisterFinal/Friends?" + params1)
            .then(res => {
                this.setState(() => {
                    return {requests: res.data.Array};
                });

            });


    }

    render() {

        const {requests} = this.state;

        return (<div className="ApprouveList">

            {
                requests && requests.length > 0 &&
                <div className="headApprouve">Demandes en attente</div>

            }
            {
                requests &&
                <div className="list">
                    {this.state.requests.map((article) => (
                        <ItemApprove
                            getuserprofile={this.props.getuserprofile}
                            name={article.nom}
                            login={article.login}
                            lastname={article.prenom}
                            id={article.id_user}
                            key={article.id_user}
                        />
                    ))}
                </div>
            }
        </div>);


    }


}
