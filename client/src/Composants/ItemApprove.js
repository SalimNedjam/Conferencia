import React, {Component} from "react";
import '../Styles/Articles.css'
import profile from '../res/profile.png'
import '../Styles/Amis.css'
import {read_cookie} from "sfcookies";
import axios from 'axios'

export default class ItemApprove extends Component {

    constructor(props) {
        super(props);
        this.state = {
            clicked: false,
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


    disapprove() {


        const params1 = new URLSearchParams();

        params1.append('key', read_cookie("key"));
        params1.append('op', "dis");
        params1.append('id', this.props.id);


        axios.post("http://localhost:8080/TwisterFinal/Friends?", params1)
            .then(() => {
                this.setState({
                    clicked: true
                });


            });
    }

    approve() {
        const params1 = new URLSearchParams();

        params1.append('key', read_cookie("key"));
        params1.append('op', "app");
        params1.append('id', this.props.id);


        axios.post("http://localhost:8080/TwisterFinal/Friends?", params1)
            .then(() => {
                this.setState({
                    clicked: true
                });

            });
    }

    render() {


        return (<div className="Approuve">
                <div
                    onClick={() => this.props.getuserprofile(this.props.id, this.props.login, this.props.name, this.props.lastname)}
                    className="photo">
                    <a>
                        <img className="profile" onError={this.onError.bind(this)} src={this.state.image}/>
                    </a>

                </div>
                <div className="infos">
                    <div
                        onClick={() => this.props.getuserprofile(this.props.id, this.props.login, this.props.name, this.props.lastname)}
                        className="name">
                        {this.props.name} {this.props.lastname}
                    </div>

                </div>

                {!this.state.clicked &&
                <div className="approvement">
                    <a className="approve" onClick={() => this.approve()}>
                        Approve
                    </a>
                    <a className="disapprove" onClick={() => this.disapprove()}>
                        Disapprove
                    </a>
                </div>
                }
            </div>
        );


    }


}
