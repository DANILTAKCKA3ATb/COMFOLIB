import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase-config';
import { showCurrentUserSuccess } from './userReducer';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './../firebase-config';

export const AUTH_INFO_SUCCESS = 'app/auth/AUTH_INFO_SUCCESS';

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

    isAdmin: false,

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
            return {
                ...state,
                isAuthenticated: !!payload,
            };

        case SET_ADMIN:
            return {
                ...state,
                isAdmin: !!payload,
            };

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

export const authInfoSuccess = user => ({
    type: AUTH_INFO_SUCCESS,
    payload: user,
});

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

export const getAdmin = uid => async dispatch => {
    const docRef = doc(db, 'users', uid);
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            dispatch(setAdmin(docSnap.data().isAdmin));
        }
    } catch (e) {
        dispatch(loginError(e));
        throw e;
    }
};

export const signup = params => async dispatch => {
    const { email, password } = params;
    dispatch(signupRequest());

    try {
        const data = await createUserWithEmailAndPassword(auth, email, password);
        try {
            setDoc(doc(db, 'users', data.user.uid), { isAdmin: false });
        } catch (e) {
            console.error('Error: ', e);
            return;
        }
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
