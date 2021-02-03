import React, {Component} from "react";
import {connect} from 'react-redux';

class Header extends Component {

    render() {
      return (
        <div>
          {this.props.user.admin && 
            <div class="bg-primary text-light" style={{paddingLeft: 12}}>
              Mode administrateur
            </div>
          }
          <nav class={"navbar navbar-light bg-light"}>
            <div class="container-fluid">
              <a class="navbar-brand" href="javascript:void(0)" onClick={() => window.location.href='/'}>Conferentia</a>
              <div class="d-flex">
                {!this.props.user.admin && 
                  <button 
                    class="btn btn-link" 
                    onClick={() => window.location.href = "/me"}>
                      {this.props.user.firstName ? this.props.user.firstName + " " + this.props.user.lastName : "Mon compte"}
                  </button>
                }
                <button 
                  class="btn btn-outline-primary" 
                  onClick={() => window.location.href = "/logout"}>
                  Déconnexion
                </button>
              </div>
            </div>
          </nav>
        </div>
      )
    }

}

const mapStateToProps = state => {
	return {
	  user: state.user.user,
	};
}

export default connect(mapStateToProps)(Header);