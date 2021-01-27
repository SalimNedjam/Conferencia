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
			selectedType: 0,
			mail: undefined,
			subscribed: undefined,
			loading: false,
			inscriptions: undefined,
			inscription: undefined,
			showModal: false,
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

	inviteUser(idConf) {
		const {mail, selectedType} = this.state;
		if (!mail || mail.length < 4) return; 
		let params = new URLSearchParams();
		params.append('key', read_cookie("key"));
		params.append('email', mail);
		params.append('id_conf', idConf);
		params.append('id_type', selectedType);
		params.append('op', 'invite');

		console.log(idConf, selectedType);

		this.setState({loading: true});
		axios.post("http://localhost:8080/Project_war/Inscriptions", params)
		.then(res => {
			console.log(res.data);
			if (res.data.code === undefined) {
				document.location.reload();
			} else {
				this.setState({loading: false});
			}
		});
	}

	approveInscription(id) {
		this.setInscriptionStatut(id, 'approve');
	}

	disapproveInscription(id) {
		this.setState({showModal: ((reason) => {
				this.setInscriptionStatut(id, 'disapprove', reason);
				this.setState({showModal: false});
		})});
	}

	payInscription(id) {
		this.setInscriptionStatut(id, 'pay');
	}

	setInscriptionStatut(id, statut, reason) {
		if (statut == 'approve' || statut == 'disapprove' || statut == 'pay') {
			let params = new URLSearchParams();
			params.append('key', read_cookie("key"));
			params.append('id_insc', id);
			params.append('op', statut);
			if (reason && reason.length < 256) {
				params.append('reason', reason);
			}

			this.setState({loading: true});
			axios.post("http://localhost:8080/Project_war/Inscriptions", params)
			.then(res => {
				if (res.data.code === undefined) {
					document.location.reload();
				}
			});
		}
	}

	isSubscribed() {
		const params = new URLSearchParams();
		params.append('key', read_cookie("key"));

		axios.get("http://localhost:8080/Project_war/Inscriptions?" + params)
		.then(res => {
			if (res.data.code === undefined) {
				const i = res.data.inscriptions.findIndex((value) => value.id_conf == this.props.match.params.id)
				this.setState({subscribed: (i >= 0), inscription: (i >= 0 ? res.data.inscriptions[i] : undefined)});
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
				console.log("INSCRIPTIONS", res.data.inscriptions);
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

	renderTypes(free) {
		const {conf} = this.state;
		if (conf) return (
			<div style={{marginRight: 10}}>
				<select 
					class="form-select m-1"
					onChange={(e) => {
						this.setState({selectedType: e.target.value})
					}}>
					<option value={0}>Sélectionnez un type</option>
					{free && <option value={-1}>Gratuit</option>}
					{conf.types.map((type) => {
						const tarif = type.is_early ? type.tarif_early : type.tarif_late;
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
		if (subscribed === undefined) return;
		if (conf.id_resp != this.props.user.id && !this.props.user.admin && !subscribed)	return (
			<fieldset disabled={subscribed}>
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
					let statut;
					let pending = false;
					if (inscription.approved == 0 && inscription.paid == 0) {
						pending = true;
						statut = "En attente de validation";
					} else if (inscription.approved == 1 && inscription.paid == 0) {
						statut = "En attente de paiement";
					} else if (inscription.approved == 2) {
						statut = "Refusé";
					} else if (inscription.paid == 1) {
						statut = "Payé";
					}
					return (
						<tbody>
							<tr>
								<td class="align-middle">{inscription.mail}</td>
								<td class="align-middle">{inscription.type == -1 ? "Gratuit" : (inscription.nom + " -- " + inscription.tarif_early + "€")}</td>
								<td class="align-middle">{statut}</td>
								<td>
									{pending &&
										<button 
											type="button"
											class="btn btn-link" 
											onClick={() => this.approveInscription(inscription.id_insc)}>
											Valider
										</button>
									}
								</td>
								<td>
									{pending &&
										<button 
											type="button"
											class="btn btn-link" 
											onClick={() => this.disapproveInscription(inscription.id_insc)}>
											Refuser
										</button>
									}
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
		const {conf, loading, selectedType, mail} = this.state;
		if (conf.id_resp == this.props.user.id && !this.props.user.admin)	return (
			<fieldset disabled={loading}>
				<div class="alert alert-primary p-2" role="alert">
					Vous êtes le responsable de cette conférence
				</div>
				<div>
					<h5>Inviter un utilisateur</h5>
					<div class="d-flex mb-2 flex-row">
						<input 
							type="mail"
							class="form-control m-1 w-50"
							onChange={(e) => {
								this.setState({mail: e.target.value})
							}}
							placeholder="Mail"/>
						{this.renderTypes(true)}
						<button
							disabled={selectedType == 0 || !mail || mail.length < 4}
							class="btn btn-outline-primary m-1 w-25" 
							onClick={() => this.inviteUser(conf.id_conf)}>
							Inviter
						</button>
					</div>
				</div>
				<div>
					<h5>Liste des inscrits</h5>
					{this.renderListInscriptions()}
				</div>
			</fieldset>
		)
	}

	renderModal() {
		this.reason = "";
		if (this.state.showModal !== false) return (
			<div class="modal" style={{display: 'block', backgroundColor: '#00000050'}} id="exampleModal" aria-hidden="true">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title" id="exampleModalLabel">Envoyer un refus</h5>
							<button type="button" class="btn-close" onClick={() => this.setState({showModal: false})}></button>
						</div>
						<div class="modal-body">
							<p>Indiquez la raison du refus:</p>
							<textarea 
								style={{resize: 'none'}}
								onInput={(e) => {
										this.reason = {value: e.target.value}
								}}
								cols={40} 
								rows={2}
								maxLength={256}/>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" onClick={() => this.setState({showModal: false})}>Fermer</button>
							<button type="button" class="btn btn-primary" onClick={() => {this.state.showModal(this.reason)}}>Envoyer</button>
						</div>
					</div>
				</div>
			</div>
		)
	}

	renderStatut() {
		const {inscription} = this.state;
		if (inscription) {
			let statut, pending;
			if (inscription.approved == 0 && inscription.paid == 0) {
				statut = "En attente de validation";
			} else if (inscription.approved == 1 && inscription.paid == 0) {
				statut = "En attente de paiement";
				pending = true;
			} else if (inscription.approved == 2) {
				statut = "Refusé";
			} else if (inscription.paid == 1) {
				statut = "Payé";
			}
			return (
				<div>
					<div class="alert alert-primary p-2" role="alert">
						Votre inscription est <b>{statut}</b>
					</div>
					{pending &&
						<button
							class="btn btn-primary" 
							onClick={() => this.payInscription(inscription.id_insc)}>
							Payer votre inscription
						</button>
					}
				</div>
			)
		}
	}

	renderConf() {
		const {conf} = this.state;
		if (conf) return (
			<div class="box container box-md mt-5 p-3">
				<h2>{conf.nom}</h2>
				<p>{conf.description}</p>
				<p><strong>Date de fin période early:</strong> {conf.date_clot_early}</p>
				<p><strong>Date de la conférence:</strong> {conf.date_conf}</p>
				<hr></hr>
				{this.renderSubscribe()}
				{this.renderInscriptions()}
				{this.renderStatut()}
			</div>
		);

		return <Loading/>;
	}
	
	render() {
		return (
			<div>
				<Header/>
				{this.renderConf()}
				{this.renderModal()}
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