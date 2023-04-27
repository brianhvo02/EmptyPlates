import { createSlice } from '@reduxjs/toolkit';
import fetchAPI, { GET, POST } from './fetch';
import { errorActions } from './errorSlice';
import { splitSessionUserPayload, useSession } from './sessionSlice';
import { addRestaurant, addRestaurants, getRestaurants, getRestaurantsObjectFromState, useRestaurants } from './restaurantSlice';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const { setUserErrors } = errorActions;

export const useCurrentUserRestaurants = () => {
    const { dispatch, currentUser, isLoggedIn } = useSession();
    const restaurants = useSelector(getRestaurantsObjectFromState);
    // const [ownedRestaurants, setOwnedRestaurants] = useState([]);
    // useEffect(() => {
    //     if (currentUser && restaurants) {
    //         console.log
    //         setOwnedRestaurants(currentUser.restaurants.map(urlId => restaurants[urlId]));
    //     }
        
    // }, [currentUser, setOwnedRestaurants]);
    const ownedRestaurants = currentUser?.restaurants.map(urlId => restaurants[urlId]);
    return { dispatch, currentUser, isLoggedIn, ownedRestaurants }
}

export const signUp = user => dispatch => 
    fetchAPI('/api/users', {
        method: POST, 
        body: { user }
    }, splitSessionUserPayload, userErrorsWrapped).then(actions => actions.forEach(dispatch));

export const splitUserPayload = user => [addUser({...user, restaurants: Object.keys(user.restaurants)}), addRestaurants(user)];

export const getUser = id => dispatch => fetchAPI(
    `/api/users/${id}`, { method: GET }, splitUserPayload, setUserErrors
).then(splitUserPayload).then(actions => actions.forEach(dispatch));

export const getUserFromStore = userId => state => state.entities.users[userId];

const userErrorsWrapped = errors => [setUserErrors(errors)];

export const userSlice = createSlice({
    name: 'users',
    initialState: {
        0: {}
    },
    reducers: {
        addUsers: (state, action) => ({ ...state, ...action.payload }),
        addUser: (state, action) => ({ ...state, [action.payload.id]: action.payload })
    },
});

export const { addUser } = userSlice.actions;
  
export default userSlice.reducer;