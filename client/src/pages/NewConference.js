import React, {Component} from "react";
import axios from 'axios';
import {read_cookie} from 'sfcookies';

import Header from '../components/Header';

const FORM = {
    nom: {
        mandatory: true,
        name: 'name',
        type: 'text',
        label: "Nom de la conférence",
    },
    date_clot_early: {
        mandatory: true,
        name: 'date-clot-early',
        type: 'date',
        label: "Date de fin early",
    },
    date_conf: {
        mandatory: true,
        name: 'date-conf',
        type: 'date',
        label: "Date de la conférence",
    },
    email: {
        mandatory: true,
        name: 'resp-mail',
        type: 'email',
        label: "Adresse mail du responsable de la conférence",
    },
    description: {
        name: 'date-conf',
        type: 'textarea',
        maxLength: 256,
        label: "Description (max. 256 caractères)",
    },
    field_set: {
        type: 'group-checkbox',
        label: "Informations clients demandées",
        values: {
            mail: {
                index: 0,
                lock: true,
                label: "Adresse mail",
            },
            title: {
                index: 1,
                label: "Titre",
            },
            prenom: {
                index: 2,
                label: "Prénom",
            },
            nom: {
                index: 3,
                label: "Nom",
            },
            institution: {
                index: 4,
                label: "Institution",
            },
            address: {
                index: 5,
                label: "Adresse",
            },
            zip: {
                index: 6,
                label: "Code postal",
            },
            city: {
                index: 7,
                label: "Ville",
            },
            country: {
                index: 8,
                label: "Pays",
            },
            phone: {
                index: 9,
                label: "Téléphone",
            },
        }
    }
}

export default class NewConference extends Component {


    constructor(props) {
        super(props);

        this.state = {
            types: [],
            errors: {},
			loading: false,
        };
        
        this.inputs = [];
    }

    bitsetToInt(bitset) {
        let value = 0;
        for (let i = 0; i < bitset.length; i++) {
            value += (bitset[i] ? 1 : 0) * Math.pow(2, i);
        }
        return value;
    }

    createConf() {
        if (this.checkForm()) {
            const params = new URLSearchParams();
        
            for (let index in Object.keys(FORM)) {
                index = Object.keys(FORM)[index];
                let value = this.inputs[index].value;
                if (Array.isArray(this.inputs[index].value)) {
                    value = this.bitsetToInt(value);
                }
                params.append(index, value);
                console.log(index, value);
            }
            
            params.append("key", read_cookie("key"));
            let types = [];
            for (let t of this.state.types) {
                types.push(`${t.name};${t.early};${t.late}`);
            }
            types = types.join("&");
            params.append("types", types);

			this.setState({loading: true});

            axios.post("http://localhost:8080/Project_war/Conferences", params)
            .then(res => {
                console.log(res);
                if (res.data.code === undefined) {
                    window.location.href = "/conf/" + res.data.id_conf;
                } else {
                    let errors = {};
                    errors["serverError"] = res.data.message;
                    this.setState({errors, loading: false})
                }
            });
        }
    }

    addType() {
        if (this.typeInputName.value === '' || this.typeInputEarly.value === '' || this.typeInputLate.value === '') return;
        this.setState({
            types: [...this.state.types, {
                name: this.typeInputName.value,
                early: this.typeInputEarly.value,
                late: this.typeInputLate.value,
            }] 
        });
        this.typeInputName.value = "";
        this.typeInputEarly.value = 0;
        this.typeInputLate.value = 0;
    }

    checkForm() {
        let errors = {};
		let formIsValid = true;
		let scroll = false;

        for (let index in Object.keys(FORM)) {
            index = Object.keys(FORM)[index];
            let item = FORM[index];
            if (item.mandatory && this.inputs[index].value === "") {
                errors[index] = "Le champ ne peut être vide";
                formIsValid = false;
            } else if (item.regex && !this.inputs[index].value.match(item.regex)) {
                this.inputs[index].value = "";
                formIsValid = false;
                errors[index] = "Uniquement des caractères";
            } else if (item.maxLength && this.inputs[index].value.length > item.maxLength) {
                this.inputs[index].value = "";
                formIsValid = false;
                errors[index] = `Maximum ${item.maxLength} caractères`;
            }
			if (!formIsValid && !scroll) {
				scroll = true;
				this.inputs[index].scrollIntoView()
			}
        }

        if (this.state.types.length == 0) {
            formIsValid = false;
            errors["typeError"] = "Vous devez ajouter au moins un type d'inscription";
        }

        this.setState({errors});
        return formIsValid;
    }

