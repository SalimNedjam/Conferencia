import React, {Component} from "react";
import {connect} from "react-redux";
import axios from 'axios';
import {read_cookie} from "sfcookies";

import { unsetUser } from "../redux/actions";

class Logout extends Component {

  componentDidMount() {
    const params = new URLSearchParams();
    params.append('key', read_cookie("key"));

    axios.post("http://localhost:8080/Project_war/Logout", params)
    .then(() => {
        this.props.unsetUser();
      }
    );
  }

  render() {
    return (
      <h1>Logout</h1>
    )
  }
}


export default connect(null, {unsetUser})(Logout);