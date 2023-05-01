import { createSlice } from '@reduxjs/toolkit';
import fetchAPI, { GET, POST } from './fetch';
import { errorActions } from './errorSlice';
import { splitSessionUserPayload, useSession } from './sessionSlice';
import { splitRestaurantsPayload, useRestaurantSlice, useRestaurants } from './restaurantSlice';
import _ from 'lodash';
import { checkUpdate } from './utils';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

// URL Helpers
export const userUrl = id => id ? `/users/${id}` : '/users';
export const userAPIUrl = id => '/api' + userUrl(id);
export const reservationAPIUrl = (userId, id) => 
    userAPIUrl(userId) + (id ? `/reservations/${id}` : '/reservations');

// Slice of state
export const userSlice = createSlice({
    name: 'users',
    initialState: {},
    reducers: {
        addUsers: checkUpdate('users'),
        addUser: (state, action) => ({ ...state, [action.payload.id]: action.payload })
    },
});

// Selectors
export const getUserFromStore = userId => state => state.entities.users[userId];

// Actions
export const { addUser, addUsers } = userSlice.actions;
const { setUserErrors } = errorActions;

// Hooks
export const useCurrentUserRestaurants = () => {
    const { currentUser, isLoggedIn } = useSession();
    const restaurantSlice = useRestaurantSlice();
    const ownedRestaurants = currentUser?.restaurants.map(urlId => restaurantSlice[urlId]);
    return { currentUser, isLoggedIn, ownedRestaurants }
}

export const useFetchUser = userId => {
    const dispatch = useDispatch();
    useEffect(() => {
        if (userId) dispatch(getUser(userId));
    }, [dispatch, userId]);
}

// Split payloads
export const splitUsersPayload = payload => [
    addUsers(payload), 
    ...splitRestaurantsPayload(payload)
];
const userErrorsWrapped = errors => [setUserErrors(errors)];

// Thunks
export const signUp = user => dispatch => 
    fetchAPI(userAPIUrl(), {
        method: POST, 
        body: { user }
    }, splitSessionUserPayload, userErrorsWrapped)
        .then(actions => actions.forEach(dispatch));

export const getUser = id => dispatch =>
    fetchAPI(userAPIUrl(id), { 
        method: GET 
    }, splitUsersPayload, userErrorsWrapped)
        .then(actions => actions.forEach(dispatch));

export const createReservation = reservation => dispatch =>
    fetchAPI(reservationAPIUrl(reservation.dinerId), { 
        method: POST,
        body: { reservation }
    }, splitUsersPayload, userErrorsWrapped)
        .then(actions => actions.forEach(dispatch));

// Reducer
export default userSlice.reducer;