import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Container, Form, Button, Message } from 'semantic-ui-react'

import '../styles/register.scss'
import '../styles/animated_background.scss'

class Register extends Component {
    state = {
        redirect: false
    }

    requestAccountCreation(data) {
        this.hideErrorMessages()

        fetch('https://neighborapp-backend.herokuapp.com/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        })
            .then(res => res.json())
            .then(data => {
                if (data.data.email[0] === 'has already been taken') {
                    document.querySelector('.email-exists-message').style.visibility = 'visible'
                } else {
                    this.setState({
                        redirect: true
                    })
                }
            })
            .catch(e => {
                console.log(e)
            })
    }

    generateJsonData = () => {
        const firstname = document.querySelector('#firstname').value
        const lastname = document.querySelector('#lastname').value
        const username = document.querySelector('#username').value
        const email = document.querySelector('#email').value
        const address = document.querySelector('#address').value
        const password = document.querySelector('#password').value
        const password_c = document.querySelector('#password_c').value
        const idcard = document.querySelector('#idcard').value

        if (document.querySelector('form').checkValidity()) {
            if (password === password_c) {
                const formatedJson = {
                    firstname: firstname,
                    lastname: lastname,
                    username: username,
                    email: email.toLowerCase(),
                    address: address,
                    password: password,
                    idcard: idcard
                }
                this.requestAccountCreation(JSON.stringify(formatedJson))
            } else {
                document.querySelector('.invalid-pass-message').style.visibility = 'visible'
            }
        }
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to="/" />
        }
    }

    hideErrorMessages = () => {
        document.querySelector('.email-exists-message').style.visibility = 'hidden'
        document.querySelector('.invalid-pass-message').style.visibility = 'hidden'
    }

    componentDidMount() {
        this.hideErrorMessages()
    }

    render() {
        return (
            <div>
                {this.renderRedirect()}
                <Message
                    icon="cloud"
                    size={'small'}
                    header="Error"
                    content="This email already exists"
                    negative
                    className="email-exists-message"
                />
                <Message
                    icon="cloud"
                    size={'small'}
                    header="Error"
                    content="Your passwords are not the same"
                    negative
                    className="invalid-pass-message"
                />
                <div className="area">
                    <ul className="circles">
                        <li />
                        <li />
                        <li />
                        <li />
                        <li />
                        <li />
                        <li />
                        <li />
                        <li />
                        <li />
                    </ul>
                </div>
                <Container textAlign={'center'}>
                    <div className="register">
                        <h1>Register</h1>
                        <Form>
                            <Form.Field>
                                <input placeholder="First Name" id="firstname" required />
                            </Form.Field>
                            <Form.Field>
                                <input placeholder="Last Name" id="lastname" required />
                            </Form.Field>
                            <Form.Field>
                                <input placeholder="Username (display name)" id="username" required />
                            </Form.Field>
                            <Form.Field>
                                <input placeholder="Email" id="email" type="email" required />
                            </Form.Field>
                            <Form.Field>
                                <input placeholder="Address" id="address" required />
                            </Form.Field>
                            <Form.Field>
                                <input placeholder="Password" id="password" type="password" required />
                            </Form.Field>
                            <Form.Field>
                                <input placeholder="Password confirmation" type="password" id="password_c" required />
                            </Form.Field>
                            <Form.Field>
                                <label>Id card</label>
                                <input
                                    placeholder="Id card"
                                    id="idcard"
                                    type="file"
                                    accept="image/*, application/pdf"
                                    required
                                />
                            </Form.Field>
                            <Button inverted type="submit" onClick={this.generateJsonData}>
                                Create an account
                            </Button>
                            <br />
                            <br />
                        </Form>
                        <Button onClick={() => (window.location = '/')}>Login instead</Button>
                    </div>
                </Container>
            </div>
        )
    }
}
export default Register
