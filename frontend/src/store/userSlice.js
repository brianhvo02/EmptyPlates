import { createSlice } from '@reduxjs/toolkit';
import fetchAPI, { GET, PATCH, POST } from './fetch';
import { errorActions } from './errorSlice';
import { splitSessionUserPayload, useSession } from './sessionSlice';
import { addRestaurants, splitRestaurantsPayload, useRestaurantSlice, useRestaurants } from './restaurantSlice';
import _ from 'lodash';
import { checkUpdate } from './utils';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { addNeighborhoods, useNeighborhoodSlice } from './neighborhoodSlice';
import { addCuisines, useCuisineSlice } from './cuisineSlice';
import { addAvailableTables, useAvailableTableSlice } from './availableTableSlice';
import { addReservations, reservationUserAPIUrl, useReservationSlice, reservationErrorsWrapped } from './reservationSlice';

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
    const reservationSlice = useReservationSlice();
    const availableTableSlice = useAvailableTableSlice();
    const restaurantSlice = useRestaurantSlice();
    const cuisineSlice = useCuisineSlice();
    const neighborhoodSlice = useNeighborhoodSlice();

    if (currentUser && !_.isEmpty(reservationSlice) && !_.isEmpty(availableTableSlice) && !_.isEmpty(restaurantSlice)) {
        const restaurants = currentUser.restaurants.map(urlId => {
            const restaurant = { ...restaurantSlice[urlId] };
            const cuisine = { ...cuisineSlice[restaurant.cuisineId] };
            const neighborhood = { ...neighborhoodSlice[restaurant.neighborhoodId] };

            const availableTables = restaurant.availableTables.map(availableTableId => availableTableSlice[availableTableId]);
            const reservations = availableTables.map(availableTime => availableTime.reservations.map(reservationId => reservationSlice[reservationId])).flat();
    
            return { ...restaurant, cuisine, neighborhood, reservations, availableTables };
        });

        return { currentUser, isLoggedIn, restaurants };
    }

    return {}
}

export const useCurrentUserReservations = () => {
    const { currentUser } = useSession();
    const reservationSlice = useReservationSlice();
    const availableTableSlice = useAvailableTableSlice();
    const restaurantSlice = useRestaurantSlice();
    const cuisineSlice = useCuisineSlice();
    const neighborhoodSlice = useNeighborhoodSlice();

    if (currentUser && !_.isEmpty(reservationSlice) && !_.isEmpty(availableTableSlice) && !_.isEmpty(restaurantSlice)) {
        return currentUser.reservations.map(reservationId => {
            const reservation = { ...reservationSlice[reservationId] };
            const availableTable = { ...availableTableSlice[reservation.availableTableId] };
            const restaurant = { ...restaurantSlice[availableTable.restaurantId] };
            const cuisine = { ...cuisineSlice[restaurant.cuisineId] };
            const neighborhood = { ...neighborhoodSlice[restaurant.neighborhoodId] };
    
            delete availableTable.restaurantId;
            delete reservation.availableTableId;
            delete restaurant.cuisineId;
            delete restaurant.neighborhoodId;
    
            restaurant.cuisine = cuisine;
            restaurant.neighborhood = neighborhood;
            availableTable.restaurant = restaurant;
            reservation.availableTable = availableTable;
    
            return reservation;
        })
    }
    
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
    addNeighborhoods(payload),
    addRestaurants(payload),
    addCuisines(payload),
    addAvailableTables(payload),
    addReservations(payload)
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
    fetchAPI(reservationUserAPIUrl(reservation.dinerId), { 
        method: POST,
        body: { reservation }
    }, splitUsersPayload, userErrorsWrapped)
        .then(actions => actions.forEach(dispatch));

export const updateReservation = reservation => dispatch => 
    fetchAPI(
        reservationUserAPIUrl(reservation.dinerId, reservation.id), {
            method: PATCH,
            body: reservation
        }, splitUsersPayload, reservationErrorsWrapped)
        .then(actions => actions.forEach(dispatch));

// Reducer
export default userSlice.reducer;