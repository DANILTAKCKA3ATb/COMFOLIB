import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Backdrop,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  addLibraryBook,
  getViewLibrary,
  getViewLibraryBooks,
  getViewLibraryEmployees,
} from '../../redux/searchLibraryReducer';
import UserCard from '../UserCard/UserCard';
import LibraryBookCard from '../BookCard/LibraryBookCard';

const LibraryPage = props => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, library } = useSelector(state => state.auth);
  const {
    getViewLibraryInProgress,
    getViewLibraryError,
    viewLibrary,
    getViewLibraryEmployeesInProgress,
    getViewLibraryEmployeesError,
    viewLibraryEmployees,
    getViewLibraryBooksInProgress,
    getViewLibraryBooksError,
    viewLibraryBooks,
    addLibraryBookInProgress,
    addLibraryBookError,
    deleteLibraryBookInProgress,
    deleteLibraryBookError,
  } = useSelector(state => state.searchLibrary);

  const [bookId, setBookId] = useState('');
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
    const id = window.location.href.split('/')[4];
    dispatch(getViewLibrary(id));
    dispatch(getViewLibraryEmployees(id));
    dispatch(getViewLibraryBooks(id));
  }, []);

  return (
    <Paper
      elevation={5}
      sx={{
        m: 1,
        mx: '10%',
        p: 2,
        minHeight: '610px',
      }}
    >
      <Backdrop
        sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
        open={
          getViewLibraryInProgress ||
          getViewLibraryEmployeesInProgress ||
          getViewLibraryBooksInProgress ||
          addLibraryBookInProgress ||
          deleteLibraryBookInProgress
        }
      >
        <CircularProgress color='inherit' />
      </Backdrop>

      <Stack direction={'column'} gap={0.7}>
        <Grid container spacing={2}>
          <Grid item xs={7}>
            <Paper sx={{ height: 1, px: 3 }}>
              <Typography variant='h4'>{viewLibrary.LibraryName}</Typography>
              <Typography variant='h6'>{viewLibrary.Address}</Typography>
            </Paper>
          </Grid>
          {viewLibrary.id === library ? (
            <Grid item xs={5}>
              <Paper sx={{ p: 1 }}>
                <Stack direction={'column'} spacing={1}>
                  <TextField
                    id='filled-basic'
                    label='BookId'
                    variant='filled'
                    size='small'
                    value={bookId}
                    onChange={e => {
                      setBookId(e.target.value);
                    }}
                  />
                  <TextField
                    id='filled-basic'
                    label='Amount'
                    variant='filled'
                    size='small'
                    value={amount}
                    type='number'
                    onChange={e => {
                      setAmount(e.target.value);
                    }}
                  />
                  <Button
                    variant='contained'
                    onClick={() => {
                      if (bookId.length === 36 && amount !== 0)
                        dispatch(addLibraryBook(bookId, amount));
                      setBookId('');
                      setAmount(0);
                    }}
                  >
                    Add book
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          ) : null}
        </Grid>
        <Divider />
        <Typography variant='h6'>Employees</Typography>
        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
        >
          {viewLibraryEmployees.map(employee => {
            return (
              <UserCard
                user={employee}
                key={employee.id}
                setIsMakeUserAdminMenuOpen={null}
                setUserForMakingAdmin={null}
                isUsersPage={false}
              />
            );
          })}
        </Stack>
        <Divider />
        <Typography variant='h6'>Books</Typography>
        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
        >
          {viewLibraryBooks.map(book => {
            return <LibraryBookCard book={book} key={book.libraryBookId} />;
          })}
        </Stack>
      </Stack>
    </Paper>
  );
};

export default LibraryPage;
