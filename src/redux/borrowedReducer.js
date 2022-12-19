import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  where,
} from 'firebase/firestore';
import { db } from '../firebase-config';
import { v4 as uuidv4 } from 'uuid';
import { serverTimestamp } from 'firebase/firestore';
import { addLibraryBook } from './searchLibraryReducer';

const GET_BORROWED_REQUEST = 'app/borrowed/GET_BORROWED_REQUEST';
const GET_BORROWED_SUCCESS = 'app/borrowed/GET_BORROWED_SUCCESS';
const GET_BORROWED_ERROR = 'app/borrowed/GET_BORROWED_ERROR';

const SET_BORROWED_FOR_LIBRARY = 'app/borrowed/SET_BORROWED_FOR_LIBRARY';
const SET_BORROWED_FOR_USER = 'app/borrowed/SET_BORROWED_FOR_USER';

const CREATE_BORROWED_REQUEST = 'app/borrowed/CREATE_BORROWED_REQUEST';
const CREATE_BORROWED_SUCCESS = 'app/borrowed/CREATE_BORROWED_SUCCESS';
const CREATE_BORROWED_ERROR = 'app/borrowed/CREATE_BORROWED_ERROR';

const RETURN_BORROWED_REQUEST = 'app/borrowed/RETURNE_BORROWED_REQUEST';
const RETURN_BORROWED_SUCCESS = 'app/borrowed/RETURN_BORROWED_SUCCESS';
const RETURN_BORROWED_ERROR = 'app/borrowed/RETURN_BORROWED_ERROR';

const initialState = {
  getBorrowedInProgress: false,
  getBorrowedError: false,
  borrowedForLibrary: [],
  borrowedForUser: [],

  createBorrowedInProgress: false,
  createBorrowedError: false,

  returnBorrowedInProgress: false,
  returnBorrowedError: false,
};

export default function borrowedReducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case GET_BORROWED_REQUEST:
      return { ...state, getBorrowedInProgress: true, getBorrowedError: null };
    case GET_BORROWED_SUCCESS:
      return { ...state, getBorrowedInProgress: false };
    case GET_BORROWED_ERROR:
      return { ...state, getBorrowedInProgress: false, getBorrowedError: payload };

    case SET_BORROWED_FOR_LIBRARY:
      return { ...state, borrowedForLibrary: payload };
    case SET_BORROWED_FOR_USER:
      return { ...state, borrowedForUser: payload };

    case CREATE_BORROWED_REQUEST:
      return { ...state, createBorrowedInProgress: true, createBorrowedError: null };
    case CREATE_BORROWED_SUCCESS:
      return { ...state, createBorrowedInProgress: false };
    case CREATE_BORROWED_ERROR:
      return { ...state, createBorrowedInProgress: false, createBorrowedError: payload };

    case RETURN_BORROWED_REQUEST:
      return { ...state, returnBorrowedInProgress: true, returnBorrowedError: null };
    case RETURN_BORROWED_SUCCESS:
      return { ...state, returnBorrowedInProgress: false };
    case RETURN_BORROWED_ERROR:
      return { ...state, returnBorrowedInProgress: false, returnBorrowedError: payload };

    default:
      return state;
  }
}

export const getBorrowedRequest = () => ({ type: GET_BORROWED_REQUEST });
export const getBorrowedSuccess = () => ({ type: GET_BORROWED_SUCCESS });
export const getBorrowedError = e => ({ type: GET_BORROWED_ERROR, payload: e });

export const setBorrowedForLibrary = e => ({ type: SET_BORROWED_FOR_LIBRARY, payload: e });
export const setBorrowedForUser = e => ({ type: SET_BORROWED_FOR_USER, payload: e });

export const createBorrowedRequest = () => ({ type: CREATE_BORROWED_REQUEST });
export const createBorrowedSuccess = () => ({ type: CREATE_BORROWED_SUCCESS });
export const createBorrowedError = e => ({ type: CREATE_BORROWED_ERROR, payload: e });

export const returnBorrowedRequest = () => ({ type: RETURN_BORROWED_REQUEST });
export const returnBorrowedSuccess = () => ({ type: RETURN_BORROWED_SUCCESS });
export const returnBorrowedError = e => ({ type: RETURN_BORROWED_ERROR, payload: e });

