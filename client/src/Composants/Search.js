import React, {Component} from "react";
import "../Styles/Recherche.css"
import {read_cookie} from "sfcookies";
import axios from 'axios'

export default class Search extends Component {

    constructor(props) {
        super(props);


    }

    handleSearch() {
        if (!(this.inputSearch.value === "")) {
            const params1 = new URLSearchParams();

            params1.append('key', read_cookie("key"));
            params1.append('query', this.inputSearch.value);
            axios.post("http://localhost:8080/TwisterFinal/Search?", params1)
                .then(res => {
                    this.inputSearch.value = "";
                    this.props.doSearch(res.data[1].Users, res.data[0].Messages[0])
                });

        }
    }


    render() {

        return (

            <div className="Recherche">
                <div className="inlined">
                    <input
                        onKeyPress={event => {
                            if (event.key === "Enter")
                                this.handleSearch();

                        }
                        }

                        ref={(inputSearch) => {
                            this.inputSearch = inputSearch
                        }}
                        type="text" className="search"/>
                </div>
                <div className="inlined">
                    <input type="submit" className="myButton" value="Search" onClick={() => this.handleSearch()
                    }/>

                </div>
            </div>


        );


    }


}
