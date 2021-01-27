import React, {Component} from "react";
import axios from 'axios';
import {read_cookie} from 'sfcookies';

export default class InscriptionList extends Component {

	constructor(props) {
		super(props);
		this.state = {
      conf: [],
      inscriptions: [],
		};
	}


	componentDidMount() {
    const params = new URLSearchParams();
		params.append('key', read_cookie("key"));

		axios.get("http://localhost:8080/Project_war/Conferences?" + params)
		.then(res => {
      if (res.data.code === undefined) {
		    this.setState({conf: res.data.conferences});
			}
    });

		axios.get("http://localhost:8080/Project_war/Inscriptions?" + params)
		.then(res => {
			if (res.data.code === undefined) {
				this.setState({inscriptions: res.data.inscriptions});
			}
		});
	}

	renderItem(item) {
		const {conf} = this.state;
		if (conf.length == 0) return;
    const index = conf.findIndex((value) => value.id_conf == item.id_conf);
    console.log(conf);
    const c = conf[index];
    if (c) return (
			<a href={"/conf/" + c.id_conf} class="list-group-item list-group-item-action" aria-current="true" id={item.id_conf}>
				<div class="d-flex w-100 justify-content-between">
					<h6 class="mb-1">{c.nom}</h6>
				</div>
				<small>Le {c.date_conf}</small>
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
  
  renderSection(title, filter) {
    let {inscriptions} = this.state;
    if (!inscriptions) return this.renderEmpty();

    if (filter) {
			inscriptions = inscriptions.filter((item) => {
        if (filter === 'pending') {
          return item.approved == 0 && item.paid == 0;
        } else if (filter === 'approved') {
          return item.approved == 1 && item.paid == 0;
        } else if (filter === 'paid') {
          return item.paid == 1 && item.approved == 1;
        }
				return false;
			});
    }
    
    return (
      <div class="list-group mb-3">
				<div class="d-flex flex-row justify-content-between pb-2">
					<h5 class="mb-2">{title}</h5>
				</div>
				{inscriptions.map((item) => this.renderItem(item))}
				{inscriptions.length == 0 && this.renderEmpty()}
			</div>
    )
  }

	render() {
		return (
			<div class="container">
        <h3>Mes inscriptions</h3>
        <hr></hr>
        {this.renderSection("En attente de validation", 'pending')}
        {this.renderSection("En attente de paiement", 'approved')}
        {this.renderSection("Inscrit", 'paid')}
			</div>
		)
	}
}