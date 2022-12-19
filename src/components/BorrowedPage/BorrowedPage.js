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
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { getViewLibrary } from '../../redux/searchLibraryReducer';
import moment from 'moment';
import {
  createBorrowed,
  getBorrowedForLibrary,
  getBorrowedForUser,
  returnBorrowed,
} from '../../redux/borrowedReducer';
import BorrowedCard from '../BorrowedCard/BorrowedCard';

const BorrowedPage = ({ isAdminPage, ...props }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);
  const { getViewLibraryInProgress, getViewLibraryError, viewLibrary } = useSelector(
    state => state.searchLibrary
  );
  const {
    getBorrowedInProgress,
    getBorrowedError,
    borrowedForLibrary,
    borrowedForUser,
    createBorrowedInProgress,
    createBorrowedError,
    returnBorrowedInProgress,
    returnBorrowedError,
  } = useSelector(state => state.borrowed);

  const [takeBookId, setTakeBookId] = useState('');
  const [takeUserId, setTakeUserId] = useState('');
  const [takeLastDate, setTakeLastDate] = useState(moment());

  const handleLastDateChange = newValue => {
    setTakeLastDate(newValue);
  };

  const [returnBookId, setReturnBookId] = useState('');
  const [returnUserId, setReturnUserId] = useState('');

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
    if (isAdminPage) {
      const id = window.location.href.split('/')[4];
      dispatch(getViewLibrary(id));
      dispatch(getBorrowedForLibrary(id));
    } else {
      dispatch(getBorrowedForUser());
    }
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
          getBorrowedInProgress ||
          createBorrowedInProgress ||
          returnBorrowedInProgress
        }
      >
        <CircularProgress color='inherit' />
      </Backdrop>

      <Stack direction={'column'} gap={0.7}>
        {isAdminPage ? (
          <>
            <Typography variant='h6'>
              {viewLibrary.LibraryName} - {viewLibrary.Address}
            </Typography>
            <Divider />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Paper sx={{ p: 1 }}>
                  <Stack direction={'column'} spacing={1}>
                    <Typography variant='h6'>Take book</Typography>
                    <TextField
                      id='filled-basic'
                      label='BookId'
                      variant='filled'
                      size='small'
                      value={takeBookId}
                      onChange={e => {
                        setTakeBookId(e.target.value);
                      }}
                    />
                    <TextField
                      id='filled-basic'
                      label='UserId'
                      variant='filled'
                      size='small'
                      value={takeUserId}
                      onChange={e => {
                        setTakeUserId(e.target.value);
                      }}
                    />
                    <DesktopDatePicker
                      label='Last Date'
                      inputFormat='DD/MM/YYYY'
                      minDate={moment()}
                      value={takeLastDate}
                      onChange={handleLastDateChange}
                      renderInput={params => <TextField {...params} />}
                    />
                    <Button
                      variant='contained'
                      onClick={() => {
                        if (takeBookId.length === 36 && takeUserId.length === 28) {
                          dispatch(createBorrowed(takeBookId, takeUserId, takeLastDate));
                          setTakeBookId('');
                          setTakeUserId(0);
                        }
                      }}
                    >
                      Take
                    </Button>
                  </Stack>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper sx={{ p: 1 }}>
                  <Stack direction={'column'} spacing={1}>
                    <Typography variant='h6'>Return book</Typography>
                    <TextField
                      id='filled-basic'
                      label='BookId'
                      variant='filled'
                      size='small'
                      value={returnBookId}
                      onChange={e => {
                        setReturnBookId(e.target.value);
                      }}
                    />
                    <TextField
                      id='filled-basic'
                      label='UserId'
                      variant='filled'
                      size='small'
                      value={returnUserId}
                      onChange={e => {
                        setReturnUserId(e.target.value);
                      }}
                    />
                    <Button
                      variant='contained'
                      onClick={() => {
                        if (returnBookId.length === 36 && returnUserId.length === 28) {
                          dispatch(returnBorrowed(returnBookId, returnUserId));
                          setReturnBookId('');
                          setReturnUserId(0);
                        }
                      }}
                    >
                      Return
                    </Button>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
            <Divider />
          </>
        ) : null}
        <Typography variant='h4'>Borrowed Books</Typography>
        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
        >
          {isAdminPage
            ? borrowedForLibrary.map(item => {
                return (
                  <BorrowedCard borrowed={item} key={item.borrowedId} isAdminPage={isAdminPage} />
                );
              })
            : borrowedForUser.map(item => {
                return (
                  <BorrowedCard borrowed={item} key={item.borrowedId} isAdminPage={isAdminPage} />
                );
              })}
        </Stack>
      </Stack>
    </Paper>
  );
};

export default BorrowedPage;
