import { SAVE_MAP_COORDS } from '../constants/action-types'

const initialState = {
    x: 0,
    y: 0
}

function rootReducer(state = initialState, action) {
    switch (action.type) {
        case SAVE_MAP_COORDS:
            return Object.assign({}, state, {
                x: action.payload.x,
                y: action.payload.y
            })
        default:
            return state
    }
}

export default rootReducer
