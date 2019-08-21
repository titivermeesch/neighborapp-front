import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Button } from 'semantic-ui-react'

import '../styles/modal.scss'

const uuidv1 = require('uuid/v1')

class Contribution extends Component {
    state = {
        data: [],
        participants: []
    }

    async requestSpecificContribution() {
        await fetch(`https://neighborapp-backend.herokuapp.com/contributions/${this.props.match.params.id}`, {
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

    participateToContribution = id_request => {
        const d = {
            id_request: id_request,
            user_id: localStorage.getItem('email')
        }

        fetch(`https://neighborapp-backend.herokuapp.com/contributions/${this.props.match.params.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Email': localStorage.getItem('email'),
                'X-User-Token': localStorage.getItem('token')
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.data[0].status === 'open') {
                    fetch('https://neighborapp-backend.herokuapp.com/participants', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-User-Email': localStorage.getItem('email'),
                            'X-User-Token': localStorage.getItem('token')
                        },
                        body: JSON.stringify(d)
                    }).then(res => res.json())
                    window.location.reload()
                }
            })
    }

    removeParticipationToContribution = id_request => {
        fetch(`https://neighborapp-backend.herokuapp.com/participants/${id_request}/${localStorage.getItem('email')}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Email': localStorage.getItem('email'),
                'X-User-Token': localStorage.getItem('token')
            }
        }).then(() => window.location.reload())
    }

    getFullfilledButton = d => {
        if (d.required_people === 0) {
            if (localStorage.getItem('email') === d.user_id) {
                return <Button onClick={() => this.markAsCompleted(d)}>Mark as completed (You can't undo this)</Button>
            }
        }
    }

    markAsCompleted = d => {
        fetch(`https://neighborapp-backend.herokuapp.com/requests/${d.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Email': localStorage.getItem('email'),
                'X-User-Token': localStorage.getItem('token')
            }
        })
    }

    getParticipateButton = c => {
        let id = c.user_id
        let b = false
        if (id !== localStorage.getItem('email')) {
            this.state.participants.map(st => {
                if (st.user_id === localStorage.getItem('email')) {
                    b = true
                }
            })

            if (!b) {
                return (
                    <Button positive onClick={() => this.participateToContribution(c.id)}>
                        Participate
                    </Button>
                )
            } else {
                return (
                    <Button negative onClick={() => this.removeParticipationToContribution(c.id)}>
                        Stop participating
                    </Button>
                )
            }
        }
    }

    getParticipantsForRequest = id => {
        fetch(`https://neighborapp-backend.herokuapp.com/participants/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Email': localStorage.getItem('email'),
                'X-User-Token': localStorage.getItem('token')
            }
        })
            .then(res => res.json())
            .then(data => this.setState({ participants: data.data }))
    }

    componentDidMount() {
        this.requestSpecificContribution()
        this.getParticipantsForRequest(this.props.match.params.id)
    }

    forceRemoveParticipant = id => {
        fetch(`https://neighborapp-backend.herokuapp.com/participants/${this.props.match.params.id}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Email': localStorage.getItem('email'),
                'X-User-Token': localStorage.getItem('token')
            }
        }).then(() => window.location.reload())
    }

    hideFader = () => {
        document.getElementsByClassName('fader')[0].style.visibility = 'hidden'
    }

    render() {
        return (
            <div>
                {this.state.data.map(d => {
                    return (
                        <div className="custom-modal" key={uuidv1()}>
                            <Link to="/c" onClick={this.hideFader}>
                                <Icon name="close" className="close-button" size="big" />
                            </Link>
                            <h1>
                                {d.title} (Status : {d.status})
                            </h1>
                            <p>{d.description}</p>
                            <p>Request created by {d.user_id}</p>
                            <p>Required people : {d.required_people}</p>
                            <p>Participants: (Click on one to remove him from the participants)</p>
                            {this.state.participants.map(p => {
                                if (localStorage.getItem('email') === d.user_id) {
                                    return (
                                        <div
                                            key={uuidv1()}
                                            onClick={() => this.forceRemoveParticipant(p.user_id)}
                                            className="participant-name"
                                        >
                                            {p.user_id}
                                        </div>
                                    )
                                } else {
                                    return <div key={uuidv1()}>{p.user_id}</div>
                                }
                            })}
                            {this.getParticipateButton(d)}
                            {this.getFullfilledButton(d)}
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default Contribution