export const getBorrowedForLibrary = id => async dispatch => {
  dispatch(getBorrowedRequest());
  try {
    const tempBorrowings = [];
    const tempBorrowed = [];
    const q = query(collection(db, 'borrowed'), where('library', '==', id));
    const borrowings = await getDocs(q);
    borrowings.forEach(doc => {
      tempBorrowings.push({ id: doc.id, ...doc.data() });
    });
    const docLibraryRef = doc(db, 'libraries', tempBorrowings[0].library);
    const libraryRes = await getDoc(docLibraryRef);
    for (const borrowed of tempBorrowings) {
      const docUserRef = doc(db, 'users', borrowed.user);
      const userRes = await getDoc(docUserRef);
      const docBookRef = doc(db, 'books', borrowed.book);
      const bookRes = await getDoc(docBookRef);
      if (userRes.exists() && bookRes.exists() && libraryRes.exists()) {
        const borrowing = {
          borrowedId: borrowed.id,
          borrowedReturned: borrowed.returned,
          borrowedLastDate: borrowed.lastDate.toDate(),
          userId: userRes.id,
          userEmail: userRes.data().Email,
          userName: userRes.data().Name,
          bookId: bookRes.id,
          bookName: bookRes.data().BookName,
          bookAuthorName: bookRes.data().AuthorName,
          bookYear: bookRes.data().Year,
          libraryId: libraryRes.id,
          libraryName: libraryRes.data().LibraryName,
          libraryAddress: libraryRes.data().Address,
        };
        tempBorrowed.push(borrowing);
      }
    }
    dispatch(setBorrowedForLibrary(tempBorrowed));
  } catch (e) {
    dispatch(getBorrowedError(e));
    return;
  }
  dispatch(getBorrowedSuccess());
};

export const getBorrowedForUser = () => async (dispatch, getState) => {
  dispatch(getBorrowedRequest());
  const { userId } = getState().user;
  try {
    const tempBorrowings = [];
    const tempBorrowed = [];
    const q = query(collection(db, 'borrowed'), where('user', '==', userId));
    const borrowings = await getDocs(q);
    borrowings.forEach(doc => {
      tempBorrowings.push({ id: doc.id, ...doc.data() });
    });
    const docUserRef = doc(db, 'users', tempBorrowings[0].user);
    const userRes = await getDoc(docUserRef);
    for (const borrowed of tempBorrowings) {
      const docBookRef = doc(db, 'books', borrowed.book);
      const bookRes = await getDoc(docBookRef);
      const docLibraryRef = doc(db, 'libraries', borrowed.library);
      const libraryRes = await getDoc(docLibraryRef);
      if (userRes.exists() && bookRes.exists() && libraryRes.exists()) {
        const borrowing = {
          borrowedId: borrowed.id,
          borrowedReturned: borrowed.returned,
          borrowedLastDate: borrowed.lastDate.toDate(),
          userId: userRes.id,
          userEmail: userRes.data().Email,
          userName: userRes.data().Name,
          bookId: bookRes.id,
          bookName: bookRes.data().BookName,
          bookAuthorName: bookRes.data().AuthorName,
          bookYear: bookRes.data().Year,
          libraryId: libraryRes.id,
          libraryName: libraryRes.data().LibraryName,
          libraryAddress: libraryRes.data().Address,
        };
        tempBorrowed.push(borrowing);
      }
    }
    dispatch(setBorrowedForUser(tempBorrowed));
  } catch (e) {
    dispatch(getBorrowedError(e));
    return;
  }
  dispatch(getBorrowedSuccess());
};

export const createBorrowed = (bookId, userId, lastDate) => async (dispatch, getState) => {
  dispatch(createBorrowedRequest());
  const { library } = getState().auth;
  try {
    dispatch(addLibraryBook(bookId, -1));
    const borrowed = {
      book: bookId,
      user: userId,
      library: library,
      returned: false,
      creationDate: serverTimestamp(),
      lastDate: Timestamp.fromDate(lastDate.toDate()),
    };
    await setDoc(doc(db, 'borrowed', uuidv4()), borrowed);
  } catch (e) {
    dispatch(createBorrowedError(e));
    return;
  }
  dispatch(getBorrowedForLibrary(library));
  dispatch(createBorrowedSuccess());
};

export const returnBorrowed = (bookId, userId) => async (dispatch, getState) => {
  dispatch(returnBorrowedRequest());
  const { library } = getState().auth;
  try {
    let exist = false;
    let id = '';
    const q = query(
      collection(db, 'borrowed'),
      where('user', '==', userId),
      where('book', '==', bookId),
      where('library', '==', library)
    );
    const borrowing = await getDocs(q);
    borrowing.forEach(doc => {
      exist = true;
      id = doc.id;
    });
    if (exist) {
      dispatch(addLibraryBook(bookId, 1));
      await setDoc(doc(db, 'borrowed', id), { returned: true }, { merge: true });
    }
  } catch (e) {
    dispatch(returnBorrowedError(e));
    return;
  }
  dispatch(returnBorrowedSuccess());
};
