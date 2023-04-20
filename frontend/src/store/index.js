import { combineReducers, configureStore } from '@reduxjs/toolkit';
import restaurantReducer from './restaurantSlice';
import modalReducer from './modalSlice';
import errorReducer from './errorSlice';
import sessionReducer from './sessionSlice';
import userReducer from './userSlice';
import neighborhoodReducer from './neighborhoodSlice';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

export default configureStore({
    reducer: combineReducers({
        entities: combineReducers({
            restaurants: restaurantReducer,
            users: userReducer,
            neighborhoods: neighborhoodReducer
        }),
        ui: combineReducers({
            modal: modalReducer
        }),
        errors: errorReducer,
        session: sessionReducer
    }),
    middleware: [thunk, logger]
});