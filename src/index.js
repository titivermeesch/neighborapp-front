import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store/index'

import App from './App'
import Login from './components/Login'
import Register from './components/Register'

import './index.css'

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Route path="/c" component={App} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
)
