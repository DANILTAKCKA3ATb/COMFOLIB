import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import authReducer from './authReducer';
import bookshelfBooksReducer from './bookshelfReducer';
import createBookReducer from './createBookReducer';
import createLibraryReducer from './createLibraryReducer';
import searchBookReducer from './searchBookReducer';
import searchLibraryReducer from './searchLibraryReducer';
import userReducer from './userReducer';

let reducers = combineReducers({
    auth: authReducer,
    user: userReducer,
    createBook: createBookReducer,
    searchBook: searchBookReducer,
    bookshelf: bookshelfBooksReducer,
    createLibrary: createLibraryReducer,
    searchLibrary: searchLibraryReducer,
});

const configureStore = (initialState, firebase) => {
    const middlewares = [thunk.withExtraArgument(firebase)];
    return createStore(reducers, initialState, applyMiddleware(...middlewares));
};

export default configureStore;
