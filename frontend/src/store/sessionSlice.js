import { createSlice } from '@reduxjs/toolkit';
// import { setSessionErrors } from './errorSlice';
import { errorActions } from './errorSlice';
import fetchAPI, { GET, POST, DELETE } from './fetch';
import { useSelector, useDispatch } from 'react-redux';
import { addUser, getUserFromStore, splitUsersPayload } from './userSlice';
import { addRestaurants } from './restaurantSlice';
import { checkUpdate } from './utils';



// URL Helpers
const SESSION_URL = '/api/session';

// Slice of state
export const sessionSlice = createSlice({
    name: 'session',
    initialState: {
        currentUserId: null
    },
    reducers: {
        login: (state, action) => ({ currentUserId: action.payload.session.currentUserId }),
        logout: () => ({ currentUserId: 0 })
    },
});

// Actions
const { login: loginAction, logout: logoutAction } = sessionSlice.actions;
const { setSessionErrors } = errorActions;

// Selectors


// Hooks
export const useSession = () => {
    const sessionUserId = useSelector(state => state.session.currentUserId);
    const currentUser = useSelector(getUserFromStore(sessionUserId));
    const isLoggedIn = sessionUserId !== null ? !!sessionUserId : null;
    return { currentUser, isLoggedIn };
}

// Split payloads
export const splitSessionUserPayload = payload => [loginAction(payload), ...splitUsersPayload(payload)];
const sessionErrorsWrapped = errors => [setSessionErrors(errors)];

// Thunks
export const login = user => dispatch => 
    fetchAPI(SESSION_URL, {
        method: POST,
        body: { user }
    }, splitSessionUserPayload, sessionErrorsWrapped)
        .then(actions => actions.forEach(dispatch));

export const getSession = () => dispatch => 
    fetchAPI(SESSION_URL, {
        method: GET,
    }, splitSessionUserPayload, sessionErrorsWrapped)
        .then(actions => actions.forEach(dispatch));

export const logout = () => dispatch => 
    fetchAPI(SESSION_URL, {
        method: DELETE
    }, logoutAction, setSessionErrors).then(dispatch);
  
// Reducer
export default sessionSlice.reducer;