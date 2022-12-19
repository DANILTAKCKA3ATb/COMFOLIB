import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Card, CardContent, CardMedia, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import defaultBookCover from './../../assets/defaultBookImg/defaultBookCover.jpg';
import { deleteLibraryBook } from '../../redux/searchLibraryReducer';

const LibraryBookCard = ({ book, ...props }) => {
  const dispatch = useDispatch();

  useEffect(() => {});

  return (
    <Card
      elevation={4}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        position: 'relative',
        width: '280px',
        height: '80px',
        m: 0.4,
      }}
    >
      <CardMedia
        component='img'
        height='80px'
        image={book.BookCover ? book.BookCover : defaultBookCover}
        sx={{ objectFit: 'contain', backgroundColor: '#f1f1f1', width: '55px' }}
      />
      <Box sx={{ position: 'absolute', left: '240px', display: 'flex', flexDirection: 'column' }}>
        <IconButton
          color='error'
          onClick={e => {
            dispatch(deleteLibraryBook(book.libraryBookId));
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
      <CardContent sx={{ py: 0.5 }}>
        <Typography variant='body2' sx={{ fontSize: 13 }}>
          {book.BookName.length > 25 ? book.BookName.slice(0, 25) + '...' : book.BookName}
        </Typography>
        <Typography variant='body2' sx={{ fontSize: 10 }}>
          {book.AuthorName} - {book.Year}
        </Typography>
        <Typography variant='body2' sx={{ fontSize: 14 }}>
          x {book.amount}
        </Typography>
        <Typography
          variant='body2'
          sx={{ fontSize: 9, color: 'gray', position: 'absolute', left: '60px', top: '65px' }}
        >
          Book Id: {book.bookId}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default LibraryBookCard;
