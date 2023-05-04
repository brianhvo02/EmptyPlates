import { createSlice } from '@reduxjs/toolkit';
import fetchAPI, { DELETE, GET, PATCH, POST } from './fetch';
import { errorActions } from './errorSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useMatch } from 'react-router-dom';
import { useEffect } from 'react';
import { addCuisines, getCuisineFromState, useCuisine, useCuisineSlice } from './cuisineSlice';
import { addNeighborhoods, getNeighborhoodFromState, useNeighborhoodShallow, useNeighborhoodSlice } from './neighborhoodSlice';
import { checkUpdate, removeAll } from './utils';
import { addAvailableTables, getAvailableTableFromState, useAvailableTable, useAvailableTableSlice } from './availableTableSlice';
import { getRestaurantFromState, useRestaurantShallow, useRestaurantSlice } from './restaurantSlice';
import { addUsers, userAPIUrl } from './userSlice';
import _ from 'lodash';
import { addReviews, removeReviews, reviewErrorsWrapped, splitReviewDeletePayload, splitReviewsPayload, useReviewSlice } from './reviewSlice';

// URL Helpers
export const reservationUserAPIUrl = (userId, id) => 
    userAPIUrl(userId) + (id ? `/reservations/${id}` : '/reservations');
export const reservationAPIUrl = id => id ? `/api/reservations/${id}` : '/api/reservations';
export const reservationUrl = id => id ? `/user/reservations/${id}` : '/user/reservations';

// Slice of state
export const reservationSlice = createSlice({
    name: 'reservations',
    initialState: {},
    reducers: {
        addReservation: (state, action) => ({ ...state, [action.payload.id]: action.payload }),
        addReservations: checkUpdate('reservations'),
        removeReservations: removeAll('reservations')
    },
});

// Actions
export const { addReservation, addReservations, removeReservations } = reservationSlice.actions;
const { setReservationErrors } = errorActions;

// Selectors
export const getReservationSliceFromState = state => state.entities.reservations;

export const getReservationsFromState = state => Object.values(getReservationSliceFromState(state));

export const getReservationFromState = id => state => state.entities.reservations[id];

export const getReservationIds = state => Object.keys(state.entities.reservations);

// Hooks
export const useReservations = () => useSelector(getReservationsFromState);

export const useReservationSlice = () => useSelector(getReservationSliceFromState);

export const useReservation = id => {
    const reservation = useSelector(getReservationFromState(id));
    const availableTableSlice = useAvailableTableSlice();
    const restaurantSlice = useRestaurantSlice();
    const cuisineSlice = useCuisineSlice();
    const neighborhoodSlice = useNeighborhoodSlice();
    const reviewSlice = useReviewSlice();

    if (reservation && !_.isEmpty(availableTableSlice) && !_.isEmpty(restaurantSlice) && !_.isEmpty(cuisineSlice) && !_.isEmpty(neighborhoodSlice)) {
        const availableTable = availableTableSlice[reservation.availableTableId];
        const restaurant = restaurantSlice[availableTable.restaurantId];
        const cuisine = cuisineSlice[restaurant.cuisineId];
        const neighborhood = neighborhoodSlice[restaurant.neighborhoodId];
        const review = reviewSlice[reservation.reviewId];
        
        return {
            ...reservation,
            datetime: new Date(reservation.datetime),
            availableTable,
            restaurant,
            cuisine,
            neighborhood,
            review
        };
    }

    return {}
}

// export const useFetchReservations = () => {
//     const dispatch = useDispatch();
//     useEffect(() => {
//         dispatch(getReservations);
//     }, [dispatch]);
// }

// export const useFetchReservation = id => {
//     const dispatch = useDispatch();
//     useEffect(() => {
//         dispatch(getReservation(id));
//     }, [dispatch, id]);
// }

// Split payloads
export const splitReservationsPayload = payload => [
    addReservations(payload),
    addUsers(payload),
    addReviews(payload)
];

export const splitReservationDeletePayload = payload => [
    removeReservations(payload),
    removeReviews(payload),
    addUsers(payload),
    addAvailableTables(payload)
];

export const reservationErrorsWrapped = errors => [setReservationErrors(errors)];

// Thunks
// export const getReservations = dispatch => fetchAPI(
//     reservationAPIQuery({limit}), { method: GET }, splitReservationsPayload, reservationErrorsWrapped
// ).then(actions => actions.forEach(dispatch));

// export const getReservation = id => dispatch => !id || fetchAPI(
//     reservationAPIUrl(id), { method: GET }, splitReservationsPayload, reservationErrorsWrapped
// ).then(actions => actions.forEach(dispatch));

// export const createReservation = reservation => dispatch => fetchAPI(
//     reservationAPIUrl(), {
//         method: POST,
//         body: reservation
//     }, splitReservationsPayload, reservationErrorsWrapped
// ).then(actions => actions.forEach(dispatch));

export const deleteReservation = reservationId => dispatch => fetchAPI(
    reservationAPIUrl(reservationId), {
        method: DELETE
    }, splitReservationDeletePayload, reservationErrorsWrapped
).then(actions => {
    actions.forEach(dispatch);
    return actions.length > 1;
});

export const createReview = review => dispatch => fetchAPI(
    reservationAPIUrl(review.reservationId) + '/reviews', {
        method: POST,
        body: { review }
    }, splitReviewsPayload, reservationErrorsWrapped
).then(actions => {
    actions.forEach(dispatch);
    return actions.length > 1;
});

export const updateReview = review => dispatch => fetchAPI(
    reservationAPIUrl(review.reservationId) + '/reviews/' + review.id, {
        method: PATCH,
        body: { review }
    }, splitReviewsPayload, reservationErrorsWrapped
).then(actions => {
    actions.forEach(dispatch);
    return actions.length > 1;
});

export const deleteReview = review => dispatch => fetchAPI(
    reservationAPIUrl(review.reservationId) + '/reviews/' + review.id, {
        method: DELETE
    }, splitReviewDeletePayload, reviewErrorsWrapped
).then(actions => {
    actions.forEach(dispatch);
    return actions.length > 1;
});

// export const createAvailableTable = (reservationId, availableTable) => dispatch => fetchAPI(
//     availableTableAPIUrl(reservationId), {
//         method: POST,
//         body: { availableTable }
//     }, splitReservationsPayload, reservationErrorsWrapped
// ).then(actions => actions.forEach(dispatch));

// Reducer
export default reservationSlice.reducer;