import React, {Component} from "react";
import axios from 'axios';

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
		// axios.get("http://localhost:8080/TwisterFinal/Messages?" + params)
		// .then(res => {
		//     this.setState(() => {
		//         return {data: res.data.Array};
		//     });

		// });
	}

	renderItem(item) {
		return (
			<a href="#" class="list-group-item list-group-item-action" aria-current="true">
				<div class="d-flex w-100 justify-content-between">
					<h5 class="mb-1">{item.name}</h5>
					<small>{item.date}</small>
				</div>
				<p class="mb-1">{item.description}</p>
				<small>${item.minPrice} - ${item.maxPrice}</small>
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
		let data = DATA;
		if (this.props.filter != 'all') {
			data = data.filter((item) => {
				return item[this.props.filter] !== undefined;
			});
		}
		return (
			<div class="list-group mb-3">
				<h3 class="mb-2">{this.props.title}</h3>
				{data.map((item) => this.renderItem(item))}
				{data.length == 0 && this.renderEmpty()}
			</div>
		)
	}
}