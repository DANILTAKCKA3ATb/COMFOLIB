import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from './redux/store';
import { authInfoSuccess, getAdmin } from './redux/authReducer';
import { app, auth } from './firebase-config';
import * as serviceWorker from './serviceWorker';
import { onAuthStateChanged } from 'firebase/auth';
import { Routes, Route } from 'react-router-dom';
import NotFoundPage from './components/NotFoundPage/NotFoundPage';
import LoginPage from './components/LoginPage/LoginPage';
import ProfilePage from './components/ProfilePage/ProfilePage';
import SignupPage from './components/SingupPage/SingupPage';
import Header from './components/Header/Header';
import MainPage from './components/MainPage/MainPage';
import { useNavigate } from 'react-router-dom';
import CreateBookPage from './components/CreateBookPage/CreateBookPage';
import AdmBooksPage from './components/AdmBooksPage/AdmBooksPage';
import BookPage from './components/BookPage/BookPage';

const store = configureStore({}, app);
window.store = store;

const root = ReactDOM.createRoot(document.getElementById('root'));

onAuthStateChanged(auth, user => {
    store.dispatch(authInfoSuccess(user));
    if (store.getState().auth.isAuthenticated) {
        store.dispatch(getAdmin(user.uid));
    }

    root.render(
        <React.StrictMode>
            <Provider store={store}>
                <BrowserRouter>
                    <Header />
                    <Routes>
                        <Route path='/signup' element={<SignupPage />} />
                        <Route path='/login' element={<LoginPage />} />
                        <Route path='/profile' element={<ProfilePage />} />
                        <Route path='/main' element={<MainPage />} />
                        <Route path='/books' element={<AdmBooksPage />} />
                        <Route path='/createBook' element={<CreateBookPage />} />
                        <Route path='/bookpage/*' element={<BookPage />} />
                        <Route path='' element={<Navigate to={'/main'} />} />
                        <Route path='/' element={<NotFoundPage />} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        </React.StrictMode>
    );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
