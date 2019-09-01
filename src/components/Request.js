import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Form, Button, Message } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { getMapCoords } from '../redux/actions/index'

import '../styles/modal.scss'

class Request extends Component {
    getLocation = () => {
        document.querySelector('.custom-modal').style.visibility = 'hidden'
        document.querySelector('.fader').style.visibility = 'hidden'
        this.props.getMapCoords()
    }

    requestCreation = data => {
        fetch('https://neighborapp-backend.herokuapp.com/requests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Email': localStorage.getItem('email'),
                'X-User-Token': localStorage.getItem('token')
            },
            body: data
        })
            .then(response => response.json())
            .then(data => {
                this.requestMessageThreadCreation(data)
                document.querySelector('.request-saved-message').style.visibility = 'visible'
                document.querySelector('.request-form').reset()
                setTimeout(() => {
                    const m = document.querySelector('.request-saved-message')
                    if (m) m.style.visibility = 'hidden'
                }, 2000)
            })
            .catch(e => {
                console.log(e)
            })
    }

    requestMessageThreadCreation = data => {
        const chatJson = {
            thread_owner: data.data.user_id,
            title: data.data.title,
            id_request: data.data.id
        }

        fetch('https://neighborapp-backend.herokuapp.com/message_threads', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Email': localStorage.getItem('email'),
                'X-User-Token': localStorage.getItem('token')
            },
            body: JSON.stringify(chatJson)
        }).catch(e => {
            console.log(e)
        })
    }

    generateJsonData = () => {
        const title = document.querySelector('#title').value
        const type = document.querySelector('#type')
        const typeF = type.options[type.selectedIndex].value
        const date = document.querySelector('#date').value
        const people = document.querySelector('#people').value
        const description = document.querySelector('#description').value
        const x = this.props.x
        const y = this.props.y

        if (title !== '' && typeF !== '' && date !== '' && people !== '' && description !== '' && x !== 0 && y !== 0) {
            const formatedJson = {
                user_id: localStorage.getItem('email'),
                title: title,
                request_type: typeF,
                date: date,
                required_people: people,
                x: x,
                y: y,
                status: 'open',
                description: description
            }
            this.requestCreation(JSON.stringify(formatedJson))
        } else if (x === 0 && y === 0) {
            document.querySelector('.request-location-message').style.visibility = 'visible'
            setTimeout(() => {
                document.querySelector('.request-location-message').style.visibility = 'hidden'
            }, 2000)
        } else {
            document.querySelector('.request-error-message').style.visibility = 'visible'
            setTimeout(() => {
                document.querySelector('.request-error-message').style.visibility = 'hidden'
            }, 2000)
        }
    }

    hideFader = () => {
        document.getElementsByClassName('fader')[0].style.visibility = 'hidden'
    }

    render() {
        return (
            <div>
                <Message
                    icon="inbox"
                    header="Saved!"
                    content="We succesfully saved your request."
                    positive
                    className="request-saved-message"
                />
                <Message
                    icon="inbox"
                    header="Error"
                    content="We are missing some information here..."
                    negative
                    className="request-error-message"
                />
                <Message
                    icon="inbox"
                    header="Error"
                    content="You didn't pick a location..."
                    negative
                    className="request-location-message"
                />
                <div className="custom-modal">
                    <Link to="/c" onClick={this.hideFader}>
                        <Icon name="close" className="close-button" size="big" />
                    </Link>

                    <h1>Make a request</h1>
                    <Form className="request-form">
                        <Form.Field required>
                            <label>Title</label>
                            <input placeholder="Title" id="title" required />
                        </Form.Field>
                        <Form.Field>
                            <label>Type</label>
                            <select name="types" id="type">
                                <option value="normal">Normal request</option>
                                <option value="goods">Material</option>
                            </select>
                        </Form.Field>
                        <Form.Field required>
                            <label>Date</label>
                            <input placeholder="Username" type="date" id="date" required />
                        </Form.Field>
                        <Form.Field required>
                            <label>People required</label>
                            <input placeholder="People required" type="number" id="people" min="1" required />
                        </Form.Field>
                        <Form.Field className="hidden-form" required>
                            <label>Latitude</label>
                            <input type="number" id="x" defaultValue={this.props.x} required />
                        </Form.Field>
                        <Form.Field className="hidden-form" required>
                            <label>Longitude</label>
                            <input type="number" id="y" defaultValue={this.props.y} required />
                        </Form.Field>
                        <Form.TextArea
                            label="Description (Max 300 characters)"
                            placeholder="Tell us more about your request"
                            id="description"
                            required
                            maxLength="300"
                        />
                        <Button onClick={this.getLocation}>Pick location on map</Button>
                        <Button onClick={this.generateJsonData} positive>
                            Save
                        </Button>
                    </Form>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        x: state.x,
        y: state.y
    }
}

export default connect(
    mapStateToProps,
    { getMapCoords }
)(Request)
