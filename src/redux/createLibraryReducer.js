import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { v4 as uuidv4 } from 'uuid';
import { serverTimestamp } from 'firebase/firestore';

const CREATE_LIBRARY_REQUEST = 'app/createLibrary/CREATE_LIBRARY_REQUEST';
const CREATE_LIBRARY_SUCCESS = 'app/createLibrary/CREATE_LIBRARY_SUCCESS';
const CREATE_LIBRARY_ERROR = 'app/createLibrary/CREATE_LIBRARY_ERROR';

const DELETE_LIBRARY_REQUEST = 'app/createLibrary/DELETE_LIBRARY_REQUEST';
const DELETE_LIBRARY_SUCCESS = 'app/createLibrary/DELETE_LIBRARY_SUCCESS';
const DELETE_LIBRARY_ERROR = 'app/createLibrary/DELETE_LIBRARY_ERROR';

const SET_LIBRARY_FOR_CHANGE = 'app/createLibrary/SET_LIBRARY_FOR_CHANGE';

const initialState = {
  creationLibraryInProgress: false,
  creationLibraryError: null,

  deleteLibraryInProgress: false,
  deleteLibraryError: null,

  libraryForChange: null,
};

export default function createLibraryReducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case CREATE_LIBRARY_REQUEST:
      return { ...state, creationLibraryInProgress: true, creationLibraryError: null };
    case CREATE_LIBRARY_SUCCESS:
      return { ...state, creationLibraryInProgress: false };
    case CREATE_LIBRARY_ERROR:
      return { ...state, creationLibraryInProgress: false, creationLibraryError: payload };

    case DELETE_LIBRARY_REQUEST:
      return { ...state, deleteLibraryInProgress: true, deleteLibraryError: null };
    case DELETE_LIBRARY_SUCCESS:
      return { ...state, deleteLibraryInProgress: false };
    case DELETE_LIBRARY_ERROR:
      return { ...state, deleteLibraryInProgress: false, deleteLibraryError: payload };

    case SET_LIBRARY_FOR_CHANGE:
      return { ...state, libraryForChange: payload };

    default:
      return state;
  }
}

export const createLibraryRequest = () => ({ type: CREATE_LIBRARY_REQUEST });
export const createLibrarySuccess = () => ({ type: CREATE_LIBRARY_SUCCESS });
export const createLibraryError = e => ({ type: CREATE_LIBRARY_ERROR, payload: e });

export const deleteLibraryRequest = () => ({ type: DELETE_LIBRARY_REQUEST });
export const deleteLibrarySuccess = () => ({ type: DELETE_LIBRARY_SUCCESS });
export const deleteLibraryError = e => ({ type: DELETE_LIBRARY_ERROR, payload: e });

export const setLibraryForChange = e => ({ type: SET_LIBRARY_FOR_CHANGE, payload: e });

export const createLibrary =
  (library, id = 0) =>
  async dispatch => {
    dispatch(createLibraryRequest());
    if (id === 0) id = uuidv4();
    library.id = id;
    library.CreatedAt = serverTimestamp();
    try {
      await setDoc(doc(db, 'libraries', id), library);
    } catch (e) {
      dispatch(createLibraryError(e));
      throw e;
    }
    dispatch(createLibrarySuccess());
  };

export const deleteLibrary = id => async dispatch => {
  dispatch(deleteLibraryRequest());
  try {
    await deleteDoc(doc(db, 'libraries', id));
  } catch (e) {
    dispatch(deleteLibraryError(e));
    return;
  }
  dispatch(deleteLibrarySuccess());
};
