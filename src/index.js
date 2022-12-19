import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
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
import SignupPage from './components/SingupPage/SingupPage';
import Header from './components/Header/Header';
import MainPage from './components/MainPage/MainPage';
import CreateBookPage from './components/CreateBookPage/CreateBookPage';
import BooksPage from './components/BooksPage/BooksPage';
import BookPage from './components/BookPage/BookPage';
import BookshelfPage from './components/BookshelfPage/BookshelfPage';
import { setUserId } from './redux/userReducer';
import LibrariesPage from './components/Libraries/LibrariesPage';
import CreateLibraryPage from './components/CreateLibrariePage/CreateLibraryPage';
import UsersPage from './components/UsersPage/UsersPage';
import LibraryPage from './components/LibraryPage/LibraryPage';
import BorrowedPage from './components/BorrowedPage/BorrowedPage';

const store = configureStore({}, app);
window.store = store;

const root = ReactDOM.createRoot(document.getElementById('root'));

onAuthStateChanged(auth, user => {
  store.dispatch(authInfoSuccess(user));
  if (store.getState().auth.isAuthenticated) {
    store.dispatch(setUserId(user.uid));
    store.dispatch(getAdmin(user.uid));
  }

  root.render(
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path='/signup' element={<SignupPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/main' element={<MainPage />} />
            <Route path='/search' element={<BooksPage isAdminPage={false} />} />
            <Route path='/books' element={<BooksPage isAdminPage={true} />} />
            <Route path='/createBook' element={<CreateBookPage />} />
            <Route path='/bookshelf' element={<BookshelfPage />} />
            <Route path='/bookpage/*' element={<BookPage />} />
            <Route path='/librarypage/*' element={<LibraryPage />} />
            <Route path='/libraries' element={<LibrariesPage isAdminPage={false} />} />
            <Route path='/librariesAdm' element={<LibrariesPage isAdminPage={true} />} />
            <Route path='/borrowed' element={<BorrowedPage isAdminPage={false} />} />
            <Route path='/libraryborrowed/*' element={<BorrowedPage isAdminPage={true} />} />
            <Route path='/createlibrary' element={<CreateLibraryPage />} />
            <Route path='/users' element={<UsersPage />} />
            <Route path='' element={<Navigate to={'/main'} />} />
            <Route path='/' element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </LocalizationProvider>
    </Provider>
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
