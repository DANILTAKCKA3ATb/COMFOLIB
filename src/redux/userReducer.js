import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { auth, db } from '../firebase-config';

export const SHOW_CURRENT_USER_REQUEST = 'app/user/SHOW_CURRENT_USER_REQUEST';
export const SHOW_CURRENT_USER_SUCCESS = 'app/user/SHOW_CURRENT_USER_SUCCESS';

const SET_SEARCH_TEXT = 'app/user/SET_SEARCH_TEXT';

export const GET_USERS_REQUEST = 'app/user/GET_USERS_REQUEST';
export const GET_USERS_SUCCESS = 'app/user/GET_USERS_SUCCESS';
export const GET_USERS_ERROR = 'app/user/GET_USERS_ERROR';
export const SET_USERS = 'app/user/SET_USERS';

export const SET_USER_ADMIN_REQUEST = 'app/user/SET_USER_ADMIN_REQUEST';
export const SET_USER_ADMIN_SUCCESS = 'app/user/SET_USER_ADMIN_SUCCESS';
export const SET_USER_ADMIN_ERROR = 'app/user/SET_USER_ADMIN_ERROR';

export const REMOVE_USER_ADMIN_REQUEST = 'app/user/REMOVE_USER_ADMIN_REQUEST';
export const REMOVE_USER_ADMIN_SUCCESS = 'app/user/REMOVE_USER_ADMIN_SUCCESS';
export const REMOVE_USER_ADMIN_ERROR = 'app/user/REMOVE_USER_ADMIN_ERROR';

export const SET_USER_ID = 'app/user/SET_USER_ID';

const initialState = {
  userId: '',
  currentUser: null,

  searchText: '',

  getUsersInProgress: false,
  getUsersError: null,
  users: [],

  setUserAdminInProgress: false,
  setUserAdminError: null,

  removeUserAdminInProgress: false,
  removeUserAdminError: null,
};

export default function userReducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case SHOW_CURRENT_USER_REQUEST:
      return state;
    case SHOW_CURRENT_USER_SUCCESS:
      return { ...state, currentUser: payload };
    case SET_USER_ID:
      return { ...state, userId: payload };

    case SET_SEARCH_TEXT:
      return { ...state, searchText: payload };

    case GET_USERS_REQUEST:
      return { ...state, getUsersInProgress: true, getUsersError: null };
    case GET_USERS_SUCCESS:
      return { ...state, getUsersInProgress: false };
    case GET_USERS_ERROR:
      return { ...state, getUsersInProgress: false, getUsersError: payload };
    case SET_USERS:
      return { ...state, users: payload };

    case SET_USER_ADMIN_REQUEST:
      return { ...state, setUserAdminInProgress: true, setUserAdminError: null };
    case SET_USER_ADMIN_SUCCESS:
      return { ...state, setUserAdminInProgress: false };
    case SET_USER_ADMIN_ERROR:
      return { ...state, setUserAdminInProgress: false, setUserAdminError: payload };

    case REMOVE_USER_ADMIN_REQUEST:
      return { ...state, removeUserAdminInProgress: true, removeUserAdminError: null };
    case REMOVE_USER_ADMIN_SUCCESS:
      return { ...state, removeUserAdminInProgress: false };
    case REMOVE_USER_ADMIN_ERROR:
      return { ...state, removeUserAdminInProgress: false, removeUserAdminError: payload };

    default:
      return state;
  }
}

export const showCurrentUserRequest = () => ({ type: SHOW_CURRENT_USER_REQUEST });
export const showCurrentUserSuccess = user => ({ type: SHOW_CURRENT_USER_SUCCESS, payload: user });

export const setUserId = e => ({ type: SET_USER_ID, payload: e });

export const setSearchText = e => ({ type: SET_SEARCH_TEXT, payload: e });

export const getUsersRequest = () => ({ type: GET_USERS_REQUEST });
export const getUsersSuccess = () => ({ type: GET_USERS_SUCCESS });
export const getUsersError = e => ({ type: GET_USERS_ERROR, payload: e });
export const setUsers = e => ({ type: SET_USERS, payload: e });

export const setUserAdminRequest = () => ({ type: SET_USER_ADMIN_REQUEST });
export const setUserAdminSuccess = () => ({ type: SET_USER_ADMIN_SUCCESS });
export const setUserAdminError = e => ({ type: SET_USER_ADMIN_ERROR, payload: e });

export const removeUserAdminRequest = () => ({ type: REMOVE_USER_ADMIN_REQUEST });
export const removeUserAdminSuccess = () => ({ type: REMOVE_USER_ADMIN_SUCCESS });
export const removeUserAdminError = e => ({ type: REMOVE_USER_ADMIN_ERROR, payload: e });

export const fetchCurrentUser = () => (dispatch, getState) => {
  dispatch(showCurrentUserRequest());
  const { isAuthenticated } = getState().auth;

  if (!isAuthenticated) {
    dispatch(showCurrentUserSuccess(null));
    return Promise.resolve({});
  }
  const currentUser = auth.currentUser;
  return Promise.resolve(dispatch(showCurrentUserSuccess(currentUser)));
};

export const getUsers = () => async (dispatch, getState) => {
  dispatch(getUsersRequest());
  const { userId } = getState().user;
  try {
    const users = await getDocs(collection(db, 'users'));
    const tempUsers = [];
    users.forEach(doc => {
      if (doc.id !== userId) {
        const user = { ...doc.data(), id: doc.id, isAdmin: false };
        tempUsers.push(user);
      }
    });

    const admins = await getDocs(collection(db, 'admins'));
    admins.forEach(doc => {
      const index = tempUsers.findIndex(item => item.id === doc.id);
      if (index !== -1) {
        tempUsers[index].isAdmin = true;
      }
    });
    dispatch(setUsers(tempUsers));
  } catch (e) {
    dispatch(getUsersError(e));
    return;
  }
  dispatch(getUsersSuccess());
};

export const setUserAdmin = (id, libraryId) => async dispatch => {
  dispatch(setUserAdminRequest());
  try {
    await setDoc(doc(db, 'admins', id), { library: libraryId });
  } catch (e) {
    dispatch(setUserAdminError(e));
    return;
  }
  dispatch(getUsers());
  dispatch(setUserAdminSuccess());
};

export const removeUserAdmin = id => async dispatch => {
  dispatch(removeUserAdminRequest());
  try {
    await deleteDoc(doc(db, 'admins', id));
  } catch (e) {
    dispatch(removeUserAdminError(e));
    return;
  }
  dispatch(getUsers());
  dispatch(removeUserAdminSuccess());
};
