import { combineReducers, configureStore } from '@reduxjs/toolkit';
import restaurantReducer from './restaurantSlice';
import errorReducer from './errorSlice';
import sessionReducer from './sessionSlice';
import userReducer from './userSlice';
import neighborhoodReducer from './neighborhoodSlice';
import cuisineReducer from './cuisineSlice';
import availableTableReducer from './availableTableSlice';
import reservationReducer from './reservationSlice';
import reservationSearchReducer from './reservationSearchSlice';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

export default configureStore({
    reducer: combineReducers({
        entities: combineReducers({
            restaurants: restaurantReducer,
            users: userReducer,
            neighborhoods: neighborhoodReducer,
            cuisines: cuisineReducer,
            availableTables: availableTableReducer,
            reservations: reservationReducer
        }),
        errors: errorReducer,
        session: sessionReducer,
        reservationSearch: reservationSearchReducer
    }),
    // middleware: process.env.NODE_ENV !== 'production' ? [thunk, logger] : [thunk]
    middleware: [thunk]
});