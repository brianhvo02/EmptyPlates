import { createSlice } from '@reduxjs/toolkit';
import fetchAPI, { GET } from './fetch';
import { errorActions } from './errorSlice';
import { useSelector } from 'react-redux';

const generateNamespace = namespace => {
    const capitalizedNamespace = namespace.slice(0, 1).toUpperCase() + namespace.slice(1);
    const generateUrl = id => id ? `/${namespace}s/${id}` : `/${namespace}s`;
    const generateAPIUrl = id => '/api' + generateUrl(id);
    const generateAddOne = (state, action) => ({ ...state, [action.payload.id]: action.payload });
    const generateAddMany = (state, action) => ({ ...state, ...action.payload[`${namespace}s`]});
    const generateGetFromState = state => Object.values(state.entities[`${namespace}s`])
    const generateSlice = createSlice({
        name: namespace,
        initialState: {},
        reducers: {
            [`add${capitalizedNamespace}`]: generateAddOne,
            [`add${capitalizedNamespace}s`]: generateAddMany
        },
    });
    const generateReducer = generateSlice.reducer;
    return {
        [`${namespace}Url`]: generateUrl,
        [`${namespace}APIUrl`]: generateAPIUrl,
        [`${namespace}Reducer`]: generateReducer,
        [`get${capitalizedNamespace}sFromState`]: generateGetFromState,
        [`use${capitalizedNamespace}s`]: () => useSelector(generateGetFromState),
        [`get${capitalizedNamespace}`]: id => dispatch => fetchAPI(
            generateAPIUrl(id), { method: GET }, generateSlice.actions[`add${capitalizedNamespace}`], errorActions[`set${capitalizedNamespace}Errors`] 
        ).then(dispatch),
        [`get${capitalizedNamespace}s`]: () => dispatch => fetchAPI(
            generateAPIUrl(), { method: GET }, generateSlice.actions[`add${capitalizedNamespace}s`], errorActions[`set${capitalizedNamespace}Errors`] 
        ).then(dispatch)
    };
}

export default generateNamespace