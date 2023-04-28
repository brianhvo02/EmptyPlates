import { createSlice } from '@reduxjs/toolkit';
import fetchAPI, { GET, POST } from './fetch';
import { errorActions } from './errorSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useMatch } from 'react-router-dom';
import { useEffect } from 'react';
import { addCuisine, addCuisines, getCuisineFromState } from './cuisineSlice';
import { addNeighborhood, addNeighborhoods, getNeighborhoodFromState } from './neighborhoodSlice';

const { setRestaurantErrors } = errorActions;

export const restaurantUrl = urlId => urlId ? `/restaurants/${urlId}` : '/restaurants';
export const restaurantAPIUrl = urlId => '/api' + restaurantUrl(urlId);

export const getRestaurantsFromState = state => {
    return Object.values(state.entities.restaurants).map(restaurant => ({
        ...restaurant,
        cuisine: getCuisineFromState(restaurant.cuisine)(state),
        neighborhood: getNeighborhoodFromState(restaurant.neighborhood)(state)
    }))
};

export const getRestaurantFromState = urlId => state => {
    const restaurant = state.entities.restaurants[urlId];
    return restaurant ? {
        ...restaurant,
        cuisine: getCuisineFromState(restaurant?.cuisine)(state),
        neighborhood: getNeighborhoodFromState(restaurant?.neighborhood)(state)
    } : undefined;
};

export const getRestaurantIds = state => Object.keys(state.entities.restaurants);

export const useRestaurants = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getRestaurants());
    }, [dispatch]);
    const restaurants = useSelector(getRestaurantsFromState);
    const restaurantIds = useSelector(getRestaurantIds);
    return { dispatch, restaurants, restaurantIds };
};

// export const useRestaurant = urlId => useSelector(state => state.entities.restaurants[urlId]);
export const useRestaurant = () => {
    const dispatch = useDispatch();
    const matchOne = useMatch('/restaurants/:restaurantId');
    const matchEdit = useMatch('/restaurants/:restaurantId/edit');
    const match = matchOne || matchEdit;
    const restaurantId = match && match.params.restaurantId !== 'new' ? match.params.restaurantId : null;
    const isNew = match && match.params.restaurantId === 'new';

    useEffect(() => {
        dispatch(getRestaurant(restaurantId));
    }, [dispatch, restaurantId]);
    
    const restaurant = useSelector(getRestaurantFromState(restaurantId));
    return { dispatch, restaurant, isNew };
};

const splitRestaurantPayload = restaurant => [
    addRestaurant({
        ...restaurant,
        cuisine: restaurant?.cuisine.id,
        neighborhood: restaurant?.neighborhood.id
    }),
    addCuisine(restaurant?.cuisine),
    addNeighborhood(restaurant?.neighborhood)
]

export const splitRestaurantsPayload = ({restaurants}) => {
    const cuisinesPayload = {
        cuisines: {}
    }

    const neighborhoodsPayload = {
        neighborhoods: {}
    }

    const restaurantsPayload = {
        restaurants: Object.fromEntries((restaurants ? Object.values(restaurants) : []).map(restaurant => {
            const cuisine = restaurant.cuisine;
            cuisinesPayload.cuisines[cuisine.id] = cuisine;
            
            const neighborhood = restaurant.neighborhood;
            neighborhoodsPayload.neighborhoods[neighborhood.id] = neighborhood;

            restaurant.cuisine = cuisine.id;
            restaurant.neighborhood = neighborhood.id;

            return [restaurant.urlId, restaurant];
        }))
    }

    return [
        addRestaurants(restaurantsPayload),
        addCuisines(cuisinesPayload),
        addNeighborhoods(neighborhoodsPayload)
    ];
}

const restaurantErrorsWrapped = errors => [setRestaurantErrors(errors)];

export const getRestaurant = urlId => dispatch => !urlId || fetchAPI(
    restaurantAPIUrl(urlId), { method: GET }, splitRestaurantPayload, restaurantErrorsWrapped
).then(actions => actions.forEach(dispatch));

export const getRestaurants = () => dispatch => fetchAPI(
    restaurantAPIUrl(), { method: GET }, splitRestaurantsPayload, restaurantErrorsWrapped
).then(actions => actions.forEach(dispatch));

export const createRestaurant = restaurant => dispatch => fetchAPI(
    restaurantAPIUrl(), {
        method: POST,
        body: restaurant
    }, splitRestaurantPayload, restaurantErrorsWrapped
).then(actions => actions.forEach(dispatch));

export const updateRestaurant = restaurant => dispatch => fetchAPI(
    restaurantAPIUrl(restaurant.get('restaurant[id]')), {
        method: 'PATCH',
        body: restaurant
    }, splitRestaurantPayload, restaurantErrorsWrapped
).then(actions => actions.forEach(dispatch));

export const deleteRestaurant = restaurantId => dispatch => fetchAPI(
    restaurantAPIUrl(restaurantId), {
        method: 'DELETE'
    }, removeRestaurant, setRestaurantErrors
).then(dispatch);


export const restaurantSlice = createSlice({
    name: 'restaurants',
    initialState: {},
    reducers: {
        addRestaurant: (state, action) => ({ ...state, [action.payload.urlId]: action.payload }),
        addRestaurants: (state, action) => ({ ...state, ...action.payload.restaurants}),
        removeRestaurant: (state, action) => {
            delete state[action.payload.id];
        }
    },
});

export const { addRestaurant, addRestaurants, removeRestaurant } = restaurantSlice.actions;
  
export default restaurantSlice.reducer;