    renderItem(index, item) {
        let jsx;
        if (item.type == 'textarea') {
            this.inputs[index] = {value: ""}
            jsx = (
                <div>
                    <textarea 
                        id={item.name + "-input"} 
                        name={item.name} 
                        maxLength={256}
                        onInput={(e) => {
                            this.inputs[index] = {value: e.target.value}
                        }}
                        style={{resize: 'none'}}
                        cols={50} 
                        rows={2}/>
                    <br></br>
                </div>
            );
        } else if (item.type == 'group-checkbox') {
            this.inputs[index] = {value: []}
            jsx = (
                <div>
                    {Object.keys(item.values).map((field) => {
                        this.inputs[index].value[item.values[field].index] = true;
                        return (
                            <div class="mb-3 form-check">
                                <label>
                                    <input 
                                        type="checkbox" 
                                        disabled={item.values[field].lock}
                                        defaultChecked={this.inputs[index].value[item.values[field].index]}
                                        class="form-check-input"
                                        onChange={(e) => {
                                            this.inputs[index].value[item.values[field].index] = e.target.checked;
                                        }}
                                        id={field + "-checkbox"}/>
                                        {item.values[field].label}
                                </label>
                            </div>             
                        )
                    })}
                </div>
            )
        } else {
            jsx = (
            <input 
                type={item.type}
                name={item.name}
                class="form-control"
                id={item.label + "-input"}
                ref={(input) => {
                    this.inputs[index] = input;
                }}/>
            );
        }

        return (
            <div class="mb-4">
                <label 
                    for={item.name + "-input"}
                    class="form-label">
                    {item.mandatory &&
                        <span class="text-danger">* </span>
                    }
                    {item.label}
                </label>
                {this.state.errors[index] && 
                    <div class="alert alert-danger p-2" role="alert">
                        {this.state.errors[index]}
                    </div>
                }
                {jsx}
            </div>
        )
    }

    renderAddedTypes() {
        const { types } = this.state;
        return (
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th scope="col">Nom</th>
                        <th scope="col">Prix early</th>
                        <th scope="col">Prix late</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                {types.map((type, index) => (
                    <tbody>
                        <tr>
                            <td class="align-middle">{type.name}</td>
                            <td class="align-middle">{type.early}</td>
                            <td class="align-middle">{type.late}</td>
                            <td>
                                <button 
                                    type="button"
                                    class="btn btn-link" 
                                    onClick={() => {
                                        let t = [...types];
                                        t.splice(index, 1);
                                        this.setState({
                                            types: t
                                        })
                                    }}>
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    </tbody>
                ))}
            </table>
        )
    }
    
    renderTypes() {
        return (
            <div>
                <label class="form-label">
                    Types d'inscriptions
                </label>
                {this.state.errors["typeError"] && 
                    <div class="alert alert-danger p-2" role="alert">
                        {this.state.errors["typeError"]}
                    </div>
                }
                <div class="d-flex mb-2 flex-row">
                    <input 
                        type="text"
                        class="form-control m-1 w-25"
                        ref={(input) => {
                            this.typeInputName = input;
                        }}
                        placeholder="Nom"/>
                    <input 
                        type="number"
                        class="form-control m-1 w-25"
                        ref={(input) => {
                            this.typeInputEarly = input;
                        }}
                        placeholder="Prix early"/>
                    <input 
                        type="number"
                        class="form-control m-1 w-25"
                        ref={(input) => {
                            this.typeInputLate = input;
                        }}
                        placeholder="Prix late"/>
                    <button
                        type="button"
                        name="add"
                        onClick={() => this.addType()}
                        class="btn btn-outline-primary m-1 w-25">
                        Ajouter
                    </button>
                </div>
                {this.renderAddedTypes()}
            </div>
        )
    }

    render() {
        return (
			<div>
                <Header/>
				<div class="container box box-md mt-5 p-4 mb-5">
					<h1 class="mb-3">Nouvelle conférence</h1>
					<p class="mb-4">
						Les champs obligatoires sont marqués par
						<span class="text-danger"> * </span>.
					</p>

					{this.state.errors["serverError"] && 
						<div class="alert alert-danger p-2" role="alert">
							{this.state.errors["serverError"]}
						</div>
					}

					<form>
						<fieldset disabled={this.state.loading}>
							{Object.keys(FORM).map((item) => this.renderItem(item, FORM[item]))}
                            {this.renderTypes()}
						</fieldset>
					</form>
					<div class="d-flex justify-content-center">
						{!this.state.loading &&
							<button
								type="button"
								name="add"
								onClick={() => this.createConf()}
								class="btn btn-primary m-1">
								Créer la conférence
							</button>
						}	
						{this.state.loading && 
							<button
								type="button"
								name="add"
								disabled
								class="btn btn-primary m-1">
								<div class="d-flex align-items-center">
									<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
									&nbsp;Chargement...
								</div>
							</button>
						}
					</div>
				</div>
			</div>
        )
    }

}
