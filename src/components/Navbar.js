import React, { Component } from 'react'
import { Button, Icon, Menu, Sidebar } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

import Maps from './Maps'

import '../styles/navbar.scss'

export default class SidebarExampleTransitions extends Component {
    state = {
        visible: true,
        faded: false,
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
        if (this.state.faded && !this.state.visible) {
            this.setState({ faded: !this.state.faded })
            document.getElementsByClassName('fader')[0].style.visibility = 'hidden'
        } else {
            this.setState({ faded: !this.state.faded })
            document.getElementsByClassName('fader')[0].style.visibility = 'visible'
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
            window.location.pathname = '/login'
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
                    <Link to="/c">
                        <Menu.Item className="nav-item" onClick={this.handleAnimationChange}>
                            <Icon name="map" />
                            Map
                        </Menu.Item>
                    </Link>
                    <Link to="/c/contributions">
                        <Menu.Item className="nav-item" onClick={this.handleFadeChange}>
                            <Icon name="users" />
                            My Contributions
                        </Menu.Item>
                    </Link>
                    <Link to="/c/request">
                        <Menu.Item className="nav-item" onClick={this.handleFadeChange}>
                            <Icon name="paper plane outline" />
                            New Request
                        </Menu.Item>
                    </Link>
                    <Link to="/c/account">
                        <Menu.Item className="nav-item" onClick={this.handleFadeChange}>
                            <Icon name="user" />
                            Account
                        </Menu.Item>
                    </Link>
                    <Link to="/c/chat">
                        <Menu.Item className="nav-item" onClick={this.handleFadeChange}>
                            <Icon name="chat" />
                            Chat
                        </Menu.Item>
                    </Link>
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
