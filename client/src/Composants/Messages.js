import React, {Component} from "react";
import PostRespond from "./PostRespond";
import Comments from "./Comments";
import '../Styles/Articles.css'
import profile from '../res/profile.png'
import {read_cookie} from "sfcookies";
import axios from 'axios'

export function timeSince(time) {


    switch (typeof time) {
        case 'number':
            break;
        case 'string':
            time = +new Date(time);
            break;
        case 'object':
            if (time.constructor === Date) time = time.getTime();
            break;
        default:
            time = +new Date();
    }
    const time_formats = [
        [60, 'secondes', 1],
        [120, 'une minute'],
        [3600, 'minutes', 60],
        [7200, 'une heure'],
        [86400, 'heures', 3600],
        [172800, 'un jour'],
        [604800, 'jours', 86400],
        [1209600, 'semaine'],
        [2419200, 'semaines', 604800],
        [4838400, 'un mois'],
        [29030400, 'mois', 2419200],
        [58060800, 'un an'],
        [2903040000, 'ans', 29030400],

    ];
    const seconds = (+new Date() - time) / 1000,
        token = 'il y a ',
        list_choice = 1;

    if (seconds < 5) {
        return 'Maintenant'
    }

    let i = 0,
        format;
    while (format = time_formats[i++])
        if (seconds < format[0]) {
            if (typeof format[2] !== 'number')
                return token + format[list_choice];
            else
                return token + Math.floor(seconds / format[2]) + ' ' + format[1];
        }
    return time;

}

export default class Messages extends Component {

    constructor(props) {
        super(props);


        let articles = [];

        if (this.props.listComment !== undefined) {
            articles = this.props.listComment;
        }

        this.state = {
            date: this.props.date,
            idUser: this.props.idUser,
            id: this.props.id,
            publication: this.props.publication,
            file: null,
            writeComment: false,
            likeUsers: [],
            likes: this.props.likes,
            liked: this.props.likes ? this.props.likes.some(idLike => idLike === this.props.idUser) : false,
            showComments: false,
            articles: articles
        }

    }


    componentWillReceiveProps(nextProps) {
        if (this.props.listComment !== undefined) {
            this.setState({
                articles: nextProps.listComment
            });
        }
        this.setState({
            idUser: nextProps.idUser,
            id: nextProps.id,
            date: nextProps.date,
        })

    }


    onError() {
        this.setState({
            image: profile
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


    doLike() {
        if (!this.state.liked) {
            const params = new URLSearchParams();
            params.append('key', read_cookie("key"));
            params.append('idMessage', this.props.messageId);
            params.append('op', "like");

            axios.post("http://localhost:8080/TwisterFinal/Messages", params)
                .then(res => {
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
                    console.log(res.data.state);
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
                        this.getLikesUsers()

                    }
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

    render() {


        return (<div className="Articles">

                {
                    this.state.idUser === this.state.id &&
                    <a className="close" onClick={() => this.removeMessage()}>✕</a>
                }
                <div className="infos">
                    <a
                        onClick={() => this.props.getuserprofile(this.props.id, this.props.login, this.props.name, this.props.lastname)}>
                        <img className="profile" onError={this.onError.bind(this)} src={this.state.image}/>
                    </a>

                    <a className="name"
                       onClick={() => this.props.getuserprofile(this.props.id, this.props.login, this.props.name, this.props.lastname)}>

                        {this.props.name} {this.props.lastname}
                    </a>

                    <div className="username">
                        @{this.props.login} •
                        <label className="date">
                            {timeSince(new Date(this.state.date))}
                        </label>
                    </div>

                </div>
                <div className="content">
                    {this.props.content}
                </div>
                {
                    this.state.publication &&
                    <div className="photo">
                        <a href={this.state.publication}><img src={this.state.publication} alt=""/></a>
                    </div>
                }

                <div className="Reaction">
                    <a onClick={() => this.doLike()}
                       className="inlined">{this.state.liked ? "Je n'aime plus" : "J'aime"}</a>
                    <a
                        onClick={() => this.setState({writeComment: !this.state.writeComment})}
                        className="inlined">Commenter</a>

                    <a className="showComments"
                       onClick={() => this.setState({showComments: !this.state.showComments})}>
                        {this.state.articles.length > 0 && this.state.articles.length + ' Commentaire(s)'}
                    </a>
                    <br/>


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

                                        this.state.likeUsers.map((user) =>
                                            <a
                                                className="name"
                                                onClick={() => this.props.getuserprofile(user.user, user.login, user.nom, user.prenom)}
                                            >
                                                {user.prenom} {user.nom}
                                            </a>)

                                    }

                                </div>
                            }

                        </div>
                    }


                </div>


                {
                    this.state.showComments && this.state.articles.length > 0 &&
                    <div className="Comments">
                        {this.state.articles.map((article) => (
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
                {
                    this.state.writeComment &&
                    <PostRespond reload={this.props.reload} parentId={this.props.messageId} parentCom={this}/>
                }
            </div>
        );


    }


}
