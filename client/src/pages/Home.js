import React, {Component} from "react";
import {connect} from "react-redux";

import Header from '../components/Header';
import ConferenceList from '../components/ConferenceList';

class Home extends Component {

	renderMyConf() {
		if (!this.props.user.admin) {
			return (
				<div class="flex-fill m-2">
					<ConferenceList title="En attente" filter='pending'/>
					<ConferenceList title="Inscrit" filter='validate'/>
				</div>
			)
		}
	}

	renderInscriptionsToValid() {
		if (this.props.user.admin) {
			return (
				<div class="flex-fill m-2">
					<ConferenceList title="À valider" filter='pending'/>
				</div>
			)
		}
	}

	renderAllConf() {
		let button = {};
		if (this.props.user.admin) {
			button = {
				title: "Ajouter une conférence",
				onClick: () => {
					window.location.href = "/new";
				}
			}
		}
		return (
			<div class="flex-fill m-2">
				<ConferenceList 
					title="Toutes les conférences" 
					filter='all'
					button={button}
				/>
			</div>
		)
	}

	render() {
		return (
		<div>
			<Header/>
			<div class="container-sm mt-5 d-flex">
				{this.renderMyConf()}
				{this.renderInscriptionsToValid()}
				{this.renderAllConf()}
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