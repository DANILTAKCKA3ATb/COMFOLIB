import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase-config';
import { v4 as uuidv4 } from 'uuid';

const SEARCH_LIBRARY_REQUEST = 'app/searchLibrary/SEARCH_LIBRARY_REQUEST';
const SEARCH_LIBRARY_SUCCESS = 'app/searchLibrary/SEARCH_LIBRARY_SUCCESS';
const SEARCH_LIBRARY_ERROR = 'app/searchLibrary/SEARCH_LIBRARY_ERROR';

const SET_LIBRARIES = 'app/searchLibrary/SET_LIBRARIES';

const GET_VIEW_LIBRARY_REQUEST = 'app/searchLibrary/GET_VIEW_LIBRARY_REQUEST';
const GET_VIEW_LIBRARY_SUCCESS = 'app/searchLibrary/GET_VIEW_LIBRARY_SUCCESS';
const GET_VIEW_LIBRARY_ERROR = 'app/searchLibrary/GET_VIEW_LIBRARY_ERROR';
const SET_VIEW_LIBRARY = 'app/searchLibrary/SET_VIEW_LIBRARY';

const GET_VIEW_LIBRARY_EMPLOYEES_REQUEST = 'app/searchLibrary/GET_VIEW_LIBRARY_EMPLOYEES_REQUEST';
const GET_VIEW_LIBRARY_EMPLOYEES_SUCCESS = 'app/searchLibrary/GET_VIEW_LIBRARY_EMPLOYEES_SUCCESS';
const GET_VIEW_LIBRARY_EMPLOYEES_ERROR = 'app/searchLibrary/GET_VIEW_LIBRARY_EMPLOYEES_ERROR';
const SET_VIEW_LIBRARY_EMPLOYEES = 'app/searchLibrary/SET_VIEW_LIBRARY_EMPLOYEES';

const GET_VIEW_LIBRARY_BOOKS_REQUEST = 'app/searchLibrary/GET_VIEW_LIBRARY_BOOKS_REQUEST';
const GET_VIEW_LIBRARY_BOOKS_SUCCESS = 'app/searchLibrary/GET_VIEW_LIBRARY_BOOKS_SUCCESS';
const GET_VIEW_LIBRARY_BOOKS_ERROR = 'app/searchLibrary/GET_VIEW_LIBRARY_BOOKS_ERROR';
const SET_VIEW_LIBRARY_BOOKS = 'app/searchLibrary/SET_VIEW_LIBRARY_BOOKS';

const ADD_LIBRARY_BOOK_REQUEST = 'app/searchLibrary/ADD_LIBRARY_BOOK_REQUEST';
const ADD_LIBRARY_BOOK_SUCCESS = 'app/searchLibrary/ADD_LIBRARY_BOOK_SUCCESS';
const ADD_LIBRARY_BOOK_ERROR = 'app/searchLibrary/ADD_LIBRARY_BOOK_ERROR';

