import React, {Component} from "react";
import {connect} from "react-redux";
import {read_cookie} from 'sfcookies';
import axios from 'axios';

import Header from '../components/Header';
import Loading from '../components/Loading';
import Button from '../components/Button';

class Conference extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			conf: null,
			selectedType: 0,
			needFile: false,
			selectedFile: undefined,
			mail: undefined,
			subscribed: undefined,
			loading: false,
			inscriptions: undefined,
			inscription: undefined,
			showRejectModal: false,
			showUserInfosModal: false,
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
				if (res.data.responsable.id_resp != this.props.user.id && !this.props.user.admin) {
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
		params.append('paid', this.invitationPrepayed ? 1 : 0);
		params.append('op', 'invite');
		
		this.setState({loading: true});
		axios.post("http://localhost:8080/Project_war/Inscriptions", params)
		.then(res => {
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
		this.setState({showRejectModal: ((reason) => {
				this.setInscriptionStatut(id, 'disapprove', reason);
				this.setState({showRejectModal: false});
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
				} else {
					this.setState({loading: false});
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
				this.setState({inscriptions: res.data.inscriptions});
			}
		});
	}
	tokenConfigMultiPart = () => {

        const config = {
            headers: {
				"Content-Type": "multipart/form-data; boundary=--------------------------811161660471543283806813",            }
        };

        return config;
	};
	

	subscribeConf() {
		const { selectedType, selectedFile } = this.state;
		if (selectedType <= 0) return;
		if (selectedFile === undefined) {
			let params = new URLSearchParams();
			params.append('key', read_cookie("key"));
			params.append('op', 'subscribe');
			params.append('id_conf', this.props.match.params.id);
			params.append('id_type', selectedType);
		
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
		} else {
			const data = new FormData();

			const key = read_cookie("key")
			const id_conf = this.props.match.params.id
			const id_type = selectedType
			let blob = new Blob(["<html>…</html>"], {type: 'text/html'});
			data.append("file", blob)

			var requestOptions = {
			  method: 'POST',
			  body: data,
			  redirect: 'follow'
			};
			
			fetch('http://localhost:8080/Project_war/Inscriptions?key='+key+'&id_conf='+id_conf+'&id_type='+id_type+'&op=subscribe&is_file=1', requestOptions)
			  .then(response => response.text())
			  .then(result => console.log(result))
			  .catch(error => console.log('error', error));

			}
	}

	renderTypes() {
		const {conf} = this.state;
		if (conf) return (
			<div style={{marginRight: 10}} class="w-25">
				<select 
					class="form-select m-1"
					onChange={(e) => {
						const v = e.target.value.split("-");
						this.setState({selectedType: v[0], needFile: v[1] == 1})
					}}>
					<option value={0}>Sélectionnez un type</option>
					{conf.types.map((type) => {
						const tarif = type.is_early ? type.tarif_early : type.tarif_late;
						return (
							<option value={type.id_type + "-" + type.need_file}>{type.nom} -- {tarif}€</option>
						)
					})}
				</select>
			</div>
		)
	}

	renderSubscribe() {
		const {conf, selectedType, subscribed, needFile, selectedFile} = this.state;
		if (subscribed === undefined) return;
		if (conf.responsable.id_resp != this.props.user.id && !this.props.user.admin && !subscribed)	return (
			<fieldset disabled={subscribed}>
				<div class="d-flex flex-row">
					{this.renderTypes()}
					{needFile && 
						<div>
							<label className="m-1">
								<input type="file" class="form-control-file" onChange={(e) => this.setState({selectedFile: e})}/>
							</label>
						</div>
					}
					<Button
						loading={this.state.loading}
						disabled={(selectedType <= 0) || (needFile && !selectedFile)}
						class="btn btn-outline-primary m-1" 
						onClick={() => this.subscribeConf()}
						title="S'inscrire"/>
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
								<td class="align-middle"><a href="javascript:void(0)" onClick={() => this.setState({showUserInfosModal: inscription.user})}>{inscription.user.mail}</a></td>
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
		if (conf.responsable.id_resp == this.props.user.id || this.props.user.admin)	return (
			<fieldset disabled={loading}>
				{!this.props.user.admin && 
					<div class="alert alert-primary p-2" role="alert">
						Vous êtes le responsable de cette conférence
					</div>
				}
				<div>
					<h5 class="mb-2">Inviter un utilisateur</h5>
					<div class="d-flex mb-2 flex-row">
						<input 
							type="mail"
							class="form-control m-1 w-25"
							onChange={(e) => {
								this.setState({mail: e.target.value})
							}}
							placeholder="Mail"/>
						{this.renderTypes()}
						<div class="m-1 form-check w-25 d-flex align-items-center">
							<label>
								<input 
										type="checkbox" 
										defaultChecked={false}
										class="form-check-input"
										onChange={(e) => {
											this.invitationPrepayed = e.target.checked;
										}}
										id={"free-checkbox"}/>
										Inscription prépayée
							</label>
						</div>     
						<Button
							loading={this.state.loading}
							disabled={selectedType == 0 || !mail || mail.length < 4}
							class="btn btn-outline-primary m-1 w-25" 
							onClick={() => this.inviteUser(conf.id_conf)}
							title="Inviter"/>
					</div>
				</div>
				<div>
					<h5 class="mb-2 mt-4">Liste des inscrits</h5>
					{this.renderListInscriptions()}
				</div>
			</fieldset>
		)
	}

	renderRejectModal() {
		this.reason = "";
		if (this.state.showRejectModal !== false) return (
			<div class="modal" style={{display: 'block', backgroundColor: '#00000050'}} id="exampleModal" aria-hidden="true">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title" id="exampleModalLabel">Envoyer un refus</h5>
							<button type="button" class="btn-close" onClick={() => this.setState({showRejectModal: false})}></button>
						</div>
						<div class="modal-body">
							<p>Indiquez la raison du refus: (min. 10, max. 256 caractères)</p>
							<textarea 
								style={{resize: 'none'}}
								onInput={(e) => {
										this.reason = e.target.value;
								}}
								cols={40} 
								rows={2}
								maxLength={256}/>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" onClick={() => this.setState({showRejectModal: false})}>Fermer</button>
							<button type="button" class="btn btn-primary" onClick={() => { 
								if (this.reason.length >= 10) {
									this.state.showRejectModal(this.reason)
								}
							}}>Envoyer</button>
						</div>
					</div>
				</div>
			</div>
		)
	}

	renderUserInfosModal() {
		const infos = this.state.showUserInfosModal;
		if (infos !== false) return (
			<div class="modal" style={{display: 'block', backgroundColor: '#00000050'}} id="exampleModal" aria-hidden="true">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title" id="exampleModalLabel">Informations utilisateur</h5>
							<button type="button" class="btn-close" onClick={() => this.setState({showUserInfosModal: false})}></button>
						</div>
						<div class="modal-body">
							{Object.keys(infos).map((item) => {
								if (item !== 'id_user') {
									return (
										<div>
											<p><b>{item[0].toUpperCase() + item.slice(1)}</b>: {infos[item]}</p>
										</div>
									)
								}
							})}
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" onClick={() => this.setState({showUserInfosModal: false})}>Fermer</button>
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
				statut = "en attente de validation";
			} else if (inscription.approved == 1 && inscription.paid == 0) {
				statut = "en attente de paiement";
				pending = true;
			} else if (inscription.approved == 2) {
				statut = "refusée";
			} else if (inscription.paid == 1) {
				statut = "payée";
			}
			return (
				<div>
					<div class="alert alert-primary p-2" role="alert">
						Votre inscription est <b>{statut}</b>
					</div>
					{pending &&
						<Button
							loading={this.state.loading}
							class="btn btn-primary" 
							onClick={() => this.payInscription(inscription.id_insc)}
							title="Payer votre inscription"/>
							
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
				<p><b>Conférencier</b><br></br>{conf.responsable.title} {conf.responsable.nom} {conf.responsable.prenom}</p>
				<p><b>Description</b><br></br>{conf.description}</p>
				<p><b>Dates</b><br></br>{conf.date_conf} (fin tarif early le {conf.date_clot_early})</p>
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
				{this.renderRejectModal()}
				{this.renderUserInfosModal()}
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