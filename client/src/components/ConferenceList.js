import React, {Component} from "react";
import axios from 'axios';
import {read_cookie} from 'sfcookies';

export default class ConferenceList extends Component {

	constructor(props) {
		super(props);
		this.state = {
				data: null,
				inscriptions: [],
		};
	}


	componentDidMount() {
		let params = new URLSearchParams();
		params.append('key', read_cookie("key"));

		axios.get("http://localhost:8080/Project_war/Conferences?" + params)
		.then(res => {
			if (res.data.code === undefined) {
		    this.setState({data: res.data.conferences});
			}
		});

		params = new URLSearchParams();
		params.append('key', read_cookie("key"));

		axios.get("http://localhost:8080/Project_war/Inscriptions?" + params)
		.then(res => {
			if (res.data.code === undefined) {
				this.setState({inscriptions: res.data.inscriptions});
			}
		});
	}

	renderItem(item) {
		const {inscriptions} = this.state;
		if (!inscriptions) return;
		const index = inscriptions.findIndex((value) => value.id_conf == item.id_conf);
		let inscription, statut;
		if (index >= 0) {
			inscription = inscriptions[index];
			if (inscription.approved == 0 && inscription.paid == 0) {
				statut = "En attente de validation";
			} else if (inscription.approved == 1 && inscription.paid == 0) {
				statut = "En attente de paiement";
			} else if (inscription.approved == 2) {
				statut = "Refusé";
			} else if (inscription.paid == 1) {
				statut = "Payé";
			}
		}

		return (
			<a href={"/conf/" + item.id_conf} class="list-group-item list-group-item-action" aria-current="true" key={item.id_conf}>
				<div class="d-flex w-100 justify-content-between">
					<h4 class="mb-1">{item.nom}</h4>
					{inscription ?
						<div><span class="badge bg-primary">{statut}</span></div> :
						<small>{item.types.length} types d'inscriptions</small>
					}	
				</div>
				<p>
					{item.responsable.title} {item.responsable.nom} {item.responsable.prenom}
					<br></br>
					{item.description}
					<br></br>
					<small>Le {item.date_conf} (fin tarif early le {item.date_clot_early})</small>
				</p>
			</a>
		)
	}

	renderEmpty() {
		return (
			<div>
				<p class="text-secondary">Aucune conférence</p>
			</div>
		)
	}

	render() {
		let data = this.state.data;
		if (!data) return (
			<div></div>
		)
		if (this.props.filter != 'all') {
			data = data.filter((item) => {
				return item[this.props.filter] !== undefined;
			});
		}
		return (
			<div class="list-group mb-3">
				<div class="d-flex flex-row justify-content-between pb-2">
					<h3 class="mb-2">{this.props.title}</h3>
					{this.props.button && this.props.button.title && 
						<button 
							class="btn btn-outline-primary" 
							onClick={this.props.button.onClick}>
							{this.props.button.title}
						</button>
					}
				</div>
				{data.map((item) => this.renderItem(item))}
				{data.length == 0 && this.renderEmpty()}
			</div>
		)
	}
}