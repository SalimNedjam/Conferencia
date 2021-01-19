import React, {Component} from "react";
import {connect} from "react-redux";
import {read_cookie} from 'sfcookies';
import axios from 'axios';

import Header from '../components/Header';
import Loading from '../components/Loading';

class Conference extends Component {

  constructor(props) {
    super(props);
    this.state = {
      conf: null,
    }
  }

  componentDidMount() {
    if (this.props.match.params) {
      const params = new URLSearchParams();
      params.append('key', read_cookie("key"));
      params.append('id_conf', this.props.match.params.id);
  
      axios.get("http://localhost:8080/Project_war/Conferences?" + params)
      .then(res => {
        console.log(res.data);
          this.setState({conf: res.data});
      });
    }
  }

  renderConf() {
    const {conf} = this.state;
    if (conf) return (
      <div class="box container box-md mt-5 p-3">
        <h2>{conf.nom}</h2>
        <p>Description</p>
        <p><strong>Date de fin période early:</strong> {conf.date_clot_early}</p>
        <p><strong>Date de la conférence:</strong> {conf.date_conf}</p>
      </div>
    );

    return <Loading/>;
  }
  
  render() {
    return (
      <div>
        <Header/>
        {this.renderConf()}
      </div>
    )
  }

}

const mapStateToProps = state => {
  return {
    user: state.user.user,
  };
}

export default connect(mapStateToProps)(Conference);