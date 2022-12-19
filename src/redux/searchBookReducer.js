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

const SEARCH_BOOK_REQUEST = 'app/searchBook/SEARCH_BOOK_REQUEST';
const SEARCH_BOOK_SUCCESS = 'app/searchBook/SEARCH_BOOK_SUCCESS';
const SEARCH_BOOK_ERROR = 'app/searchBook/SEARCH_BOOK_ERROR';

const SET_ALL_TOPICS = 'app/searchBook/SET_ALL_TOPICS';

const SET_BOOKS = 'app/searchBook/SET_BOOKS';

const GET_VIEW_BOOK_REQUEST = 'app/searchBook/GET_VIEW_BOOK_REQUEST';
const GET_VIEW_BOOK_SUCCESS = 'app/searchBook/GET_VIEW_BOOK_SUCCESS';
const GET_VIEW_BOOK_ERROR = 'app/searchBook/GET_VIEW_BOOK_ERROR';
const SET_VIEW_BOOK = 'app/searchBook/SET_VIEW_BOOK';

const GET_VIEW_BOOK_LIKE_REQUEST = 'app/searchBook/GET_VIEW_BOOK_LIKE_REQUEST';
const GET_VIEW_BOOK_LIKE_SUCCESS = 'app/searchBook/GET_VIEW_BOOK_LIKE_SUCCESS';
const GET_VIEW_BOOK_LIKE_ERROR = 'app/searchBook/GET_VIEW_BOOK_LIKE_ERROR';
const SET_VIEW_BOOK_LIKE = 'app/searchBook/SET_VIEW_BOOK_LIKE';

const GET_LIBRARIES_WITH_BOOK_REQUEST = 'app/searchBook/GET_LIBRARIES_WITH_BOOK_REQUEST';
const GET_LIBRARIES_WITH_BOOK_SUCCESS = 'app/searchBook/GET_LIBRARIES_WITH_BOOK_SUCCESS';
const GET_LIBRARIES_WITH_BOOK_ERROR = 'app/searchBook/GET_LIBRARIES_WITH_BOOK_ERROR';
const SET_LIBRARIES_WITH_BOOK = 'app/searchBook/SET_LIBRARIES_WITH_BOOK';

const SET_SEARCH_TEXT = 'app/searchBook/SET_SEARCH_TEXT';
const SET_SEARCH_TOPIC = 'app/searchBook/SET_SEARCH_TOPIC';

const initialState = {
  searchBookInProgress: false,
  searchBookError: null,

  searchText: '',
  searchTopic: '',

  allTopics: ['0'],

  books: [],

  getViewBookInProgress: false,
  getViewBookError: null,
  viewBook: {
    id: '',
    BookName: '',
    AuthorName: '',
    Description: '',
    Year: '',
    BookCover: '',
    BookPDF: '',
    Topics: [],
  },

  getViewBookLikeInProgress: false,
  getViewBookLikeError: null,
  viewBookLike: false,

  getLibrariesWithBookInProgress: false,
  getLibrariesWithBookError: null,
  librariesWithBook: [],
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

    case SET_SEARCH_TEXT:
      return { ...state, searchText: payload };
    case SET_SEARCH_TOPIC:
      return { ...state, searchTopic: payload };

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

    case GET_VIEW_BOOK_LIKE_REQUEST:
      return { ...state, getViewBookLikeInProgress: true, getViewBookLikeError: null };
    case GET_VIEW_BOOK_LIKE_SUCCESS:
      return { ...state, getViewBookLikeInProgress: false };
    case GET_VIEW_BOOK_LIKE_ERROR:
      return { ...state, getViewBookLikeInProgress: false, getViewBookLikeError: payload };
    case SET_VIEW_BOOK_LIKE:
      return { ...state, viewBookLike: payload };

    case GET_LIBRARIES_WITH_BOOK_REQUEST:
      return { ...state, getLibrariesWithBookInProgress: true, getLibrariesWithBookError: null };
    case GET_LIBRARIES_WITH_BOOK_SUCCESS:
      return { ...state, getLibrariesWithBookInProgress: false };
    case GET_LIBRARIES_WITH_BOOK_ERROR:
      return {
        ...state,
        getLibrariesWithBookInProgress: false,
        getLibrariesWithBookError: payload,
      };
    case SET_LIBRARIES_WITH_BOOK:
      return { ...state, librariesWithBook: payload };

    default:
      return state;
  }
}

export const searchBookRequest = () => ({ type: SEARCH_BOOK_REQUEST });
export const searchBookSuccess = () => ({ type: SEARCH_BOOK_SUCCESS });
export const searchBookError = e => ({ type: SEARCH_BOOK_ERROR, payload: e });

