import _ from 'lodash';

export const checkUpdate = namespace => (state, action) => _.isEqual(state, action.payload[namespace]) ? state : { ...state, ...action.payload[namespace] };