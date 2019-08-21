import React, { Component } from 'react'
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react'
import { connect } from 'react-redux'
import { saveMapCoords } from '../redux/actions/index'
import { Redirect } from 'react-router-dom'
import { Button } from 'semantic-ui-react'
import InfoWindowEx from './infoWindowEx'

import '../styles/navbar.scss'

const uuidv1 = require('uuid/v1')

export class Maps extends Component {
    state = {
        data: [],
        loc_x: 0,
        loc_y: 0,
        locRendered: false,
        showingInfoWindow: false,
        activeMarker: {},
        selectedPlace: {},
        redirect: false,
        redirectId: 0
    }

    getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.showPosition)
        }
    }

    showPosition = position => {
        this.setState({
            loc_x: position.coords.latitude,
            loc_y: position.coords.longitude,
            locRendered: true
        })
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
                this.setState({ data: data.data })
                setTimeout(() => {
                    this.fetchRequestLocations()
                }, 20000)
            })
    }

    saveCoords = (mapProps, map, clickEven) => {
        if (window.location.pathname === '/c/request') {
            this.props.saveMapCoords(clickEven.latLng.lat(), clickEven.latLng.lng())
            document.querySelector('.custom-modal').style.visibility = 'visible'
            document.querySelector('.fader').style.visibility = 'visible'
        }
    }

    openContribution = id => {
        document.querySelector('.fader').style.visibility = 'visible'
        this.setState({
            redirect: true,
            redirectId: id,
            showingInfoWindow: false
        })
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to={`/c/contribution/${this.state.redirectId}`} />
        }
    }

    centerMoved = (mapProps, map) => {
        this.setState({
            loc_x: map.center.lat(),
            loc_y: map.center.lng()
        })
    }

    componentWillMount() {
        this.getUserLocation()
    }

    componentDidMount() {
        this.fetchRequestLocations()
    }

    render() {
        return (
            <div>
                {this.renderRedirect()}
                {this.state.locRendered ? (
                    <Map
                        google={this.props.google}
                        zoom={14}
                        styles={this.props.mapStyles}
                        disableDefaultUI={true}
                        onClick={this.saveCoords}
                        onDragend={this.centerMoved}
                        initialCenter={{
                            lat: this.state.loc_x,
                            lng: this.state.loc_y
                        }}
                    >
                        {this.state.data.map(m => {
                            if (m.status === 'open') {
                                if (m.request_type === 'normal') {
                                    return (
                                        <Marker
                                            key={uuidv1()}
                                            position={{ lat: m.x, lng: m.y }}
                                            title={m.title}
                                            data={m}
                                            onClick={this.onMarkerClick}
                                            icon={{
                                                url: '../../data/welfareroom.png',
                                                anchor: new this.props.google.maps.Point(48, 48),
                                                scaledSize: new this.props.google.maps.Size(48, 48)
                                            }}
                                        />
                                    )
                                } else {
                                    return (
                                        <Marker
                                            key={uuidv1()}
                                            position={{ lat: m.x, lng: m.y }}
                                            title={m.title}
                                            data={m}
                                            onClick={this.onMarkerClick}
                                            icon={{
                                                url: '../../data/tortillas1.png',
                                                anchor: new this.props.google.maps.Point(48, 48),
                                                scaledSize: new this.props.google.maps.Size(48, 48)
                                            }}
                                        />
                                    )
                                }
                            }
                        })}
                        <InfoWindowEx marker={this.state.activeMarker} visible={this.state.showingInfoWindow}>
                            <div>
                                <h1>{this.state.selectedPlace.title}</h1>
                                <div>{this.state.selectedPlace.description}</div>
                                <br />
                                <Button onClick={() => this.openContribution(this.state.selectedPlace.id)}>
                                    Read more
                                </Button>
                            </div>
                        </InfoWindowEx>
                    </Map>
                ) : null}
            </div>
        )
    }

    onMarkerClick = (props, marker) => {
        this.setState({
            selectedPlace: props.data,
            activeMarker: marker,
            showingInfoWindow: true,
            redirect: false
        })
    }
}

Maps.defaultProps = {
    mapStyles: [
        {
            elementType: 'geometry',
            stylers: [
                {
                    color: '#242f3e'
                }
            ]
        },
        {
            elementType: 'labels.text.fill',
            stylers: [
                {
                    color: '#746855'
                }
            ]
        },
        {
            elementType: 'labels.text.stroke',
            stylers: [
                {
                    color: '#242f3e'
                }
            ]
        },
        {
            featureType: 'administrative.land_parcel',
            elementType: 'labels',
            stylers: [
                {
                    visibility: 'off'
                }
            ]
        },
        {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [
                {
                    color: '#d59563'
                }
            ]
        },
        {
            featureType: 'poi',
            elementType: 'labels.text',
            stylers: [
                {
                    visibility: 'off'
                }
            ]
        },
        {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [
                {
                    color: '#d59563'
                }
            ]
        },
        {
            featureType: 'poi.business',
            stylers: [
                {
                    visibility: 'off'
                }
            ]
        },
        {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [
                {
                    color: '#263c3f'
                }
            ]
        },
        {
            featureType: 'poi.park',
            elementType: 'labels.text',
            stylers: [
                {
                    visibility: 'off'
                }
            ]
        },
        {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [
                {
                    color: '#6b9a76'
                }
            ]
        },
        {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [
                {
                    color: '#38414e'
                }
            ]
        },
        {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [
                {
                    color: '#212a37'
                }
            ]
        },
        {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [
                {
                    color: '#9ca5b3'
                }
            ]
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [
                {
                    color: '#746855'
                }
            ]
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [
                {
                    color: '#1f2835'
                }
            ]
        },
        {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [
                {
                    color: '#f3d19c'
                }
            ]
        },
        {
            featureType: 'road.local',
            elementType: 'labels',
            stylers: [
                {
                    visibility: 'off'
                }
            ]
        },
        {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [
                {
                    color: '#2f3948'
                }
            ]
        },
        {
            featureType: 'transit.station',
            elementType: 'labels.text.fill',
            stylers: [
                {
                    color: '#d59563'
                }
            ]
        },
        {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [
                {
                    color: '#17263c'
                }
            ]
        },
        {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [
                {
                    color: '#515c6d'
                }
            ]
        },
        {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [
                {
                    color: '#17263c'
                }
            ]
        }
    ]
}

function mapStateToProps(state) {
    return {
        x: state.x,
        y: state.y
    }
}

export default connect(
    mapStateToProps,
    { saveMapCoords }
)(
    GoogleApiWrapper({
        apiKey: 'AIzaSyCw1Cu5QmZqsFLWq-D7m12E3Qqjjj13xWY'
    })(Maps)
)
