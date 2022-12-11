import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';

const SEARCH_BOOK_REQUEST = 'app/searchBook/SEARCH_BOOK_REQUEST';
const SEARCH_BOOK_SUCCESS = 'app/searchBook/SEARCH_BOOK_SUCCESS';
const SEARCH_BOOK_ERROR = 'app/searchBook/SEARCH_BOOK_ERROR';

const SET_ALL_TOPICS = 'app/searchBook/SET_ALL_TOPICS';

const SET_BOOKS = 'app/searchBook/SET_BOOKS';

const GET_VIEW_BOOK_REQUEST = 'app/searchBook/GET_VIEW_BOOK_REQUEST';
const GET_VIEW_BOOK_SUCCESS = 'app/searchBook/GET_VIEW_BOOK_SUCCESS';
const GET_VIEW_BOOK_ERROR = 'app/searchBook/GET_VIEW_BOOK_ERROR';
const SET_VIEW_BOOK = 'app/searchBook/SET_VIEW_BOOK';

const initialState = {
    searchBookInProgress: false,
    searchBookError: null,

    allTopics: ['0', '1', '2'],

    books: [],

    getViewBookInProgress: false,
    getViewBookError: null,
    viewBook: {
        BookName: '',
        AuthorName: '',
        Description: '',
        Year: '',
        BookCover: '',
        BookPDF: '',
        Topics: [],
    },
};

export default function searchBookReducer(state = initialState, action = {}) {
    const { type, payload } = action;
    switch (type) {
        case SEARCH_BOOK_REQUEST:
            return { ...state, searchBookInProgress: true, searchBookError: null };
        case SEARCH_BOOK_SUCCESS:
            return { ...state, searchBookInProgress: false };
        case SEARCH_BOOK_ERROR:
            return { ...state, searchBookInProgress: false, searchBookError: payload };

        case SET_ALL_TOPICS:
            return { ...state, allTopics: payload };

        case SET_BOOKS:
            return { ...state, books: payload };

        case GET_VIEW_BOOK_REQUEST:
            return { ...state, getViewBookInProgress: true, getViewBookError: null };
        case GET_VIEW_BOOK_SUCCESS:
            return { ...state, getViewBookInProgress: false };
        case GET_VIEW_BOOK_ERROR:
            return { ...state, getViewBookInProgress: false, getViewBookError: payload };
        case SET_VIEW_BOOK:
            return { ...state, viewBook: payload };

        default:
            return state;
    }
}

export const searchBookRequest = () => ({ type: SEARCH_BOOK_REQUEST });
export const searchBookSuccess = () => ({ type: SEARCH_BOOK_SUCCESS });
export const searchBookError = e => ({ type: SEARCH_BOOK_ERROR, payload: e });

export const setAllTopics = e => ({ type: SET_ALL_TOPICS, payload: e });

export const setBooks = e => ({ type: SET_BOOKS, payload: e });

export const getViewBookRequest = () => ({ type: GET_VIEW_BOOK_REQUEST });
export const getViewBookSuccess = () => ({ type: GET_VIEW_BOOK_SUCCESS });
export const getViewBookError = e => ({ type: GET_VIEW_BOOK_ERROR, payload: e });
export const setViewBook = e => ({ type: SET_VIEW_BOOK, payload: e });

export const getTopics = () => async dispatch => {
    const docRef = doc(db, 'topics', 'HzxBQBjOiKVau0qOQDsd');
    const Topics = await getDoc(docRef);
    if (Topics.exists()) {
        const result = Topics.data().name;
        dispatch(setAllTopics(result));
    }
};

export const searchBooks = name => async dispatch => {
    dispatch(searchBookRequest());
    try {
        const querySnapshot = await getDocs(collection(db, 'books'));
        const tempBooks = [];
        querySnapshot.forEach(doc => {
            const book = { id: doc.id, ...doc.data() };
            tempBooks.push(book);
        });
        dispatch(setBooks(tempBooks));
    } catch (e) {
        dispatch(searchBookError(e));
        return;
    }
    dispatch(searchBookSuccess());
};

export const getViewBook = id => async dispatch => {
    dispatch(getViewBookRequest());
    try {
        const docRef = doc(db, 'books', id);
        const viewBook = await getDoc(docRef);
        if (viewBook.exists()) {
            dispatch(setViewBook(viewBook.data()));
            console.log(viewBook.data());
        }
    } catch (e) {
        dispatch(getViewBookError(e));
        return;
    }
    dispatch(getViewBookSuccess());
};
