import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from '../reducers/index'
import createSagaMiddleware from 'redux-saga'

const initialiseSagaMiddleware = createSagaMiddleware()

const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(rootReducer, storeEnhancers(applyMiddleware(initialiseSagaMiddleware)))

export default store
