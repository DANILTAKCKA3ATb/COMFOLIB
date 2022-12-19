import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { db } from '../firebase-config';
import { getTopics } from './searchBookReducer';

const GET_NEW_BOOKS_REQUEST = 'app/recommendations/GET_NEW_BOOKS_REQUEST';
const GET_NEW_BOOKS_SUCCESS = 'app/recommendations/GET_NEW_BOOKS_SUCCESS';
const GET_NEW_BOOKS_ERROR = 'app/recommendations/GET_NEW_BOOKS_ERROR';
const SET_NEW_BOOKS = 'app/recommendations/SET_NEW_BOOKS';

const GET_RECOMMENDED_BOOKS_REQUEST = 'app/recommendations/GET_RECOMMENDED_BOOKS_REQUEST';
const GET_RECOMMENDED_BOOKS_SUCCESS = 'app/recommendations/GET_RECOMMENDED_BOOKS_SUCCESS';
const GET_RECOMMENDED_BOOKS_ERROR = 'app/recommendations/GET_RECOMMENDED_BOOKS_ERROR';

const SET_RECOMMENDED_BOOKS_TOPICS = 'app/recommendations/SET_RECOMMENDED_BOOKS_TOPICS';
const SET_RECOMMENDED_BOOKS = 'app/recommendations/SET_RECOMMENDED_BOOKS';

const initialState = {
  getNewBooksInProgress: false,
  getNewBooksError: null,
  newBooks: [],

  getRecommendedBooksInProgress: false,
  getRecommendedBooksError: null,

  topics: [],
  books: [],
};

export default function recommendationsReducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case GET_NEW_BOOKS_REQUEST:
      return { ...state, getNewBooksInProgress: true, getNewBooksError: null };
    case GET_NEW_BOOKS_SUCCESS:
      return { ...state, getNewBooksInProgress: false };
    case GET_NEW_BOOKS_ERROR:
      return { ...state, getNewBooksInProgress: false, getNewBooksError: payload };

    case SET_NEW_BOOKS:
      return { ...state, newBooks: payload };

    case GET_RECOMMENDED_BOOKS_REQUEST:
      return { ...state, getRecommendedBooksInProgress: true, getRecommendedBooksError: null };
    case GET_RECOMMENDED_BOOKS_SUCCESS:
      return { ...state, getRecommendedBooksInProgress: false };
    case GET_RECOMMENDED_BOOKS_ERROR:
      return { ...state, getRecommendedBooksInProgress: false, getRecommendedBooksError: payload };

    case SET_RECOMMENDED_BOOKS_TOPICS:
      return { ...state, topics: payload };
    case SET_RECOMMENDED_BOOKS:
      return { ...state, books: payload };

    default:
      return state;
  }
}

export const getNewBooksRequest = () => ({ type: GET_NEW_BOOKS_REQUEST });
export const getNewBooksSuccess = () => ({ type: GET_NEW_BOOKS_SUCCESS });
export const getNewBooksError = e => ({ type: GET_NEW_BOOKS_ERROR, payload: e });
export const setNewBooks = e => ({ type: SET_NEW_BOOKS, payload: e });

export const getRecommendedBooksRequest = () => ({ type: GET_RECOMMENDED_BOOKS_REQUEST });
export const getRecommendedBooksSuccess = () => ({ type: GET_RECOMMENDED_BOOKS_SUCCESS });
export const getRecommendedBooksError = e => ({ type: GET_RECOMMENDED_BOOKS_ERROR, payload: e });

export const setRecommendedBooksTopics = e => ({ type: SET_RECOMMENDED_BOOKS_TOPICS, payload: e });
export const setRecommendedBooks = e => ({ type: SET_RECOMMENDED_BOOKS, payload: e });

export const getNewBooks = () => async dispatch => {
  dispatch(getNewBooksRequest());
  try {
    const tempBooks = [];
    const q = query(collection(db, 'books'), orderBy('CreatedAt', 'desc'), limit(5));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(doc => {
      tempBooks.push({ ...doc.data() });
    });
    dispatch(setNewBooks(tempBooks));
  } catch (e) {
    dispatch(getNewBooksError(e));
    return;
  }
  dispatch(getNewBooksSuccess());
};

export const getRecommendedBooks = () => async (dispatch, getState) => {
  dispatch(getRecommendedBooksRequest());
  const { userId } = getState().user;
  const { isAuthenticated } = getState().auth;
  await dispatch(getTopics());
  const { allTopics } = getState().searchBook;
  try {
    const topicsRating = [];
    for (let topic of allTopics) {
      topicsRating.push({ name: topic, count: 0 });
    }
    if (isAuthenticated) {
      const q = query(collection(db, 'likes'), where('user', '==', userId));
      const likes = await getDocs(q);
      likes.forEach(doc => {
        for (let topic of topicsRating) {
          if (doc.data().topics.includes(topic.name)) topic.count++;
        }
      });
    }
    topicsRating.sort((a, b) => parseFloat(b.count) - parseFloat(a.count));

    const topics = [];
    const books = [];
    for (let i = 0; i < 5; i++) {
      topics.push(topicsRating[i].name);
      const specificTopicsBooksTempArray = [];
      const q = query(
        collection(db, 'books'),
        where('Topics', 'array-contains', topicsRating[i].name),
        limit(5)
      );
      const specificTopicsBooks = await getDocs(q);
      specificTopicsBooks.forEach(doc => {
        specificTopicsBooksTempArray.push({ ...doc.data() });
      });
      books.push(specificTopicsBooksTempArray);
    }
    dispatch(setRecommendedBooksTopics(topics));
    dispatch(setRecommendedBooks(books));
  } catch (e) {
    dispatch(getRecommendedBooksError(e));
    return;
  }
  dispatch(getRecommendedBooksSuccess());
};
