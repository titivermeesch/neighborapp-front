import React, { Component } from 'react'
import { Form, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import ScrollToBottom from 'react-scroll-to-bottom'
import { css } from 'glamor'

import '../styles/modal.scss'

const ROOT_CSS = css({
    height: 500
})

class ChatThread extends Component {
    state = {
        data: [],
        messages: []
    }

    async postChatMessage(data) {
        await fetch(`https://neighborapp-backend.herokuapp.com/messages/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Email': localStorage.getItem('email'),
                'X-User-Token': localStorage.getItem('token')
            },
            body: data
        })
        this.fetchMessages()
    }

    async requestChat() {
        await fetch(`https://neighborapp-backend.herokuapp.com/chat_discussions/${this.props.match.params.id}`, {
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

    async fetchMessages() {
        await fetch(`https://neighborapp-backend.herokuapp.com/messages/${this.props.match.params.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Email': localStorage.getItem('email'),
                'X-User-Token': localStorage.getItem('token')
            }
        })
            .then(res => res.json())
            .then(data => this.setState({ messages: data.data }))
            .catch(e => {
                console.log(e)
            })
    }

    requestMessageSave = () => {
        const id = this.props.match.params.id
        const owner = localStorage.getItem('email')
        const content = document.querySelector('#message').value

        const json = {
            thread_id: id,
            message_author: owner,
            content: content,
            date: new Date()
        }
        this.postChatMessage(JSON.stringify(json))
        document.querySelector('.request-form').reset()
    }

    hideFader = () => {
        document.getElementsByClassName('fader')[0].style.visibility = 'hidden'
    }

    componentDidMount() {
        this.requestChat()
        this.fetchMessages()
    }

    render() {
        return (
            <div>
                {this.state.data.map(d => {
                    return (
                        <div className="custom-modal" key={d.id}>
                            <Link to="/c" onClick={this.hideFader}>
                                <Icon name="close" className="close-button" size="big" />
                            </Link>
                            <h1>Chat : {d.title}</h1>
                            <ScrollToBottom className={ROOT_CSS} scrollViewClassName="scroll-chat">
                                <div className="chat-holder">
                                    {this.state.messages.map(m => {
                                        if (m.message_author === localStorage.getItem('email')) {
                                            return (
                                                <div>
                                                    <div className="chat-bubble chat-right" key={m.id}>
                                                        Me : {m.content}
                                                    </div>
                                                    <br />
                                                    <br />
                                                    <br />
                                                </div>
                                            )
                                        } else {
                                            return (
                                                <div>
                                                    <div className="chat-bubble chat-left" key={m.id}>
                                                        {m.message_author} : {m.content}
                                                    </div>
                                                    <br />
                                                </div>
                                            )
                                        }
                                    })}
                                </div>
                            </ScrollToBottom>
                            <Form className="request-form" onSubmit={this.requestMessageSave}>
                                <Form.Field>
                                    <input placeholder="Write your message" id="message" maxLength="150" />
                                </Form.Field>
                            </Form>
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default ChatThread
