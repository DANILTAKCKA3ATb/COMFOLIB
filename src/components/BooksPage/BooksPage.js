import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Autocomplete,
  Backdrop,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import AddIcon from '@mui/icons-material/Add';
import BookCard from '../BookCard/BookCard';
import {
  getTopics,
  searchBooks,
  setSearchText,
  setSearchTopic,
} from '../../redux/searchBookReducer';
import { setBookForChange } from '../../redux/createBookReducer';

const BooksPage = ({ isAdminPage, ...props }) => {
  const { books, searchBookInProgress, searchBookError, searchText, searchTopic, allTopics } =
    useSelector(state => state.searchBook);
  const { creationBookInProgress, deleteBookInProgress, deleteBookError } = useSelector(
    state => state.createBook
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(searchBooks());
    dispatch(setBookForChange(null));
    dispatch(getTopics());
  }, []);

  const textFilter = book => {
    if (searchText === '') return true;
    if (book.BookName.toLowerCase().includes(searchText)) return true;
    if (book.AuthorName.toLowerCase().includes(searchText)) return true;
    return false;
  };

  const topicFilter = book => {
    if (!searchTopic) return true;
    if (book.Topics.includes(searchTopic)) return true;
    return false;
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
      <Backdrop
        sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
        open={creationBookInProgress || searchBookInProgress || deleteBookInProgress}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
      <Stack direction='row' sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <TextField
          size='small'
          label='Search'
          variant='filled'
          sx={{ flexBasis: '50%' }}
          value={searchText}
          onChange={e => {
            dispatch(setSearchText(e.target.value));
          }}
        />
        <Autocomplete
          sx={{ flexBasis: '16%', mx: 2 }}
          disablePortal
          onChange={(target, value) => dispatch(setSearchTopic(value))}
          options={allTopics}
          renderInput={params => <TextField {...params} label='Topic' />}
        />
        {isAdminPage ? (
          <Button
            size='large'
            variant='contained'
            color='success'
            sx={{ ml: 'auto' }}
            onClick={() => {
              navigate('/createBook');
            }}
          >
            Create Book
            <AddIcon sx={{ ml: 1 }} />
          </Button>
        ) : null}
      </Stack>
      <Divider sx={{ mt: 1, mb: 2 }} />
      <Stack
        sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}
      >
        {searchBookError || deleteBookError ? <ReportProblemIcon /> : null}
        {books.map(book => {
          if (textFilter(book) && topicFilter(book))
            return <BookCard book={book} key={book.id} isAdminPage={isAdminPage} />;
        })}
      </Stack>
    </Paper>
  );
};

export default BooksPage;
