import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import authReducer from './authReducer';
import createBookReducer from './createBookReducer';
import searchBookReducer from './searchBookReducer';
import userReducer from './userReducer';

let reducers = combineReducers({
    auth: authReducer,
    user: userReducer,
    createBook: createBookReducer,
    searchBook: searchBookReducer,
});

const configureStore = (initialState, firebase) => {
    const middlewares = [thunk.withExtraArgument(firebase)];
    return createStore(reducers, initialState, applyMiddleware(...middlewares));
};

export default configureStore;
