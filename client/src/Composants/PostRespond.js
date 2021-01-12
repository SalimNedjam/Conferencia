import React, {Component} from "react";
import "../Styles/RespondItem.css"
import axios from 'axios'
import {read_cookie} from "sfcookies";

export default class PostRespond extends Component {

    constructor(props) {
        super(props);
    }

    postComment() {
        if (this.inputContent.textContent !== "") {
            const params = new URLSearchParams();

            params.append('key', read_cookie("key"));
            params.append('content', this.inputContent.textContent);
            params.append('op', "comment");
            params.append('idMessage', this.props.parentId);


            axios.post("http://localhost:8080/TwisterFinal/Messages", params)
                .then(() => {
                    this.inputContent.textContent = "";

                    if (this.props.reload !== undefined) {
                        this.props.parentCom.setState({
                            writeComment: false,
                            showComments: true
                        });
                        this.props.reload();
                    }
                });
        }
    }

    render() {
        return (<div className="RespondItem">
            <div onKeyPress={
                event => {
                    if (event.key === "Enter")
                        this.postComment();
                }
            }
                 ref={(inputContent) => {
                     this.inputContent = inputContent
                 }}
                 contentEditable="true" className="newMessage"/>
            <input type="submit" className="myButton" value="Send" onClick={() => this.postComment()}/>
        </div>);

    }


}
