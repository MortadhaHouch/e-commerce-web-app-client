import { combineReducers } from 'redux';
const initialState = {
    isAdmin:false,
    isLoggedIn:false
};
const loginManagerReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN':
        return {isLoggedIn:true };
        case 'LOGOUT':
        return {isLoggedIn:false };
        default :
        return state
    }
};
const adminManagerReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADMIN':
        return {isAdmin:true};
        case 'USER':
        return {isAdmin:false};
        default:
        return state;
    }
};
const rootReducer = combineReducers({
    isAdmin: adminManagerReducer,
    isLoggedIn: loginManagerReducer
});
export {rootReducer};