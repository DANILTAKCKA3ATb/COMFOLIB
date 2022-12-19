import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import defaultBookCover from './../../assets/defaultBookImg/defaultBookCover.jpg';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteBook, setBookForChange, setBookTopics } from '../../redux/createBookReducer';
import { searchBooks } from '../../redux/searchBookReducer';

const BookCard = ({ book, isAdminPage, ...props }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { deleteBookError } = useSelector(state => state.createBook);

  useEffect(() => {});

  const onChangeBook = book => {
    dispatch(setBookForChange(book));
    dispatch(setBookTopics(book.Topics));
    navigate('/createBook');
  };

  const onDeleteBook = id => {
    dispatch(deleteBook(id));
    if (deleteBookError == null) dispatch(searchBooks());
  };

  return (
    <Card
      elevation={4}
      sx={{
        position: 'relative',
        width: '210px',
        height: '330px',
        m: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={e => {
        e.stopPropagation();
        navigate('/bookpage/' + book.id);
      }}
    >
      <CardMedia
        component='img'
        height='190px'
        image={book.BookCover ? book.BookCover : defaultBookCover}
        sx={{ objectFit: 'contain', backgroundColor: '#f1f1f1' }}
      />
      {isAdminPage ? (
        <Box sx={{ position: 'absolute', left: '170px', display: 'flex', flexDirection: 'column' }}>
          <IconButton
            color='primary'
            onClick={e => {
              e.stopPropagation();
              onChangeBook(book);
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color='error'
            onClick={e => {
              e.stopPropagation();
              onDeleteBook(book.id);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ) : null}

      <CardContent sx={{ py: 0.5 }}>
        <Typography variant='body2'>
          {book.BookName.length > 46 ? book.BookName.slice(0, 46) + '...' : book.BookName}
        </Typography>
        <Typography variant='caption'>
          {book.AuthorName} - {book.Year}
        </Typography>
      </CardContent>
      <CardActions sx={{ mt: 'auto', py: 0.2 }}>
        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            p: 0.2,
            overflow: 'auto',
            maxWidth: '200px',
          }}
        >
          {book.Topics.map(topic => {
            return <Chip key={topic} label={topic} size='small' sx={{ mx: 0.2 }} />;
          })}
        </Stack>
      </CardActions>
    </Card>
  );
};

export default BookCard;
