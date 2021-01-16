import React, {Component} from "react";
import {connect} from "react-redux";

import Header from '../components/Header';
import ConferenceList from '../components/ConferenceList';

class Home extends Component {

  render() {
    return (
      <div>
        <Header/>
        <div class="container-sm mt-5 d-flex">
          <div class="flex-fill m-2">
              <ConferenceList title="En attente" filter='pending'/>
              <ConferenceList title="Validée" filter='validate'/>
          </div>
          <div class="flex-fill m-2">
              <ConferenceList title="Toutes les conférences" filter='all'/>
          </div>
        </div>
      </div>
    )
  }

}

const mapStateToProps = state => {
  return {
    user: state.user.user,
  };
}

export default connect(mapStateToProps)(Home);