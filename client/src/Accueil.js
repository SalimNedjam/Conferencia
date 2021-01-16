import React, {Component} from "react";
import Messages from "./Composants/Messages";
import PostMessage from "./Composants/PostMessage";
import ConferenceList from "./components/ConferenceList";
import axios from 'axios';
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

        axios.get("http://localhost:8080/TwisterFinal/Conferences?" + params)
        .then(res => {
            this.setState(() => {
                return {data: res.data.Array};
            });

        });
    }

    render() {
        const {data} = this.state;

        return (
            <div class="container-sm mt-5 d-flex">
                <div class="flex-fill m-2">
                    <ConferenceList title="En attente" filter='pending'/>
                    <ConferenceList title="Validée" filter='validate'/>
                </div>
                <div class="flex-fill m-2">
                    <ConferenceList title="Toutes les conférences" filter='all'/>
                </div>
            </div>
        )
    }

}
