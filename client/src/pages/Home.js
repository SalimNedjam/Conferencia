import React, {Component} from "react";
import {connect} from "react-redux";

import Header from '../components/Header';
import ConferenceList from '../components/ConferenceList';
import InscriptionList from '../components/InscriptionList';
import ConferencesOverview from '../components/ConferencesOverview';

class Home extends Component {

	renderMyInscriptions() {
		if (!this.props.user.admin) {
			return (
				<div class="flex-fill m-2">
					<InscriptionList/>
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
				<ConferenceList
					title="Toutes les conférences" 
					filter='all'
					button={button}
				/>
		)
	}

	render() {
		return (
		<div>
			<Header/>
			<div class="container-sm mt-5 d-flex">
				{this.renderMyInscriptions()}
				<div class="flex-fill m-2">
					{!this.props.user.admin && <ConferencesOverview/>}
					{this.renderAllConf()}
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