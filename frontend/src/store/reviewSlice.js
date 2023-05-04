import { createSlice } from '@reduxjs/toolkit';
import fetchAPI, { DELETE, GET, PATCH, POST } from './fetch';
import { errorActions } from './errorSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useMatch } from 'react-router-dom';
import { useEffect } from 'react';
import { addCuisines, getCuisineFromState, useCuisine, useCuisineSlice } from './cuisineSlice';
import { addNeighborhoods, getNeighborhoodFromState, useNeighborhoodShallow, useNeighborhoodSlice } from './neighborhoodSlice';
import { checkUpdate, removeAll } from './utils';
import { addAvailableTables, getAvailableTableFromState, removeAvailableTables, useAvailableTable, useAvailableTableSlice } from './availableTableSlice';
import { getRestaurantFromState, useRestaurantShallow, useRestaurantSlice } from './restaurantSlice';
import { addUsers, userAPIUrl } from './userSlice';
import _ from 'lodash';
import { addReservations, removeReservations } from './reservationSlice';

// URL Helpers
export const reviewUserAPIUrl = (userId, id) => 
    userAPIUrl(userId) + (id ? `/reviews/${id}` : '/reviews');
export const reviewAPIUrl = id => id ? `/api/reviews/${id}` : '/api/reviews';
export const reviewUrl = id => id ? `/user/reviews/${id}` : '/user/reviews';

// Slice of state
export const reviewSlice = createSlice({
    name: 'reviews',
    initialState: {},
    reducers: {
        addReview: (state, action) => ({ ...state, [action.payload.id]: action.payload }),
        addReviews: checkUpdate('reviews'),
        removeReviews: removeAll('reviews')
    },
});

// Actions
export const { addReview, addReviews, removeReviews } = reviewSlice.actions;
const { setReviewErrors } = errorActions;

// Selectors
export const getReviewSliceFromState = state => state.entities.reviews;

export const getReviewsFromState = state => Object.values(getReviewSliceFromState(state));

export const getReviewFromState = id => state => state.entities.reviews[id];

export const getReviewIds = state => Object.keys(state.entities.reviews);

// Hooks
// export const useReviews = () => useSelector(getReviewsFromState);

export const useReviewSlice = () => useSelector(getReviewSliceFromState);

// export const useReview = id => {
//     const review = useSelector(getReviewFromState(id));
//     const availableTableSlice = useAvailableTableSlice();
//     const restaurantSlice = useRestaurantSlice();
//     const cuisineSlice = useCuisineSlice();
//     const neighborhoodSlice = useNeighborhoodSlice();

//     if (review && !_.isEmpty(availableTableSlice) && !_.isEmpty(restaurantSlice) && !_.isEmpty(cuisineSlice) && !_.isEmpty(neighborhoodSlice)) {
//         const availableTable = availableTableSlice[review.availableTableId];
//         const restaurant = restaurantSlice[availableTable.restaurantId];
//         const cuisine = cuisineSlice[restaurant.cuisineId];
//         const neighborhood = neighborhoodSlice[restaurant.neighborhoodId];
        
//         return {
//             ...review,
//             datetime: new Date(review.datetime),
//             availableTable,
//             restaurant,
//             cuisine,
//             neighborhood
//         };
//     }

//     return {}
// }

// export const useFetchReviews = () => {
//     const dispatch = useDispatch();
//     useEffect(() => {
//         dispatch(getReviews);
//     }, [dispatch]);
// }

// export const useFetchReview = id => {
//     const dispatch = useDispatch();
//     useEffect(() => {
//         dispatch(getReview(id));
//     }, [dispatch, id]);
// }

// Split payloads
export const splitReviewsPayload = payload => [
    addReviews(payload),
    addReservations(payload)
];

export const splitReviewDeletePayload = payload => [
    removeReviews(payload),
    addReservations(payload),
];

export const reviewErrorsWrapped = errors => [setReviewErrors(errors)];

// Thunks
// export const getReviews = dispatch => fetchAPI(
//     reviewAPIQuery({limit}), { method: GET }, splitReviewsPayload, reviewErrorsWrapped
// ).then(actions => actions.forEach(dispatch));

// export const getReview = id => dispatch => !id || fetchAPI(
//     reviewAPIUrl(id), { method: GET }, splitReviewsPayload, reviewErrorsWrapped
// ).then(actions => actions.forEach(dispatch));

// export const createReview = review => dispatch => fetchAPI(
//     reviewAPIUrl(), {
//         method: POST,
//         body: review
//     }, splitReviewsPayload, reviewErrorsWrapped
// ).then(actions => actions.forEach(dispatch));

// export const createReview = review => dispatch => fetchAPI(
//     reviewAPIUrl(review.reviewId) + '/reviews', {
//         method: POST,
//         body: { review }
//     }, splitReviewsPayload, reviewErrorsWrapped
// ).then(actions => {
//     actions.forEach(dispatch);
//     return actions.length > 1;
// });

// export const createAvailableTable = (reviewId, availableTable) => dispatch => fetchAPI(
//     availableTableAPIUrl(reviewId), {
//         method: POST,
//         body: { availableTable }
//     }, splitReviewsPayload, reviewErrorsWrapped
// ).then(actions => actions.forEach(dispatch));

// Reducer
export default reviewSlice.reducer;