const DELETE_LIBRARY_BOOK_REQUEST = 'app/searchLibrary/DELETE_LIBRARY_BOOK_REQUEST';
const DELETE_LIBRARY_BOOK_SUCCESS = 'app/searchLibrary/DELETE_LIBRARY_BOOK_SUCCESS';
const DELETE_LIBRARY_BOOK_ERROR = 'app/searchLibrary/DELETE_LIBRARY_BOOK_ERROR';

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

  getViewLibraryEmployeesInProgress: false,
  getViewLibraryEmployeesError: null,
  viewLibraryEmployees: [],

  getViewLibraryBooksInProgress: false,
  getViewLibraryBooksError: null,
  viewLibraryBooks: [],

  addLibraryBookInProgress: false,
  addLibraryBookError: null,

  deleteLibraryBookInProgress: false,
  deleteLibraryBookError: null,
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

    case GET_VIEW_LIBRARY_EMPLOYEES_REQUEST:
      return {
        ...state,
        getViewLibraryEmployeesInProgress: true,
        getViewLibraryEmployeesError: null,
      };
    case GET_VIEW_LIBRARY_EMPLOYEES_SUCCESS:
      return { ...state, getViewLibraryEmployeesInProgress: false };
    case GET_VIEW_LIBRARY_EMPLOYEES_ERROR:
      return {
        ...state,
        getViewLibraryEmployeesInProgress: false,
        getViewLibraryEmployeesError: payload,
      };
    case SET_VIEW_LIBRARY_EMPLOYEES:
      return { ...state, viewLibraryEmployees: payload };

    case GET_VIEW_LIBRARY_BOOKS_REQUEST:
      return { ...state, getViewLibraryBooksInProgress: true, getViewLibraryBooksError: null };
    case GET_VIEW_LIBRARY_BOOKS_SUCCESS:
      return { ...state, getViewLibraryBooksInProgress: false };
    case GET_VIEW_LIBRARY_BOOKS_ERROR:
      return { ...state, getViewLibraryBooksInProgress: false, getViewLibraryBooksError: payload };
    case SET_VIEW_LIBRARY_BOOKS:
      return { ...state, viewLibraryBooks: payload };

    case ADD_LIBRARY_BOOK_REQUEST:
      return { ...state, addLibraryBookInProgress: true, addLibraryBookError: null };
    case ADD_LIBRARY_BOOK_SUCCESS:
      return { ...state, addLibraryBookInProgress: false };
    case ADD_LIBRARY_BOOK_ERROR:
      return { ...state, addLibraryBookInProgress: false, addLibraryBookError: payload };

    case DELETE_LIBRARY_BOOK_REQUEST:
      return { ...state, deleteLibraryBookInProgress: true, deleteLibraryBookError: null };
    case DELETE_LIBRARY_BOOK_SUCCESS:
      return { ...state, deleteLibraryBookInProgress: false };
    case DELETE_LIBRARY_BOOK_ERROR:
      return { ...state, deleteLibraryBookInProgress: false, deleteLibraryBookError: payload };
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

export const getViewLibraryEmployeesRequest = () => ({ type: GET_VIEW_LIBRARY_EMPLOYEES_REQUEST });
export const getViewLibraryEmployeesSuccess = () => ({ type: GET_VIEW_LIBRARY_EMPLOYEES_SUCCESS });
export const getViewLibraryEmployeesError = e => ({
  type: GET_VIEW_LIBRARY_EMPLOYEES_ERROR,
  payload: e,
});
export const setViewLibraryEmployees = e => ({ type: SET_VIEW_LIBRARY_EMPLOYEES, payload: e });

export const getViewLibraryBooksRequest = () => ({ type: GET_VIEW_LIBRARY_BOOKS_REQUEST });
export const getViewLibraryBooksSuccess = () => ({ type: GET_VIEW_LIBRARY_BOOKS_SUCCESS });
export const getViewLibraryBooksError = e => ({ type: GET_VIEW_LIBRARY_BOOKS_ERROR, payload: e });
export const setViewLibraryBooks = e => ({ type: SET_VIEW_LIBRARY_BOOKS, payload: e });

export const addLibraryBookRequest = () => ({ type: ADD_LIBRARY_BOOK_REQUEST });
export const addLibraryBookSuccess = () => ({ type: ADD_LIBRARY_BOOK_SUCCESS });
export const addLibraryBookError = e => ({ type: ADD_LIBRARY_BOOK_ERROR, payload: e });

export const deleteLibraryBookRequest = () => ({ type: DELETE_LIBRARY_BOOK_REQUEST });
export const deleteLibraryBookSuccess = () => ({ type: DELETE_LIBRARY_BOOK_SUCCESS });
export const deleteLibraryBookError = e => ({ type: DELETE_LIBRARY_BOOK_ERROR, payload: e });

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

