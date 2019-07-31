import { FETCH_REQUESTS, NEW_REQUEST } from './types'

export const fetchRequests = () => dispatch => {
    fetch(`http://localhost:3000/requests/${localStorage.getItem('email')}`)
        .then(res => res.json())
        .then(requests =>
            dispatch({
                type: FETCH_REQUESTS,
                payload: requests
            })
        )
}
