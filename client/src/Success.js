import React, {Component} from "react";

export default class Success extends Component {

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div className="SuccessForgot">
                <div className="input_container">
                    <div>{this.props.message}</div>
                    <div className="links">
                        <a onClick={() => this.props.signin()}>Revenir à
                            l'authentification</a>

                    </div>

                </div>


            </div>


        );

    }


}
