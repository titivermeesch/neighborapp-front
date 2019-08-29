import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from 'semantic-ui-react'

import '../styles/modal.scss'
import '../styles/chat.scss'

class Chat extends Component {
    state = {
        data: [],
        data2: []
    }
    hideFader = () => {
        document.getElementsByClassName('fader')[0].style.visibility = 'hidden'
    }

    requestParticipantThread = () => {
        fetch(`https://neighborapp-backend.herokuapp.com/chat_link/${localStorage.getItem('email')}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Email': localStorage.getItem('email'),
                'X-User-Token': localStorage.getItem('token')
            }
        })
            .then(res => res.json())
            .then(data => this.setState({ data2: data.data }))
    }

    requestThread(data) {
        fetch(`https://neighborapp-backend.herokuapp.com/message_threads/${data}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Email': localStorage.getItem('email'),
                'X-User-Token': localStorage.getItem('token')
            }
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ data: data.data })
            })
            .catch(e => {
                console.log(e)
            })
    }

    componentWillMount() {
        this.requestThread(localStorage.getItem('email'))
        this.requestParticipantThread()
    }

    render() {
        return (
            <div className="custom-modal">
                <Link to="/c" onClick={this.hideFader}>
                    <Icon name="close" className="close-button" size="big" />
                </Link>
                <h1>Chat</h1>
                {this.state.data.map(d => {
                    return (
                        <Link to={`/c/chatthread/${d.id}`}>
                            <div className="chat-thread">
                                <div>
                                    <h2>{d.title}</h2>
                                </div>
                            </div>
                        </Link>
                    )
                })}
                {this.state.data2.map(d => {
                    return (
                        <Link to={`/c/chatthread/${d.id}`}>
                            <div className="chat-thread">
                                <div>
                                    <h2>{d.title}</h2>
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        )
    }
}

export default Chat
