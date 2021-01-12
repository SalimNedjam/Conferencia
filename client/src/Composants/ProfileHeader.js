import React, {Component} from "react";
import profile from '../res/profile.png'
import {read_cookie} from "sfcookies";
import axios from 'axios'

export default class ProfileHeader extends Component {

    constructor(props) {
        super(props);

        this.state = {
            clicked: false,
            file: null,

        };


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


    onError() {
        this.setState({
            image: profile
        })
    }


    onChange(event) {
        

    }

    componentWillReceiveProps(nextProps) {

        const params = new URLSearchParams();
        params.append('key', read_cookie("key"));
        params.append('id', nextProps.id);

        axios.get("http://localhost:8080/TwisterFinal/Image?" + params)
            .then(res => {
                this.setState({
                    image: res.data
                })
            });

    }

    render() {


        return (<div className="ProfileInfos">

            <div className="infos">
                <br/>
                <div className="username">
                    {this.props.login}
                </div>

            </div>

        </div>);


    }


}
