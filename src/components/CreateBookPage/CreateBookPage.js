import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CreateBookForm } from './CreateBookForm';
import { createBook, delay } from '../../redux/createBookReducer';

const CreateBookPage = props => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);
  const { bookForChange, creationBookInProgress, creationBookError, bookTopics } = useSelector(
    state => state.createBook
  );

  const [cover, setCover] = useState();
  const [pdf, setPdf] = useState();

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  });

  const handleSubmit = async values => {
    const book = {
      id: '',
      BookName: values.BookName,
      AuthorName: values.AuthorName,
      Description: values.Description,
      Year: Number(values.Year),
      Topics: [...bookTopics],
      BookCover: '',
      BookPDF: '',
      CreatedAt: null,
    };
    try {
      if (bookForChange) {
        book.BookCover = bookForChange.BookCover;
        book.BookPDF = bookForChange.BookPDF;
        dispatch(createBook(book, cover, pdf, bookForChange.id));
      } else dispatch(createBook(book, cover, pdf));
    } catch (e) {
      return;
    } finally {
      await delay(2000);
      navigate('/books');
    }
  };

  return (
    <Paper
      elevation={5}
      sx={{
        m: 1,
        mx: '10%',
        p: 2,
        minHeight: '610px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CreateBookForm
        onSubmit={handleSubmit}
        inProgress={creationBookInProgress}
        onError={creationBookError}
        setCover={setCover}
        setPdf={setPdf}
      />
    </Paper>
  );
};

export default CreateBookPage;
