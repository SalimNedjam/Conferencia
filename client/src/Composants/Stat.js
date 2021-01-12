import React, {Component} from "react";
import '../Styles/Stat.css'
import {read_cookie} from "sfcookies";
import axios from 'axios'
import ListApprove from "./ListApprove";

export default class Stat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            twist: this.props.twists,
            followers: null,
            following: null,
            isFriend: true,
            isRequested: false
        }
    }


    componentWillReceiveProps(nextProps) {
        this.setState({
            twist: nextProps.twists,
            isFriend: nextProps.isFriend,
            isRequested: nextProps.isRequested
        })

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


        if (this.props.idShow !== undefined) {
            const params3 = new URLSearchParams();

            params3.append('key', read_cookie("key"));
            params3.append('op', "requested");
            params3.append('id', this.props.idShow);


            axios.post("http://localhost:8080/TwisterFinal/Friends?", params3)
                .then(res => {
                    this.setState({
                        isFriend: res.data.isFriend,
                        isRequested: res.data.isRequested

                    });
                });
        }

    }


    sendRequest() {
        const params = new URLSearchParams();

        params.append('key', read_cookie("key"));
        params.append('op', "req");
        params.append('id', this.props.idShow);

        axios.post("http://localhost:8080/TwisterFinal/Friends?", params)
            .then(() => {
                this.setState({
                    isRequested: true
                });

            });
    }

    removeFriend() {
        const params = new URLSearchParams();

        params.append('key', read_cookie("key"));
        params.append('id', this.props.idShow);
        params.append('op', "del");


        axios.post("http://localhost:8080/TwisterFinal/Friends?", params)
            .then(() => {
                this.setState({
                    isFriend: false
                });
            });
    }

    getRequestSection() {
        if (this.props.getuserprofile !== undefined) {
            return <ListApprove getuserprofile={this.props.getuserprofile}/>

        }
        else {
            if (!this.state.isFriend) {
                if (!this.state.isRequested) {
                    return <div className="sendRequest">
                        <a onClick={() => this.sendRequest()}>Suivre ce profil</a>
                    </div>
                }
                else {
                    return <div className="sendRequest">
                        <a>Demande envoyé</a>
                    </div>
                }
            }
            else {
                return <div className="sendRequest">
                    <a onClick={() => this.removeFriend()}>Se désabonner</a>
                </div>
            }
        }

    }

    render() {


        return (<div className="Stat">
            <div className="head"> Statistiques</div>

            <div className="twist">
                Nombre de twists: {this.state.twist}
            </div>
            {
                this.state.followers &&
                <div className="follower">
                    Nombre d'abonnés: {this.state.followers.length}
                </div>
            }
            {
                this.state.following &&
                <div className="following">
                    Nombre d'abonnements: {this.state.following.length}
                </div>

            }

            {
                this.getRequestSection()
            }

        </div>);


    }


}
