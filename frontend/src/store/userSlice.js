import { createSlice } from '@reduxjs/toolkit';
import fetchAPI, { GET, POST } from './fetch';
import { errorActions } from './errorSlice';
import { splitSessionUserPayload } from './sessionSlice';

const { setUserErrors } = errorActions;

export const signUp = user => dispatch => 
    fetchAPI('/api/users', {
        method: POST, 
        body: { user }
    }, splitSessionUserPayload, userErrorsWrapped).then(actions => actions.forEach(dispatch));

export const getUser = id => dispatch => fetchAPI(
    `/api/users/${id}`, { method: GET }, addUser, setUserErrors
).then(dispatch);

export const getUserFromStore = userId => state => state.entities.users[userId];

const userErrorsWrapped = errors => [setUserErrors(errors)];

export const userSlice = createSlice({
    name: 'users',
    initialState: {},
    reducers: {
        addUsers: (state, action) => ({ ...state, ...action.payload }),
        addUser: (state, action) => ({ ...state, [action.payload.id]: action.payload })
    },
});

export const { addUser } = userSlice.actions;
  
export default userSlice.reducer;