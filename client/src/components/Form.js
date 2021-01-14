import React, {Component} from "react";

export default class Form extends Component {


    constructor(props) {
        super(props);

        this.state = {
            errors: {},
        };

        this.inputs = [];
    }

    submit() {
        if (this.checkForm()) {
            const params = new URLSearchParams();
        
            for (let index in Object.keys(this.props.form)) {
                index = Object.keys(FORM)[index];
                params.append(index, this.inputs[index].value);
            }


            axios.post("http://localhost:8080/Project_war/CreateUser", params)
            .then(res => {
                if (res.data.code === undefined) {
                    this.props.signin();
                } else {
                    let errors = {};
                    errors["serverError"] = res.data.message;
                    this.setState({errors})
                }
            });
        }
    }

    checkForm() {
        let errors = {};
        let formIsValid = true;

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
            } else if (item.minLength && this.inputs[index].value.length < item.minLength) {
                this.inputs[index].value = "";
                formIsValid = false;
                errors[index] = `Minimum ${item.minLength} caractères`;
            }
        }

        this.setState({errors});
        return formIsValid;
    }

    renderItem(index, item) {
        return (
            <div class="mb-4">
                <label 
                    for={item.label + "-input"}
                    class="form-label">
                    {item.label}
                    {item.mandatory &&
                        <span class="text-danger"> *</span>
                    }

                </label>
                {this.state.errors[index] && 
                    <div class="alert alert-danger p-2" role="alert">
                        {this.state.errors[index]}
                    </div>
                }
                <input 
                    type={item.type}
                    name={item.name}
                    class="form-control"
                    id={item.label + "-input"}
                    ref={(input) => {
                        this.inputs[index] = input;
                    }}
                    onKeyPress={
                        event => {
                            if (event.key === "Enter")
                                this.createUser();
                        }
                    }/>
            </div>
        )
    }

    render() {
        return (
            <div class="container box box-auth mt-5 p-4 mb-5">
                <h1 class="mb-3">Inscription</h1>
                <p class="mb-4">
                    Les champs obligatoires sont marqués par
                    <span class="text-danger"> * </span>.
                </p>

                {this.state.errors["serverError"] && 
                    <div class="alert alert-danger p-2" role="alert">
                        {this.state.errors["serverError"]}
                    </div>
                }

                {this.state.errors["email"] && 
                    <div class="alert alert-danger p-2" role="alert">
                        {this.state.errors["email"]}
                    </div>
                }

                <form>
                    {Object.keys(FORM).map((item) => this.renderItem(item, FORM[item]))}
                </form>
                <div class="d-flex justify-content-center">
                    <button
                        type="button"
                        name="connexion"
                        onClick={() => this.createUser()}
                        class="btn btn-primary m-1">
                        Inscription
                    </button>
                    <button 
                        type="button"
                        name="connexion"
                        onClick={() => this.props.signin()}
                        class="btn btn-light m-1">
                        J'ai déjà un compte
                    </button>
                </div>
            </div>
        )
    }

}
