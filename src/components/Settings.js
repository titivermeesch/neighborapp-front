import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from 'semantic-ui-react'

import '../styles/modal.scss'

class Settings extends Component {
  hideFader = () => {
    document.getElementsByClassName('fader')[0].style.visibility = 'hidden'
  }

  render() {
    return (
      <div className='custom-modal'>
        <Link to='/c' onClick={this.hideFader}>
          <Icon name='close' className='close-button' size='big' />
        </Link>
        <h1>Settings</h1>
        <div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim facere
          ipsam deserunt eligendi, accusantium nemo.
        </div>
      </div>
    )
  }
}

export default Settings
