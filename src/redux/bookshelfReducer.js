import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { delay } from './createBookReducer';

const ADD_BOOKSHELF_BOOK_REQUEST = 'app/bookshelf/ADD_BOOKSHELF_BOOK_REQUEST';
const ADD_BOOKSHELF_BOOK_SUCCESS = 'app/bookshelf/ADD_BOOKSHELF_BOOK_SUCCESS';
const ADD_BOOKSHELF_BOOK_ERROR = 'app/bookshelf/ADD_BOOKSHELF_BOOK_ERROR';

const GET_BOOKSHELF_BOOKS_REQUEST = 'app/bookshelf/GET_BOOKSHELF_BOOKS_REQUEST';
const GET_BOOKSHELF_BOOKS_SUCCESS = 'app/bookshelf/GET_BOOKSHELF_BOOKS_SUCCESS';
const GET_BOOKSHELF_BOOKS_ERROR = 'app/bookshelf/GET_BOOKSHELF_BOOKS_ERROR';

const CLEAR_BOOKSHELF_BOOKS = 'app/bookshelf/CLEAR_BOOKSHELF_BOOKS';
const SET_BOOKSHELF_BOOKS = 'app/bookshelf/SET_BOOKSHELF_BOOKS';
const SET_BOOKSHELF_BOOKS_ID = 'app/bookshelf/SET_BOOKSHELF_BOOKS_ID';

const initialState = {
    addBookshelfBookInProgress: false,
    addBookshelfBookError: null,

    getBookshelfBooksInProgress: false,
    getBookshelfBookError: null,

    bookshelfBooksId: [],
    bookshelfBooks: [],
};

export default function bookshelfBooksReducer(state = initialState, action = {}) {
    const { type, payload } = action;
    switch (type) {
        case ADD_BOOKSHELF_BOOK_REQUEST:
            return { ...state, addBookshelfBookInProgress: true, addBookshelfBookError: null };
        case ADD_BOOKSHELF_BOOK_SUCCESS:
            return { ...state, addBookshelfBookInProgress: false };
        case ADD_BOOKSHELF_BOOK_ERROR:
            return { ...state, addBookshelfBookInProgress: false, addBookshelfBookError: payload };

        case GET_BOOKSHELF_BOOKS_REQUEST:
            return { ...state, getBookshelfBooksInProgress: true, getBookshelfBookError: null };
        case GET_BOOKSHELF_BOOKS_SUCCESS:
            return { ...state, getBookshelfBooksInProgress: false };
        case GET_BOOKSHELF_BOOKS_ERROR:
            return { ...state, getBookshelfBooksInProgress: false, getBookshelfBookError: payload };

        case SET_BOOKSHELF_BOOKS_ID:
            return { ...state, bookshelfBooksId: [...payload] };
        case SET_BOOKSHELF_BOOKS:
            return { ...state, bookshelfBooks: [...payload] };
        case CLEAR_BOOKSHELF_BOOKS:
            return { ...state, bookshelfBooks: [] };

        default:
            return state;
    }
}

export const addBookshelfBookRequest = () => ({ type: ADD_BOOKSHELF_BOOK_REQUEST });
export const addBookshelfBookSuccess = () => ({ type: ADD_BOOKSHELF_BOOK_SUCCESS });
export const addBookshelfBookError = e => ({ type: ADD_BOOKSHELF_BOOK_ERROR, payload: e });

export const getBookshelfBooksRequest = () => ({ type: GET_BOOKSHELF_BOOKS_REQUEST });
export const getBookshelfBooksSuccess = () => ({ type: GET_BOOKSHELF_BOOKS_SUCCESS });
export const getBookshelfBooksError = e => ({ type: GET_BOOKSHELF_BOOKS_ERROR, payload: e });

export const setBookshelfBooksId = e => ({ type: SET_BOOKSHELF_BOOKS_ID, payload: e });
export const setBookshelfBooks = e => ({ type: SET_BOOKSHELF_BOOKS, payload: e });
export const clearBookshelfBooks = () => ({ type: CLEAR_BOOKSHELF_BOOKS });

export const addRemoveBookshelfBook = (id, isRemoving) => async (dispatch, getState) => {
    dispatch(addBookshelfBookRequest());
    const { userId } = getState().user;
    try {
        const docRef = doc(db, 'users', userId);
        const user = await getDoc(docRef);
        if (user.exists()) {
            if (isRemoving) {
                const arr = user.data().bookshelf;
                const index = arr.indexOf(id);
                arr.splice(index, 1);
                await setDoc(doc(db, 'users', userId), { bookshelf: arr }, { merge: true });
            } else {
                await setDoc(doc(db, 'users', userId), { bookshelf: [...user.data().bookshelf, id] }, { merge: true });
            }
            dispatch(getBookshelfBooksId());
        }
    } catch (e) {
        dispatch(addBookshelfBookError(e));
        return;
    }

    dispatch(addBookshelfBookSuccess());
};

export const getBookshelfBooksId = () => async (dispatch, getState) => {
    dispatch(getBookshelfBooksRequest());
    const { userId } = getState().user;
    try {
        const docRef = doc(db, 'users', userId);
        const user = await getDoc(docRef);
        if (user.exists()) {
            dispatch(setBookshelfBooksId(user.data().bookshelf));
        }
    } catch (e) {
        dispatch(getBookshelfBooksError(e));
        return;
    }
    dispatch(getBookshelfBooksSuccess());
};

export const getBookshelfBooks = () => async (dispatch, getState) => {
    dispatch(getBookshelfBooksRequest());
    const { userId } = getState().user;
    try {
        const docRef = doc(db, 'users', userId);
        const user = await getDoc(docRef);
        if (user.exists()) {
            dispatch(setBookshelfBooksId(user.data().bookshelf));
            dispatch(clearBookshelfBooks());
            const ids = user.data().bookshelf;
            const tempBooks = [];
            for (const id of ids) {
                const docRef = doc(db, 'books', id);
                const res = await getDoc(docRef);
                if (res.exists()) {
                    const book = { ...res.data() };
                    tempBooks.push(book);
                }
            }
            dispatch(setBookshelfBooks([...tempBooks]));
        }
    } catch (e) {
        console.log(e);
        dispatch(getBookshelfBooksError(e));
        return;
    }
    dispatch(getBookshelfBooksSuccess());
};

