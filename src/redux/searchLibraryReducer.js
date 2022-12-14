import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';

const SEARCH_LIBRARY_REQUEST = 'app/searchLibrary/SEARCH_LIBRARY_REQUEST';
const SEARCH_LIBRARY_SUCCESS = 'app/searchLibrary/SEARCH_LIBRARY_SUCCESS';
const SEARCH_LIBRARY_ERROR = 'app/searchLibrary/SEARCH_LIBRARY_ERROR';

const SET_LIBRARIES = 'app/searchLibrary/SET_LIBRARIES';

const GET_VIEW_LIBRARY_REQUEST = 'app/searchLibrary/GET_VIEW_LIBRARY_REQUEST';
const GET_VIEW_LIBRARY_SUCCESS = 'app/searchLibrary/GET_VIEW_LIBRARY_SUCCESS';
const GET_VIEW_LIBRARY_ERROR = 'app/searchLibrary/GET_VIEW_LIBRARY_ERROR';
const SET_VIEW_LIBRARY = 'app/searchLibrary/SET_VIEW_LIBRARY';

const SET_SEARCH_TEXT = 'app/searchLibrary/SET_SEARCH_TEXT';

const initialState = {
    searchLibraryInProgress: false,
    searchLibraryError: null,

    searchText: '',
    searchTopic: '',

    libraries: [],

    getViewLibraryInProgress: false,
    getViewLibraryError: null,
    viewLibrary: {
        id: '',
        LibraryName: '',
        Address: '',
    },
};

export default function searchLibraryReducer(state = initialState, action = {}) {
    const { type, payload } = action;
    switch (type) {
        case SEARCH_LIBRARY_REQUEST:
            return { ...state, searchLibraryInProgress: true, searchLibraryError: null };
        case SEARCH_LIBRARY_SUCCESS:
            return { ...state, searchLibraryInProgress: false };
        case SEARCH_LIBRARY_ERROR:
            return { ...state, searchLibraryInProgress: false, searchLibraryError: payload };

        case SET_SEARCH_TEXT:
            return { ...state, searchText: payload };

        case SET_LIBRARIES:
            return { ...state, libraries: payload };

        case GET_VIEW_LIBRARY_REQUEST:
            return { ...state, getViewLibraryInProgress: true, getViewLibraryError: null };
        case GET_VIEW_LIBRARY_SUCCESS:
            return { ...state, getViewLibraryInProgress: false };
        case GET_VIEW_LIBRARY_ERROR:
            return { ...state, getViewLibraryInProgress: false, getViewLibraryError: payload };
        case SET_VIEW_LIBRARY:
            return { ...state, viewLibrary: payload };

        default:
            return state;
    }
}

export const searchLibraryRequest = () => ({ type: SEARCH_LIBRARY_REQUEST });
export const searchLibrarySuccess = () => ({ type: SEARCH_LIBRARY_SUCCESS });
export const searchLibraryError = e => ({ type: SEARCH_LIBRARY_ERROR, payload: e });

export const setSearchText = e => ({ type: SET_SEARCH_TEXT, payload: e });

export const setLibraries = e => ({ type: SET_LIBRARIES, payload: e });

export const getViewLibraryRequest = () => ({ type: GET_VIEW_LIBRARY_REQUEST });
export const getViewLibrarySuccess = () => ({ type: GET_VIEW_LIBRARY_SUCCESS });
export const getViewLibraryError = e => ({ type: GET_VIEW_LIBRARY_ERROR, payload: e });
export const setViewLibrary = e => ({ type: SET_VIEW_LIBRARY, payload: e });

export const searchLibraries = () => async dispatch => {
    dispatch(searchLibraryRequest());
    try {
        const querySnapshot = await getDocs(collection(db, 'libraries'));
        const tempLibraries = [];
        querySnapshot.forEach(doc => {
            const library = { ...doc.data() };
            tempLibraries.push(library);
        });
        dispatch(setLibraries(tempLibraries));
    } catch (e) {
        dispatch(searchLibraryError(e));
        return;
    }
    dispatch(searchLibrarySuccess());
};

export const getViewLibrary = id => async dispatch => {
    dispatch(getViewLibraryRequest());
    try {
        const docRef = doc(db, 'libraries', id);
        const viewLibrary = await getDoc(docRef);
        if (viewLibrary.exists()) {
            dispatch(setViewLibrary({ ...viewLibrary.data() }));
        }
    } catch (e) {
        dispatch(getViewLibraryError(e));
        return;
    }
    dispatch(getViewLibrarySuccess());
};
