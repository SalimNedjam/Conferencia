import React, {Component} from "react";
import axios from 'axios';
import {read_cookie} from 'sfcookies';
import { connect } from "react-redux";

import Loading from '../components/Loading';

class ConferencesOverview extends Component {

	constructor(props) {
		super(props);
		this.state = {
      conf: undefined,
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
	}

	renderItem(item) {
    return (
      <a href={"/conf/" + item.id_conf} class="list-group-item list-group-item-action" aria-current="true" key={item.id_conf}>
        <div class="d-flex w-100 justify-content-between">
          <h6 class="mb-1">{item.nom}</h6>
        </div>
        <small>Le {item.date_conf}</small>
      </a>
    )
	}

	render() {
    const { conf } = this.state;
    if (conf === undefined) return <Loading/>;
    if (conf.length == 0) return <div/>;
		const data = conf.filter((value) => value.responsable.id_resp == this.props.user.id);
		if (data.length == 0) return <div/>;
		return (
			<div class="list-group mb-3">
				<div class="d-flex flex-row justify-content-between pb-2">
					<h3 class="mb-2">Mes conférences</h3>
				</div>
				{data.map((item) => this.renderItem(item))}
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		user: state.user.user,
	};
}

export default connect(mapStateToProps)(ConferencesOverview);