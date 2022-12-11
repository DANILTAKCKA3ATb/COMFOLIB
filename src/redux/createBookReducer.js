import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from '../firebase-config';
import { v4 as uuidv4 } from 'uuid';

const CREATE_BOOK_REQUEST = 'app/createBook/CREATE_BOOK_REQUEST';
const CREATE_BOOK_SUCCESS = 'app/createBook/CREATE_BOOK_SUCCESS';
const CREATE_BOOK_ERROR = 'app/createBook/CREATE_BOOK_ERROR';

const DELETE_BOOK_REQUEST = 'app/createBook/DELETE_BOOK_REQUEST';
const DELETE_BOOK_SUCCESS = 'app/createBook/DELETE_BOOK_SUCCESS';
const DELETE_BOOK_ERROR = 'app/createBook/DELETE_BOOK_ERROR';

const SET_BOOK_TOPICS = 'app/createBook/SET_BOOK_TOPICS';

const SET_BOOK_FOR_CHANGE = 'app/createBook/SET_BOOK_FOR_CHANGE';

const initialState = {
    creationBookInProgress: false,
    creationBookError: null,

    deleteBookInProgress: false,
    deleteBookError: null,

    bookTopics: [],

    bookForChange: null,
};

export default function createBookReducer(state = initialState, action = {}) {
    const { type, payload } = action;
    switch (type) {
        case CREATE_BOOK_REQUEST:
            return { ...state, creationBookInProgress: true, creationBookError: null };
        case CREATE_BOOK_SUCCESS:
            return { ...state, creationBookInProgress: false };
        case CREATE_BOOK_ERROR:
            return { ...state, creationBookInProgress: false, creationBookError: payload };

        case DELETE_BOOK_REQUEST:
            return { ...state, deleteBookInProgress: true, deleteBookError: null };
        case DELETE_BOOK_SUCCESS:
            return { ...state, deleteBookInProgress: false };
        case DELETE_BOOK_ERROR:
            return { ...state, deleteBookInProgress: false, deleteBookError: payload };

        case SET_BOOK_TOPICS:
            return { ...state, bookTopics: payload };

        case SET_BOOK_FOR_CHANGE:
            return { ...state, bookForChange: payload };

        default:
            return state;
    }
}

export const createBookRequest = () => ({ type: CREATE_BOOK_REQUEST });
export const createBookSuccess = () => ({ type: CREATE_BOOK_SUCCESS });
export const createBookError = e => ({ type: CREATE_BOOK_ERROR, payload: e });

export const deleteBookRequest = () => ({ type: DELETE_BOOK_REQUEST });
export const deleteBookSuccess = () => ({ type: DELETE_BOOK_SUCCESS });
export const deleteBookError = e => ({ type: DELETE_BOOK_ERROR, payload: e });

export const setBookTopics = e => ({ type: SET_BOOK_TOPICS, payload: e });

export const setBookForChange = e => ({ type: SET_BOOK_FOR_CHANGE, payload: e });

export const delay = ms => new Promise(res => setTimeout(res, ms));

export const createBook =
    (book, cover, pdf, id = 0) =>
    async dispatch => {
        dispatch(createBookRequest());
        if (id === 0) id = uuidv4();

        let uploadingDone = false;
        try {
            if (cover) await uploadFile(cover, 'books/' + id + '/cover.jpg');
            if (pdf) await uploadFile(pdf, 'books/' + id + '/pdf.pdf');
            while (!uploadingDone) {
                try {
                    if (cover) {
                        await getDownloadURL(ref(storage, 'books/' + id + '/cover.jpg')).then(url => {
                            book.BookCover = url;
                        });
                    }
                    if (pdf) {
                        await getDownloadURL(ref(storage, 'books/' + id + '/pdf.pdf')).then(url => {
                            book.BookPDF = url;
                        });
                    }
                } catch (e) {
                    uploadingDone = false;
                    await delay(500);
                    continue;
                }
                uploadingDone = true;
            }
            //console.log(book.BookCover);
            //console.log(book.BookPDF);
            await setDoc(doc(db, 'books', id), book);
        } catch (e) {
            dispatch(createBookError(e));
            throw e;
        }
        dispatch(setBookTopics([]));

        dispatch(createBookSuccess());
    };

export const deleteBook = id => async dispatch => {
    dispatch(deleteBookRequest());
    try {
        await deleteDoc(doc(db, 'books', id));
        await deleteObject(ref(storage, 'books/' + id + '/cover.jpg'));
        await deleteObject(ref(storage, 'books/' + id + '/pdf.pdf'));
    } catch (e) {
        dispatch(deleteBookError(e));
        return;
    }
    dispatch(deleteBookSuccess());
};

const uploadFile = async (file, path) => {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
        'state_changed',
        snapshot => {},
        err => {
            console.log(err);
        },
        () => {}
    );
};
