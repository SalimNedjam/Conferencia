import React, {Component} from "react";
import {connect} from "react-redux";
import {read_cookie} from 'sfcookies';
import axios from 'axios';

import Header from '../components/Header';
import Loading from '../components/Loading';
import { data } from "jquery";

class Conference extends Component {

	constructor(props) {
		super(props);
		this.state = {
			conf: null,
			selectedType: 0,
			subscribed: false,
			loading: false,
			inscriptions: undefined,
		}
	}

	componentDidMount() {
		if (this.props.match.params) {
			let params = new URLSearchParams();
			params.append('key', read_cookie("key"));
			params.append('id_conf', this.props.match.params.id);
		
			axios.get("http://localhost:8080/Project_war/Conferences?" + params)
			.then(res => {
				this.setState({conf: res.data});
				if (res.data.id_resp != this.props.user.id) {
					this.isSubscribed();
				} else {
					this.getInscriptions();
				}
			});
		}
	}

	isSubscribed() {
		const params = new URLSearchParams();
		params.append('key', read_cookie("key"));

		axios.get("http://localhost:8080/Project_war/Inscriptions?" + params)
		.then(res => {
			console.log(res.data);
			if (res.data.code === undefined) {
				const i = res.data.inscriptions.findIndex((value) => value.id_conf == this.props.match.params.id)
				this.setState({subscribed: (i >= 0)});
			}
		});
	}

	getInscriptions() {
		const params = new URLSearchParams();
		params.append('key', read_cookie("key"));
		params.append('id_conf', this.state.conf.id_conf);

		axios.get("http://localhost:8080/Project_war/Inscriptions?" + params)
		.then(res => {
			if (res.data.code === undefined) {
				this.setState({inscriptions: res.data.inscriptions});
			}
		});
	}

	subscribeConf() {
		if (this.state.selectedType <= 0) return;
		const params = new URLSearchParams();
		params.append('key', read_cookie("key"));
		params.append('op', 'subscribe');
		params.append('id_conf', this.props.match.params.id);
		params.append('id_type', this.state.selectedType);
	
		axios.post("http://localhost:8080/Project_war/Inscriptions", params)
		.then(res => {
			if (res.data.code === undefined) {
				document.location.reload();
			}
		});
	}

	renderTypes() {
		const {conf} = this.state;
		if (conf) return (
			<div style={{marginRight: 10}}>
				<select 
					class="form-select"
					onChange={(e) => {
						this.setState({selectedType: e.target.value})
					}}>
					<option value={0}>Sélectionnez un type</option>
					{conf.types.map((type) => {
						const tarif = type.tarif_early;
						return (
							<option value={type.id_type}>{type.nom} -- {tarif}€</option>
						)
					})}
				</select>
			</div>
		)
	}

	renderSubscribe() {
		const {conf, selectedType, subscribed} = this.state;
		if (conf.id_resp != this.props.user.id && !this.props.user.admin)	return (
			<fieldset disabled={subscribed}>
					{this.state.subscribed &&
					<div class="alert alert-primary p-2" role="alert">
						Vous êtes déjà inscrit à cette conférence
					</div>
					}
				<div class="d-flex flex-row">
					{this.renderTypes()}
					<button
						disabled={selectedType <= 0}
						class="btn btn-outline-primary" 
						onClick={() => this.subscribeConf()}>
						S'inscrire
					</button>
				</div>
			</fieldset>
		)
	}

	renderListInscriptions() {
		const { inscriptions } = this.state;
		if (inscriptions === undefined) return <Loading/>;
		if (inscriptions.length > 0) return (
			<table class="table table-sm">
                <thead>
                    <tr>
                        <th scope="col">Mail</th>
                        <th scope="col">Type d'inscription</th>
                        <th scope="col">Statut</th>
                        <th scope="col"></th>
                        <th scope="col"></th>
                    </tr>
                </thead>
				{inscriptions.map((inscription, index) => {
					const statut = 0;
					return (
						<tbody>
							<tr>
								<td>{inscription.id_user}</td>
								<td>{inscription.id_type}</td>
								<td>{statut}</td>
								<td>
									<button 
										type="button"
										class="btn btn-link" 
										onClick={() => {}}>
										Valider
									</button>
								</td>
								<td>
									<button 
										type="button"
										class="btn btn-link" 
										onClick={() => {}}>
										Refuser
									</button>
								</td>
							</tr>
						</tbody>
					)
				})}
            </table>
		);

		return (
			<div>
				<p class="text-secondary">Aucune inscription pour le moment</p>
			</div>
		)
	}

	renderInscriptions() {
		const {conf, loading} = this.state;
		if (conf.id_resp == this.props.user.id && !this.props.user.admin)	return (
			<fieldset disabled={loading}>
					<div class="alert alert-primary p-2" role="alert">
						Vous êtes le responsable de cette conférence
					</div>
				<div class="d-flex flex-row">
					{this.renderListInscriptions()}
				</div>
			</fieldset>
		)
	}

	renderConf() {
		const {conf} = this.state;
		if (conf) return (
			<div class="box container box-md mt-5 p-3">
				<h2>{conf.nom}</h2>
				<p>Description</p>
				<p><strong>Date de fin période early:</strong> {conf.date_clot_early}</p>
				<p><strong>Date de la conférence:</strong> {conf.date_conf}</p>
				<hr></hr>
				{this.renderSubscribe()}
				{this.renderInscriptions()}
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