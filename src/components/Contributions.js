import React, { Component } from 'react'
import { Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

import '../styles/modal.scss'

const uuidv1 = require('uuid/v1')

class Contributions extends Component {
    state = {
        renderer: false,
        participations: [],
        requests: []
    }

    componentWillMount() {
        this.fetchContributions()
        this.getParticipatingContributions()
    }

    fetchContributions = () => {
        fetch(`https://neighborapp-backend.herokuapp.com/requests/${localStorage.getItem('email')}`, {
            headers: {
                'Content-Type': 'application/json',
                'X-User-Email': localStorage.getItem('email'),
                'X-User-Token': localStorage.getItem('token')
            }
        })
            .then(res => res.json())
            .then(data => {
                localStorage.setItem('requests', JSON.stringify(data.data))
                this.setState({
                    requests: JSON.parse(localStorage.getItem('requests')),
                    rendered: true
                })
            })
    }

    getParticipatingContributions = () => {
        fetch(`https://neighborapp-backend.herokuapp.com/participant_link/${localStorage.getItem('email')}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Email': localStorage.getItem('email'),
                'X-User-Token': localStorage.getItem('token')
            }
        })
            .then(res => res.json())
            .then(data => this.setState({ participations: data.data }))
    }

    deleteContribution = id => () => {
        this.setState({ open: false })

        fetch(`https://neighborapp-backend.herokuapp.com/requests/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Email': localStorage.getItem('email'),
                'X-User-Token': localStorage.getItem('token')
            }
        })

        const requests = this.state.requests.filter(v => v.id !== id)
        localStorage.setItem('requests', JSON.stringify(requests))
        this.setState({ requests: requests })
    }

    hideFader = () => {
        document.getElementsByClassName('fader')[0].style.visibility = 'hidden'
    }

    render() {
        return (
            <div className="custom-modal">
                <Link to="/c" onClick={this.hideFader}>
                    <Icon name="close" className="close-button" size="big" />
                </Link>

                <h1>Your contributions</h1>
                {this.state.rendered
                    ? this.state.requests.map(key => {
                          return (
                              <div className="chat-thread" key={uuidv1()}>
                                  <Link to={`/c/contribution/${key.id}`}>
                                      <div>
                                          <h2>{key.title}</h2>
                                          <p>{key.description}</p>
                                      </div>
                                  </Link>
                                  <div>
                                      <Icon
                                          name="close"
                                          className="request-delete"
                                          size="big"
                                          onClick={this.deleteContribution(key.id)}
                                      />
                                  </div>
                              </div>
                          )
                      })
                    : ''}
                {this.state.participations.map(d => {
                    return (
                        <div className="chat-thread" key={uuidv1()}>
                            <Link to={`/c/contribution/${d.id}`}>
                                <div>
                                    <h2>{d.title}</h2>
                                    <p>{d.description}</p>
                                </div>
                            </Link>
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default Contributions
