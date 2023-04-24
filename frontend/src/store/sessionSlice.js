import { createSlice } from '@reduxjs/toolkit';
// import { setSessionErrors } from './errorSlice';
import { errorActions } from './errorSlice';
import fetchAPI, { GET, POST, DELETE } from './fetch';
import { useSelector, useDispatch } from 'react-redux';
import { addUser, getUserFromStore } from './userSlice';

const SESSION_URL = '/api/session';

const { setSessionErrors } = errorActions;

export const sessionSlice = createSlice({
    name: 'session',
    initialState: {
        currentUserId: null
    },
    reducers: {
        login: (_, action) => ({ currentUserId: action.payload }),
        logout: () => ({ currentUserId: 0 })
    },
});
  
const { login: loginAction, logout: logoutAction } = sessionSlice.actions;

export const useSession = () => {
    const dispatch = useDispatch();
    const sessionUserId = useSelector(state => state.session.currentUserId);
    const currentUser = useSelector(getUserFromStore(sessionUserId));
    const isLoggedIn = currentUser && Object.keys(currentUser).length > 0;
    return { dispatch, currentUser, isLoggedIn };
}

export const splitSessionUserPayload = user => [loginAction(user.id ? user.id : 0), addUser(user)];
const sessionErrorsWrapped = errors => [setSessionErrors(errors)];

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
  
export default sessionSlice.reducer;