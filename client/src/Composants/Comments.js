import React, {Component} from "react";
import PostRespond from "./PostRespond";
import '../Styles/Comment.css'
import profile from '../res/profile.png'
import {read_cookie} from "sfcookies";
import axios from 'axios'
import {timeSince} from "./Messages";

export default class Comments extends Component {

    constructor(props) {
        super(props);

        let comments = [];

        if (this.props.listComment !== undefined) {
            comments = this.props.listComment;
        }
        this.state = {
            date: this.props.date,
            idUser: this.props.idUser,
            id: this.props.id,
            file: null,
            writeComment: false,
            likes: this.props.likes ? this.props.likes : [],
            likeUsers: [],
            liked: this.props.likes ? this.props.likes.some(idLike => idLike === this.props.idUser) : false,
            comments: comments,
            showComments: false
        }

    }

    componentWillReceiveProps(nextProps) {


        if (this.props.listComment !== undefined) {
            this.setState({
                comments: nextProps.listComment
            });
        }
        this.setState({
            idUser: nextProps.idUser,
            id: nextProps.id,
            date: nextProps.date,

        })

    }

    componentDidMount() {
        const params = new URLSearchParams();
        params.append('key', read_cookie("key"));
        params.append('id', this.props.id);

        axios.get("http://localhost:8080/TwisterFinal/Image?" + params)
            .then(res => {
                this.setState({
                    image: res.data
                })
            });
        this.getLikesUsers();

    }

    onError() {
        this.setState({
            image: profile
        })
    }

    getLikesUsers() {
        this.setState({likeUsers: []});
        this.state.likes.map((id) => {
            const params = new URLSearchParams();
            params.append('key', read_cookie("key"));
            params.append('idUser', id);

            axios.post("http://localhost:8080/TwisterFinal/Login", params)
                .then(res => {
                    const Array = this.state.likeUsers;
                    Array.push(res.data);
                    this.setState({likeUsers: Array})
                })
        })
    }

    doLike() {
        if (!this.state.liked) {
            const params = new URLSearchParams();
            params.append('key', read_cookie("key"));
            params.append('idMessage', this.props.messageId);
            params.append('op', "like");

            axios.post("http://localhost:8080/TwisterFinal/Messages", params)
                .then(res => {
                    console.log(res.data.state);
                    if (res.data.state === "OK") {
                        const array = this.state.likes;
                        const index = array.indexOf(this.props.idUser);
                        if (index === -1) {
                            array.push(this.props.idUser);
                            this.setState({
                                likes: array,
                                liked: !this.state.liked
                            });
                        }
                        this.getLikesUsers()

                    }
                });
        }
        else {
            const params = new URLSearchParams();
            params.append('key', read_cookie("key"));
            params.append('idMessage', this.props.messageId);
            params.append('op', "dislike");
            axios.post("http://localhost:8080/TwisterFinal/Messages", params)
                .then(res => {
                    if (res.data.state === "OK") {
                        const array = this.state.likes;
                        const index = array.indexOf(this.props.idUser);
                        if (index !== -1) {
                            array.splice(index, 1);
                            this.setState({
                                likes: array,
                                liked: !this.state.liked
                            });
                        }

                    }
                    this.getLikesUsers()

                });
        }
    }

    removeMessage() {
        if (this.state.idUser === this.state.id) {
            const params = new URLSearchParams();
            params.append('key', read_cookie("key"));
            params.append('idMessage', this.props.messageId);
            params.append('op', "del");

            axios.post("http://localhost:8080/TwisterFinal/Messages", params)
                .then(res => {
                    if (res.data.state === "OK") {
                        this.props.reload();
                    }
                });
        }

    }

    render() {
        return (<div className="Comment">
            {
                this.state.idUser === this.state.id &&
                <a className="close" onClick={() => this.removeMessage()}>✕</a>
            }

            <div className="infos">
                <a
                    onClick={() => this.props.getuserprofile(this.props.id, this.props.login, this.props.name, this.props.lastname)}>
                    <img onError={this.onError.bind(this)} src={this.state.image}/>
                </a>

                <a className="name"
                   onClick={() => this.props.getuserprofile(this.props.id, this.props.login, this.props.name, this.props.lastname)}>
                    {this.props.name} {this.props.lastname}
                </a>

                <div className="username">
                    @{this.props.login} •
                    <a className="date">

                        {timeSince(new Date(this.state.date))}
                    </a>
                </div>
            </div>
            <div className="content">
                {this.props.content}
            </div>
            <div className="Reaction">
                <a onClick={() => this.doLike()}
                   className="inlined">{this.state.liked ? "Je n'aime plus" : "J'aime"}</a>
                <a
                    onClick={() => this.setState({writeComment: !this.state.writeComment})}
                    className="inlined">Commenter</a>

                <a className="showComments"
                   onClick={() => this.setState({showComments: !this.state.showComments})}>
                    {this.state.comments.length > 0 && this.state.comments.length + ' Commentaire(s)'}
                </a>

                {
                    <div className="dropdown">
                        {
                            this.state.likes.length > 0 &&
                            <a className="dropbtn"
                               onClick={() => this.setState({showList: !this.state.showList})}> {this.state.likes.length + ' Like(s)'}</a>

                        }
                        {
                            this.state.showList &&

                            <div className="dropdown-content">
                                {
                                    this.state.likeUsers.map((user) => <a>{user.nom} {user.prenom}</a>)

                                }

                            </div>
                        }

                    </div>
                }


            </div>

            {
                this.state.showComments && this.state.comments.length > 0 &&
                <div className="Comments">
                    {this.state.comments.map((article) => (
                        <Comments
                            date={article.date}
                            idUser={this.props.idUser}
                            getuserprofile={this.props.getuserprofile}
                            parentId={this.props.messageId}
                            name={article.author.prenom}
                            id={article.author.user_id}
                            lastname={article.author.nom}
                            login={article.author.login}
                            content={article.message}
                            listComment={article.comments}
                            messageId={article.message_id}
                            likes={article.likes}
                            key={article.message_id}
                            reload={this.props.reload}

                        />
                    ))}
                </div>
            }

            {this.state.writeComment &&
            <PostRespond reload={this.props.reload} parentId={this.props.messageId}
                         parentCom={this}/>}

        </div>);


    }


}
