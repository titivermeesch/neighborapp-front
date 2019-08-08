import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Button, Confirm, Form, Icon, Message } from 'semantic-ui-react'

import '../styles/modal.scss'

let firstname, lastname, username, address, email, password, password_c

class Account extends Component {
    state = {
        open: false,
        firstname: localStorage.getItem('firstname'),
        lastname: localStorage.getItem('lastname'),
        username: localStorage.getItem('username'),
        email: localStorage.getItem('email'),
        address: localStorage.getItem('address')
    }

    show = () => {
        this.setState({ open: true })
    }

    handleConfirm = () => {
        this.setState({ open: false })
        fetch('https://neighborapp-backend.herokuapp.com/users', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Email': localStorage.getItem('email'),
                'X-User-Token': localStorage.getItem('token')
            }
        })
        window.location = '/'
    }

    handleCancel = () => {
        this.setState({ open: false })
    }

    hideFader = () => {
        document.getElementsByClassName('fader')[0].style.visibility = 'hidden'
    }

    updateUserAccount = () => {
        fetch('https://neighborapp-backend.herokuapp.com/users', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Email': localStorage.getItem('email'),
                'X-User-Token': localStorage.getItem('token')
            },
            body: JSON.stringify(this.generateData())
        }).then(() => {
            localStorage.setItem('email', email)
            localStorage.setItem('firstname', firstname)
            localStorage.setItem('lastname', lastname)
            localStorage.setItem('address', address)
            localStorage.setItem('username', username)
            this.setState({
                firstname: localStorage.getItem('firstname'),
                lastname: localStorage.getItem('lastname'),
                username: localStorage.getItem('username'),
                email: localStorage.getItem('email'),
                address: localStorage.getItem('address')
            })
            document.querySelector('.account-form').reset()
        })
    }

    generateData = () => {
        const email_check = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        firstname = document.getElementById('firstname').value
        lastname = document.getElementById('lastname').value
        username = document.getElementById('username').value
        address = document.getElementById('address').value
        email = document.getElementById('email').value
        password = document.getElementById('password').value
        password_c = document.getElementById('password_c').value

        if (firstname === '') {
            firstname = document.getElementById('firstname').placeholder
        }

        if (lastname === '') {
            lastname = document.getElementById('lastname').placeholder
        }

        if (username === '') {
            username = document.getElementById('username').placeholder
        }

        if (address === '') {
            address = document.getElementById('address').placeholder
        }

        if (email === '') {
            email = document.getElementById('email').placeholder
        }

        if (!email_check.test(String(email).toLowerCase())) {
        }

        if (password !== '') {
            if (password !== password_c) {
                document.querySelector('.password-match-message').style.visibility = 'visible'
            }
        }

        let data = {
            firstname: firstname,
            lastname: lastname,
            username: username,
            address: address,
            email: email,
            password: password
        }

        return data
    }

    render() {
        return (
            <div>
                <Message
                    icon="cloud"
                    size={'small'}
                    header="Error"
                    content="Email is not valid. Please try again."
                    negative
                    className="mail-match-message"
                />
                <Message
                    icon="cloud"
                    size={'small'}
                    header="Error"
                    content="Passwords don't match, please try again."
                    negative
                    className="password-match-message"
                />
                <div className="custom-modal">
                    <Link to="/c" onClick={this.hideFader}>
                        <Icon name="close" className="close-button" size="big" />
                    </Link>
                    <h1>My account</h1>
                    <div>
                        <Form className="account-form">
                            <Form.Field>
                                <label>First Name</label>
                                <input placeholder={this.state.firstname} id="firstname" />
                            </Form.Field>
                            <Form.Field>
                                <label>Last Name</label>
                                <input placeholder={this.state.lastname} id="lastname" />
                            </Form.Field>
                            <Form.Field>
                                <label>Username</label>
                                <input placeholder={this.state.username} id="username" />
                            </Form.Field>
                            <Form.Field>
                                <label>Email</label>
                                <input placeholder={this.state.email} id="email" />
                            </Form.Field>
                            <Form.Field>
                                <label>Address</label>
                                <input placeholder={this.state.address} id="address" />
                            </Form.Field>
                            <Form.Field>
                                <label>Password</label>
                                <input placeholder="*******" id="password" type="password" />
                            </Form.Field>
                            <Form.Field>
                                <label>Confirm password</label>
                                <input placeholder="*******" id="password_c" type="password" />
                            </Form.Field>
                        </Form>
                        <br />
                        <br />
                        <Button positive onClick={this.updateUserAccount}>
                            Save
                        </Button>
                        <Button onClick={this.show} className="account-delete-button">
                            Delete account
                        </Button>
                        <Confirm
                            open={this.state.open}
                            content="Are you sure you want to delete this account? All your information included ongoing requests and chat messages will be deleted!"
                            onCancel={this.handleCancel}
                            onConfirm={this.handleConfirm}
                            size={'mini'}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default Account
