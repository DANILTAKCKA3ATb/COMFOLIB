import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Backdrop, Box, CircularProgress, Divider, Paper, Typography } from '@mui/material';
import { getNewBooks, getRecommendedBooks } from '../../redux/recommendationsReducer';
import BookCard from '../BookCard/BookCard';
import { Stack } from '@mui/system';

const MainPage = props => {
  const {
    getNewBooksInProgress,
    getNewBooksError,
    newBooks,
    getRecommendedBooksInProgress,
    getRecommendedBooksError,
    topics,
    books,
  } = useSelector(state => state.recommendations);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getNewBooks());
    dispatch(getRecommendedBooks());
  }, []);

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
      <Backdrop
        sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
        open={getNewBooksInProgress || getRecommendedBooksInProgress}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
      <Typography variant='h4'>New</Typography>
      <Stack
        sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}
      >
        {newBooks.map(book => {
          return <BookCard book={book} key={book.id} isAdminPage={false} />;
        })}
      </Stack>
      <Divider sx={{ my: 1 }} />
      {topics.map((topic, index) => {
        if (books[index].length > 0) {
          return (
            <Box key={index}>
              <Typography variant='h4'>{topic}</Typography>
              <Stack
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                {books[index].map(book => {
                  return <BookCard book={book} key={book.id} isAdminPage={false} />;
                })}
              </Stack>
              <Divider sx={{ my: 1 }} />
            </Box>
          );
        }
      })}
    </Paper>
  );
};

export default MainPage;
