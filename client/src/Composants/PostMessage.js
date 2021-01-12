import React, {Component} from "react";
import "../Styles/PostMessage.css"
import axios from 'axios'
import {read_cookie} from "sfcookies";
import addpicture from "../res/picture.jpg"

export default class PostMessage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            publication: null,
            file: null
        }
    }

    postTwist() {

        if (this.inputContent.textContent !== "") {


            const formData = new URLSearchParams();
            formData.append('key', read_cookie("key"));
            formData.append('content', this.inputContent.textContent);
            formData.append('op', "message");
            if (this.state.publication !== null)
                formData.append('photo', this.state.publication);


            this.inputContent.textContent = "";

            axios.post("http://localhost:8080/TwisterFinal/Messages", formData)
                .then(() => {
                    if (this.props.reload !== undefined) {
                        this.props.reload();
                    }
                    this.setState({
                        publication: null,
                        file: null
                    })
                });


        }


    }

    onChange(event) {
        this.setState({
            file: event.target.files[0]
        });
        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (e) => {

                this.setState({
                    publication: e.target.result
                });
            };
            reader.readAsDataURL(event.target.files[0]);
        }

    }


    render() {
        return (<div className="PostMessage">
            <div className="labels">
                Postez un message
            </div>
            {
                this.state.publication &&
                <div className="photo">
                    <a><img src={this.state.publication} alt=""/></a>
                </div>
            }
            <div onKeyPress={
                event => {
                    if (event.key === "Enter")
                        this.postTwist();
                }
            }
                 ref={(inputContent) => {
                     this.inputContent = inputContent
                 }}
                 contentEditable="true" className="newMessage"/>
            <label htmlFor="uploader" className="pictureUpload"><img src={addpicture}/></label>
            <input className="input-file" id="uploader" type="file" name="myImage" accept="image/*"
                   onChange={(e) => this.onChange(e)}/>
            <input type="submit" className="myButton" value="Publier" onClick={() => this.postTwist()}/>
        </div>);

    }


}
