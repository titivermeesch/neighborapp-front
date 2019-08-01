import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Container, Form, Button, Message } from 'semantic-ui-react'

import '../styles/login.scss'
import '../styles/animated_background.scss'
import '../styles/messages.scss'

class Login extends Component {
    state = {
        redirect: false
    }

    requestLogin = data => {
        fetch('https://neighborapp-backend.herokuapp.com/sessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'ERROR') {
                    document.querySelector('.mail-match-message').style.visibility = 'visible'
                } else {
                    this.setLocalStorageInformation(data)
                    this.setState({
                        redirect: true
                    })
                }
            })
            .catch(e => {
                console.log(e)
            })
    }

    setLocalStorageInformation = data => {
        localStorage.setItem('token', data.data.authentication_token)
        localStorage.setItem('email', data.data.email)
        localStorage.setItem('firstname', data.data.firstname)
        localStorage.setItem('lastname', data.data.lastname)
        localStorage.setItem('address', data.data.address)
        localStorage.setItem('username', data.data.username)
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to="/c" />
        }
    }

    hideErrorMessages = () => {
        document.querySelector('.mail-match-message').style.visibility = 'hidden'
    }

    generateJsonData = () => {
        this.hideErrorMessages()
        const email = document.querySelector('#email')
        const password = document.querySelector('#password')
        const formatedJson = {
            email: email.value.toLowerCase(),
            password: password.value
        }
        if (email.checkValidity() && password.checkValidity()) {
            this.requestLogin(JSON.stringify(formatedJson))
        }
    }

    componentDidMount() {
        document.querySelector('.mail-match-message').style.visibility = 'hidden'
    }

    render() {
        return (
            <div>
                {this.renderRedirect()}
                <Message
                    icon="cloud"
                    size={'small'}
                    header="Error"
                    content="It seems like your email and password don't match! Please try again."
                    negative
                    className="mail-match-message"
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
                    <div className="login">
                        <h1>Login</h1>
                        <Form>
                            <Form.Field>
                                <input placeholder="email@mail.com" id="email" type="email" required />
                            </Form.Field>
                            <Form.Field>
                                <input placeholder="*******" id="password" type="password" required />
                            </Form.Field>
                            <Button inverted type="submit" onClick={this.generateJsonData}>
                                Login
                            </Button>
                            <br />
                            <br />
                        </Form>
                        <Button onClick={() => (window.location = '/register')}>Register instead</Button>
                    </div>
                </Container>
            </div>
        )
    }
}

export default Login
