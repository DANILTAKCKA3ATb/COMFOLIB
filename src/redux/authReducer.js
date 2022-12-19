import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase-config';
import { showCurrentUserSuccess } from './userReducer';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './../firebase-config';

export const AUTH_INFO_SUCCESS = 'app/auth/AUTH_INFO_SUCCESS';

export const GET_IS_ADMIN_REQUEST = 'app/auth/GET_IS_ADMIN_REQUEST';
export const GET_IS_ADMIN_SUCCESS = 'app/auth/GET_IS_ADMIN_SUCCESS';
export const GET_IS_ADMIN_ERROR = 'app/auth/GET_IS_ADMIN_ERROR';
export const SET_ADMIN = 'app/auth/SET_ADMIN';

export const LOGIN_REQUEST = 'app/auth/LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'app/auth/LOGIN_SUCCESS';
export const LOGIN_ERROR = 'app/auth/LOGIN_ERROR';

export const SIGNUP_REQUEST = 'app/auth/SIGNUP_REQUEST';
export const SIGNUP_SUCCESS = 'app/auth/SIGNUP_SUCCESS';
export const SIGNUP_ERROR = 'app/auth/SIGNUP_ERROR';

export const LOGOUT_REQUEST = 'app/auth/LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'app/auth/LOGOUT_SUCCESS';
export const LOGOUT_ERROR = 'app/auth/LOGOUT_ERROR';

const initialState = {
  isAuthenticated: false,

  getIsAdminProgress: false,
  getIsAdminError: null,
  isAdmin: false,
  library: '',

  loginInProgress: false,
  loginError: null,

  signupInProgress: false,
  signupError: null,

  logoutInProgress: false,
  logoutError: null,
};

export default function authReducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case AUTH_INFO_SUCCESS:
      return { ...state, isAuthenticated: !!payload };

    case GET_IS_ADMIN_REQUEST:
      return { ...state, getIsAdminProgress: true, getIsAdminError: null };
    case GET_IS_ADMIN_SUCCESS:
      return { ...state, getIsAdminProgress: false };
    case GET_IS_ADMIN_ERROR:
      return { ...state, getIsAdminProgress: false, getIsAdminError: payload };
    case SET_ADMIN:
      return { ...state, isAdmin: true, library: payload };

    case LOGIN_REQUEST:
      return { ...state, loginInProgress: true, loginError: null };
    case LOGIN_SUCCESS:
      return { ...state, loginInProgress: false, isAuthenticated: true };
    case LOGIN_ERROR:
      return { ...state, loginInProgress: false, loginError: payload };

    case SIGNUP_REQUEST:
      return { ...state, signupInProgress: true, signupError: null };
    case SIGNUP_SUCCESS:
      return { ...state, signupInProgress: false, isAuthenticated: true };
    case SIGNUP_ERROR:
      return { ...state, signupInProgress: false, signupError: payload };

    case LOGOUT_REQUEST:
      return { ...state, logoutInProgress: true, logoutError: null };
    case LOGOUT_SUCCESS:
      return { ...state, logoutInProgress: false, isAuthenticated: false };
    case LOGOUT_ERROR:
      return { ...state, logoutInProgress: false, logoutError: payload };
    default:
      return state;
  }
}

export const authInfoSuccess = user => ({ type: AUTH_INFO_SUCCESS, payload: user });

export const getIsAdminRequest = () => ({ type: GET_IS_ADMIN_REQUEST });
export const getIsAdminSuccess = () => ({ type: GET_IS_ADMIN_SUCCESS });
export const getIsAdminError = e => ({ type: GET_IS_ADMIN_ERROR, payload: e });
export const setAdmin = e => ({ type: SET_ADMIN, payload: e });

export const loginRequest = () => ({ type: LOGIN_REQUEST });
export const loginSuccess = () => ({ type: LOGIN_SUCCESS });
export const loginError = e => ({ type: LOGIN_ERROR, payload: e });

export const signupRequest = () => ({ type: SIGNUP_REQUEST });
export const signupSuccess = () => ({ type: SIGNUP_SUCCESS });
export const signupError = e => ({ type: SIGNUP_ERROR, payload: e });

export const logoutRequest = () => ({ type: LOGOUT_REQUEST });
export const logoutSuccess = () => ({ type: LOGOUT_SUCCESS });
export const logoutError = e => ({ type: LOGOUT_ERROR, payload: e });

export const getAdmin = uid => async dispatch => {
  dispatch(getIsAdminRequest());
  const docRef = doc(db, 'admins', uid);
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      dispatch(setAdmin(docSnap.data().library));
    }
  } catch (e) {
    dispatch(getIsAdminError(e));
    return;
  }
  dispatch(getIsAdminSuccess());
};

export const login = (email, password) => async dispatch => {
  dispatch(loginRequest());
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    dispatch(loginError(e));
    return;
  }

  dispatch(loginSuccess());
};

export const signup = params => async dispatch => {
  const { email, password, Name } = params;
  dispatch(signupRequest());
  try {
    const data = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', data.user.uid), { Name: Name, Email: email });
  } catch (e) {
    dispatch(signupError(e));
    return;
  }
  dispatch(signupSuccess());
};

export const logout = () => async dispatch => {
  dispatch(logoutRequest());
  try {
    const data = await signOut(auth);
    dispatch(showCurrentUserSuccess(data.user));
  } catch (e) {
    dispatch(logoutError(e));
    return;
  }
  dispatch(logoutSuccess());
};