export const getViewLibraryEmployees = id => async dispatch => {
  dispatch(getViewLibraryEmployeesRequest());
  try {
    const tempEmployeesIds = [];
    const tempEmployees = [];
    const q = query(collection(db, 'admins'), where('library', '==', id));
    const viewLibraryEmployees = await getDocs(q);
    viewLibraryEmployees.forEach(doc => {
      tempEmployeesIds.push(doc.id);
    });
    for (const id of tempEmployeesIds) {
      const docRef = doc(db, 'users', id);
      const res = await getDoc(docRef);
      if (res.exists()) {
        const user = { ...res.data(), id: id, isAdmin: true };
        tempEmployees.push(user);
      }
    }
    dispatch(setViewLibraryEmployees(tempEmployees));
  } catch (e) {
    dispatch(getViewLibraryEmployeesError(e));
    return;
  }
  dispatch(getViewLibraryEmployeesSuccess());
};

export const getViewLibraryBooks = id => async dispatch => {
  dispatch(getViewLibraryBooksRequest());
  try {
    const tempLibraryBooksIds = [];
    const tempLibraryBooks = [];
    const q = query(collection(db, 'libraryBooks'), where('library', '==', id));
    const viewLibraryBooks = await getDocs(q);
    viewLibraryBooks.forEach(doc => {
      tempLibraryBooksIds.push({
        libraryBookId: doc.id,
        bookId: doc.data().book,
        amount: doc.data().amount,
      });
    });
    for (const book of tempLibraryBooksIds) {
      const docRef = doc(db, 'books', book.bookId);
      const res = await getDoc(docRef);
      if (res.exists()) {
        const libraryBook = {
          BookName: res.data().BookName,
          AuthorName: res.data().AuthorName,
          Year: res.data().Year,
          BookCover: res.data().BookCover,
          libraryBookId: book.libraryBookId,
          bookId: book.bookId,
          amount: book.amount,
        };
        tempLibraryBooks.push(libraryBook);
      }
    }
    dispatch(setViewLibraryBooks(tempLibraryBooks));
  } catch (e) {
    dispatch(getViewLibraryBooksError(e));
    return;
  }
  dispatch(getViewLibraryBooksSuccess());
};

export const addLibraryBook = (bookId, amount) => async (dispatch, getState) => {
  dispatch(addLibraryBookRequest());
  const { library } = getState().auth;
  try {
    const docRef = doc(db, 'books', bookId);
    const book = await getDoc(docRef);
    if (book.exists()) {
      const q = query(
        collection(db, 'libraryBooks'),
        where('library', '==', library),
        where('book', '==', bookId)
      );
      let alreadyExist = false;
      let overrideLibraryBookData = null;
      let overrideLibraryBookId = '';
      const alreadyExistingLibraryBook = await getDocs(q);
      alreadyExistingLibraryBook.forEach(doc => {
        alreadyExist = true;
        overrideLibraryBookId = doc.id;
        overrideLibraryBookData = { ...doc.data() };
        overrideLibraryBookData.amount = Number(overrideLibraryBookData.amount) + Number(amount);
      });
      if (alreadyExist) {
        if (overrideLibraryBookData.amount === 0) {
          await deleteDoc(doc(db, 'libraryBooks', overrideLibraryBookId));
        } else {
          setDoc(doc(db, 'libraryBooks', overrideLibraryBookId), overrideLibraryBookData);
        }
      } else {
        setDoc(doc(db, 'libraryBooks', uuidv4()), {
          book: bookId,
          library: library,
          amount: amount,
        });
      }
    }
  } catch (e) {
    dispatch(addLibraryBookError(e));
    return;
  }
  dispatch(getViewLibraryBooks(library));
  dispatch(addLibraryBookSuccess());
};

export const deleteLibraryBook = id => async (dispatch, getState) => {
  dispatch(deleteLibraryBookRequest());
  const { library } = getState().auth;
  try {
    await deleteDoc(doc(db, 'libraryBooks', id));
  } catch (e) {
    dispatch(deleteLibraryBookError(e));
    return;
  }
  dispatch(getViewLibraryBooks(library));
  dispatch(deleteLibraryBookSuccess());
};
