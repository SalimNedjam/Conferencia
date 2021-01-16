import React, {Component} from "react";
import {connect} from "react-redux";

import {read_cookie} from 'sfcookies';
import axios from 'axios';


import Header from '../components/Header';

const FORM = {
  password: {
      name: 'pass',
      type: 'password',
      label: "Mot de passe",
      minLength: 6,
  },
  confirmPassword: {
      verify: 'password',
      name: 'confirmPass',
      type: 'password',
      label: "Confirmation du mot de passe",
      minLength: 6,
  },
  title: {
      name: 'title',
      type: 'select',
      values: ['Prof', 'Dr','Mr', 'Mrs', 'Ms'],
      label: "Titre",
  },
  prenom: {
      name: 'firstname',
      type: 'text',
      label: "Prénom",
  },
  nom: {
      name: 'lastname',
      type: 'text',
      label: "Nom",
  },
  institution: {
      name: 'institution',
      type: 'text',
      label: "Institution",
  },
  address: {
      name: 'address',
      type: 'text',
      label: "Adresse",
  },
  zip: {
      name: 'zip',
      type: 'text',
      label: "Code postal",
  },
  city: {
      name: 'city',
      type: 'text',
      label: "Ville",
  },
  country: {
      name: 'country',
      type: 'text',
      label: "Pays",
  },
  phone: {
      name: 'institution',
      type: 'text',
      label: "Téléphone",
  },
}

class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const params = new URLSearchParams();
    params.append('key', read_cookie("key"));
    params.append('idUser', this.props.user.id);

    axios.post("http://localhost:8080/Project_war/GetUserInfos", params)
    .then(res => {
        if (res.data.code === undefined) {
          this.setState({user: res.data});
          console.log(res.data);
        }
      }
    );
  }

  renderInfos() {
    const { user } = this.state;
    if (user) return (
      <div class="box container box-md mt-5 p-3">
        <h2>{user.prenom} {user.nom}</h2>
        <hr/>
        {this.props.user.login}
        
      </div>
    )

  }

  render() {
    return (
      <div>
        <Header/>
        {this.renderInfos()}
      </div>
    )
  }

}

const mapStateToProps = state => {
  return {
    user: state.user.user,
  };
}

export default connect(mapStateToProps)(Profile);