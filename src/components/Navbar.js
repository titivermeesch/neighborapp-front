import React, { Component } from 'react'
import { Button, Icon, Menu, Sidebar } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

import Maps from './Maps'

import '../styles/navbar.scss'

export default class SidebarExampleTransitions extends Component {
    state = {
        visible: true,
        contributions: 0
    }

    handleAnimationChange = () => {
        this.setState({ visible: !this.state.visible })
        if (this.state.visible) {
            this.setState({ faded: false })
            document.getElementsByClassName('fader')[0].style.visibility = 'hidden'
        }
    }

    handleFadeChange = () => {
        if (!this.state.visible) {
            document.getElementsByClassName('fader')[0].style.visibility = 'hidden'
        } else {
            document.getElementsByClassName('fader')[0].style.visibility = 'visible'
        }

        if (window.innerWidth <= 700) {
            this.setState({
                visible: false
            })
        }
    }

    destroySession = () => {
        fetch(`https://neighborapp-backend.herokuapp.com/sessions/${localStorage.getItem('token')}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Email': localStorage.getItem('email'),
                'X-User-Token': localStorage.getItem('token')
            }
        }).then(() => {
            localStorage.clear()
            window.location.pathname = '/'
        })
    }

    logout = () => {
        this.destroySession()
    }

    fetchRequestLocations = () => {
        fetch(`https://neighborapp-backend.herokuapp.com/requests/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Email': localStorage.getItem('email'),
                'X-User-Token': localStorage.getItem('token')
            }
        })
            .then(res => res.json())
            .then(data => {
                this.setState({
                    contributions: data.data.filter(w => w.status === 'open').length
                })
                setTimeout(() => {
                    this.fetchRequestLocations()
                }, 2000)
            })
    }

    componentWillMount() {
        this.fetchRequestLocations()
    }

    render() {
        return (
            <div>
                <Button onClick={this.handleAnimationChange} className="toggle-button">
                    <Icon name="sidebar" size={'big'} />
                </Button>
                <Sidebar
                    as={Menu}
                    animation="overlay"
                    direction="left"
                    icon="labeled"
                    vertical
                    visible={this.state.visible}
                    width="thin"
                    className="navbar"
                >
                    <Menu.Item className="nav-item" onClick={this.handleAnimationChange} as={Link} to="/c">
                        <Icon name="map" />
                        Map
                    </Menu.Item>

                    <Menu.Item className="nav-item" onClick={this.handleFadeChange} as={Link} to="/c/contributions">
                        <Icon name="users" />
                        My Contributions
                    </Menu.Item>

                    <Menu.Item className="nav-item" onClick={this.handleFadeChange} as={Link} to="/c/request">
                        <Icon name="paper plane outline" />
                        New Request
                    </Menu.Item>

                    <Menu.Item className="nav-item" onClick={this.handleFadeChange} as={Link} to="/c/account">
                        <Icon name="user" />
                        Account
                    </Menu.Item>

                    <Menu.Item className="nav-item" onClick={this.handleFadeChange} as={Link} to="/c/chat">
                        <Icon name="chat" />
                        Chat
                    </Menu.Item>

                    <Menu.Item className="nav-item logout-button" onClick={this.logout}>
                        <Icon name="window close" />
                        <strong>Logout</strong>
                    </Menu.Item>

                    <div className="count-contributions">
                        {this.state.contributions}
                        <br />
                        Uncompleted contributions
                    </div>
                </Sidebar>
                <Maps />
            </div>
        )
    }
}
