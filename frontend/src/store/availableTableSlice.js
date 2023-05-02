import { createSlice } from '@reduxjs/toolkit';
import fetchAPI, { DELETE, GET, PATCH, POST } from './fetch';
import { errorActions } from './errorSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useMatch } from 'react-router-dom';
import { useEffect } from 'react';
import { addCuisines, getCuisineFromState } from './cuisineSlice';
import { addNeighborhoods, getNeighborhoodFromState } from './neighborhoodSlice';
import { checkUpdate } from './utils';
import { restaurantAPIUrl, useRestaurant } from './restaurantSlice';
import { addReservations } from './reservationSlice';

// URL Helpers
export const availableTableAPIUrl = (restaurantId, id) => 
    restaurantAPIUrl(restaurantId) + (id ? `/available_tables/${id}` : '/available_tables');

// Slice of state
export const availableTableSlice = createSlice({
    name: 'availableTables',
    initialState: {},
    reducers: {
        addAvailableTable: (state, action) => ({ ...state, [action.payload.id]: action.payload }),
        addAvailableTables: checkUpdate('availableTables'),
        removeAvailableTable: (state, action) => {
            delete state[action.payload.id];
        }
    },
});

// Actions
export const { addAvailableTable, addAvailableTables, removeAvailableTable } = availableTableSlice.actions;
const { setAvailableTableErrors } = errorActions;

// Selectors
export const getAvailableTableSliceFromState = state => state.entities.availableTables;

export const getAvailableTablesFromState = state => Object.values(getAvailableTableSliceFromState(state));

export const getAvailableTableFromState = id => state => state.entities.availableTables[id];

export const getAvailableTableIds = state => Object.keys(state.entities.availableTables);

// Hooks
export const useAvailableTables = () => useSelector(getAvailableTablesFromState);

export const useAvailableTableSlice = () => useSelector(getAvailableTableSliceFromState);

export const useAvailableTable = id => {
    const availableTable = useSelector(getAvailableTableFromState(id));
    const { restaurant } = useRestaurant(availableTable.restaurantId);

    if (availableTable && restaurant) {
        availableTable.restaurant = restaurant;
        delete availableTable.restaurantId;
    }

    return availableTable;
}

// export const useFetchAvailableTables = () => {
//     const dispatch = useDispatch();
//     useEffect(() => {
//         dispatch(getAvailableTables);
//     }, [dispatch]);
// }

// export const useFetchAvailableTable = id => {
//     const dispatch = useDispatch();
//     useEffect(() => {
//         dispatch(getAvailableTable(id));
//     }, [dispatch, id]);
// }

// Split payloads
export const splitAvailableTablesPayload = payload => [
    addAvailableTables(payload),
    ...addReservations(payload)
];

const availableTableErrorsWrapped = errors => [setAvailableTableErrors(errors)];

// Thunks
// export const getAvailableTables = dispatch => fetchAPI(
//     availableTableAPIQuery({limit}), { method: GET }, splitAvailableTablesPayload, availableTableErrorsWrapped
// ).then(actions => actions.forEach(dispatch));

// export const getAvailableTable = id => dispatch => !id || fetchAPI(
//     availableTableAPIUrl(id), { method: GET }, splitAvailableTablesPayload, availableTableErrorsWrapped
// ).then(actions => actions.forEach(dispatch));

// export const createAvailableTable = availableTable => dispatch => fetchAPI(
//     availableTableAPIUrl(), {
//         method: POST,
//         body: availableTable
//     }, splitAvailableTablesPayload, availableTableErrorsWrapped
// ).then(actions => actions.forEach(dispatch));

// export const updateAvailableTable = availableTable => dispatch => fetchAPI(
//     availableTableAPIUrl(availableTable.get('availableTable[id]')), {
//         method: PATCH,
//         body: availableTable
//     }, splitAvailableTablesPayload, availableTableErrorsWrapped
// ).then(actions => actions.forEach(dispatch));

// export const deleteAvailableTable = availableTableId => dispatch => fetchAPI(
//     availableTableAPIUrl(availableTableId), {
//         method: DELETE
//     }, removeAvailableTable, setAvailableTableErrors
// ).then(dispatch);

// Reducer
export default availableTableSlice.reducer;