export const setSearchText = e => ({ type: SET_SEARCH_TEXT, payload: e });
export const setSearchTopic = e => ({ type: SET_SEARCH_TOPIC, payload: e });

export const setAllTopics = e => ({ type: SET_ALL_TOPICS, payload: e });

export const setBooks = e => ({ type: SET_BOOKS, payload: e });

export const getViewBookRequest = () => ({ type: GET_VIEW_BOOK_REQUEST });
export const getViewBookSuccess = () => ({ type: GET_VIEW_BOOK_SUCCESS });
export const getViewBookError = e => ({ type: GET_VIEW_BOOK_ERROR, payload: e });
export const setViewBook = e => ({ type: SET_VIEW_BOOK, payload: e });

export const getViewBookLikeRequest = () => ({ type: GET_VIEW_BOOK_LIKE_REQUEST });
export const getViewBookLikeSuccess = () => ({ type: GET_VIEW_BOOK_LIKE_SUCCESS });
export const getViewBookLikeError = e => ({ type: GET_VIEW_BOOK_LIKE_ERROR, payload: e });
export const setViewBookLike = e => ({ type: SET_VIEW_BOOK_LIKE, payload: e });

export const getLibrariesWithBookRequest = () => ({ type: GET_LIBRARIES_WITH_BOOK_REQUEST });
export const getLibrariesWithBookSuccess = () => ({ type: GET_LIBRARIES_WITH_BOOK_SUCCESS });
export const getLibrariesWithBookError = e => ({ type: GET_LIBRARIES_WITH_BOOK_ERROR, payload: e });
export const setLibrariesWithBook = e => ({ type: SET_LIBRARIES_WITH_BOOK, payload: e });

export const getTopics = () => async dispatch => {
  const docRef = doc(db, 'topics', 'HzxBQBjOiKVau0qOQDsd');
  const Topics = await getDoc(docRef);
  if (Topics.exists()) {
    const result = Topics.data().name;
    dispatch(setAllTopics(result));
  }
};

export const searchBooks = () => async dispatch => {
  dispatch(searchBookRequest());
  try {
    const querySnapshot = await getDocs(collection(db, 'books'));
    const tempBooks = [];
    querySnapshot.forEach(doc => {
      const book = { ...doc.data() };
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
      dispatch(setViewBook({ ...viewBook.data() }));
    }
  } catch (e) {
    dispatch(getViewBookError(e));
    return;
  }
  dispatch(getViewBookSuccess());
};

export const getViewBookLike = bookId => async (dispatch, getState) => {
  dispatch(getViewBookLikeRequest());
  const { userId } = getState().user;
  try {
    let exist = false;
    const q = query(
      collection(db, 'likes'),
      where('book', '==', bookId),
      where('user', '==', userId)
    );
    const likes = await getDocs(q);
    likes.forEach(doc => {
      exist = true;
    });
    dispatch(setViewBookLike(exist));
  } catch (e) {
    dispatch(getViewBookLikeError(e));
    return;
  }
  dispatch(getViewBookLikeSuccess());
};

export const changeViewBookLike = (bookId, topics) => async (dispatch, getState) => {
  dispatch(getViewBookLikeRequest());
  const { userId } = getState().user;
  try {
    let exist = false;
    let likeId = '';
    const q = query(
      collection(db, 'likes'),
      where('book', '==', bookId),
      where('user', '==', userId)
    );
    const likes = await getDocs(q);
    likes.forEach(doc => {
      exist = true;
      likeId = doc.id;
    });
    if (exist) await deleteDoc(doc(db, 'likes', likeId));
    else await setDoc(doc(db, 'likes', uuidv4()), { book: bookId, user: userId, topics: topics });
  } catch (e) {
    dispatch(getViewBookLikeError(e));
    return;
  }
  await dispatch(getViewBookLike(bookId));
  dispatch(getViewBookLikeSuccess());
};

export const getLibrariesWithBook = id => async dispatch => {
  dispatch(getLibrariesWithBookRequest());
  try {
    const tempLibrariesIds = [];
    const tempLibraries = [];
    const q = query(collection(db, 'libraryBooks'), where('book', '==', id));
    const LibrariesIds = await getDocs(q);
    LibrariesIds.forEach(doc => {
      tempLibrariesIds.push(doc.data().library);
    });
    for (const id of tempLibrariesIds) {
      const docRef = doc(db, 'libraries', id);
      const res = await getDoc(docRef);
      if (res.exists()) {
        const library = {
          LibraryName: res.data().LibraryName,
          Address: res.data().Address,
          id: res.data().id,
        };
        tempLibraries.push(library);
      }
    }
    dispatch(setLibrariesWithBook(tempLibraries));
  } catch (e) {
    dispatch(getLibrariesWithBookError(e));
    return;
  }
  dispatch(getLibrariesWithBookSuccess());
};
