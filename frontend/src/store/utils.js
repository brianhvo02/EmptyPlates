import _ from 'lodash';

export const checkUpdate = namespace => (state, action) => _.isEqual(state, action.payload[namespace]) ? state : { ...state, ...action.payload[namespace] };

export const removeAll = namespace => (state, action) => Object.keys(action.payload[namespace]).forEach(id => delete state[id]);