import { createSlice } from '@reduxjs/toolkit';
import fetchAPI, { DELETE, GET, PATCH, POST } from './fetch';
import { errorActions } from './errorSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useMatch } from 'react-router-dom';
import { useEffect } from 'react';
import { addCuisines, getCuisineFromState } from './cuisineSlice';
import { addNeighborhoods, getNeighborhoodFromState } from './neighborhoodSlice';
import { checkUpdate } from './utils';
import { getAvailableTableFromState, useAvailableTable } from './availableTableSlice';
import { getRestaurantFromState } from './restaurantSlice';
import { addUsers, userAPIUrl } from './userSlice';

// URL Helpers
export const reservationAPIUrl = (userId, id) => 
    userAPIUrl(userId) + (id ? `/reservations/${id}` : '/reservations');
export const reservationUrl = id => id ? `/reservations/${id}` : '/reservations';

// Slice of state
export const reservationSlice = createSlice({
    name: 'reservations',
    initialState: {},
    reducers: {
        addReservation: (state, action) => ({ ...state, [action.payload.id]: action.payload }),
        addReservations: checkUpdate('reservations'),
        removeReservation: (state, action) => {
            delete state[action.payload.id];
        }
    },
});

// Actions
export const { addReservation, addReservations, removeReservation } = reservationSlice.actions;
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
    const availableTable = useAvailableTable(reservation.availableTableId);

    if (reservation && availableTable) {
        reservation.availableTable = availableTable;
        delete reservation.availableTableId;
    }

    return reservation;
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
    addUsers(payload)
];

const reservationErrorsWrapped = errors => [setReservationErrors(errors)];

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

// export const updateReservation = reservation => dispatch => fetchAPI(
//     reservationAPIUrl(reservation.get('reservation[id]')), {
//         method: PATCH,
//         body: reservation
//     }, splitReservationsPayload, reservationErrorsWrapped
// ).then(actions => actions.forEach(dispatch));

// export const deleteReservation = reservationId => dispatch => fetchAPI(
//     reservationAPIUrl(reservationId), {
//         method: DELETE
//     }, removeReservation, setReservationErrors
// ).then(dispatch);

// export const createAvailableTable = (reservationId, availableTable) => dispatch => fetchAPI(
//     availableTableAPIUrl(reservationId), {
//         method: POST,
//         body: { availableTable }
//     }, splitReservationsPayload, reservationErrorsWrapped
// ).then(actions => actions.forEach(dispatch));

// Reducer
export default reservationSlice.reducer;