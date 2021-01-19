import React, {Component} from "react";
import axios from 'axios';
import {read_cookie} from 'sfcookies';

const DATA = [
	{
		name: "Conférence 1",
		date: "20/01/2020",
		description: "Description de la conférence ...",
		minPrice: 100,
		maxPrice: 250,
		pending: true,
	},
	{
		name: "Conférence 2",
		date: "25/01/2020",
		description: "Description de la conférence ...",
		minPrice: 180,
		maxPrice: 450,
	}
]

export default class Accueil extends Component {

	constructor(props) {
		super(props);
		this.state = {
				data: null
		};

		this.componentDidMount = this.componentDidMount.bind(this);
	}


	componentDidMount() {
		const params = new URLSearchParams();
		params.append('key', read_cookie("key"));

		axios.get("http://localhost:8080/Project_war/Conferences?" + params)
		.then(res => {
		    this.setState({data: res.data.Conferences});
		});
	}

	renderItem(item) {
		return (
			<a href={"/conf/" + item.id_conf} class="list-group-item list-group-item-action" aria-current="true">
				<div class="d-flex w-100 justify-content-between">
					<h4 class="mb-1">{item.nom}</h4>
					<small>{item.types.length} types d'inscriptions</small>
				</div>
				<p class="mb-1">Description</p>
				<small>Fin early  {item.date_clot_early}</small><br></br>
				<small>Le {item.date_conf}</small>
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
			<div/>
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