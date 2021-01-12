import React, {Component} from "react";
import '../Styles/Articles.css'
import profile from '../res/profile.png'
import '../Styles/Amis.css'
import {read_cookie} from "sfcookies";
import axios from 'axios'

export default class ItemFriend extends Component {

    constructor(props) {
        super(props);
        this.state = {
            image: profile
        }

    }


    onError() {
        this.setState({
            image: profile
        })
    }

    componentDidMount() {
        const params = new URLSearchParams();
        params.append('key', read_cookie("key"));
        params.append('id', this.props.id);

        axios.get("http://localhost:8080/TwisterFinal/Image?" + params)
            .then(res => {
                this.setState({
                    image: res.data
                })
            });
    }


    render() {


        return (<div className="Amis"
                     onClick={() => this.props.getuserprofile(this.props.id, this.props.login, this.props.nom, this.props.prenom)}>
                <div className="photo">
                    <a>
                        <img className="profile" onError={this.onError.bind(this)} src={this.state.image}/>
                    </a>

                </div>
                <div className="infos">
                    <div className="name">
                        {this.props.prenom} {this.props.nom}
                    </div>

                </div>
            </div>
        );


    }


}
