import { SAVE_MAP_COORDS, RETURN_MAP_COORDS } from '../constants/action-types'

export function saveMapCoords(x, y) {
    return {
        type: SAVE_MAP_COORDS,
        payload: {
            x: x,
            y: y
        }
    }
}

export function getMapCoords() {
    return {
        type: RETURN_MAP_COORDS
    }
}
