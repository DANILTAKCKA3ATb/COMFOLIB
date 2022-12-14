import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Backdrop, Button, CircularProgress, Container, Divider, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import BookCard from '../BookCard/BookCard';
import { getBookshelfBooks } from '../../redux/bookshelfReducer';

const BookshelfPage = ({ isAdminPage, ...props }) => {
    const { isAuthenticated } = useSelector(state => state.auth);
    const { bookshelfBooks, bookshelfBooksId, getBookshelfBooksInProgress, getBookshelfBookError } = useSelector(state => state.bookshelf);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const verifyBookshelfById = () => {
        let currentBooksIds = [];
        for (let book of bookshelfBooks) {
            currentBooksIds.push(book.id);
        }
        return currentBooksIds.sort().join(',') === bookshelfBooksId.sort().join(',');
    };

    useEffect(() => {
        if (!isAuthenticated) navigate('/login');
        if (bookshelfBooks.length === 0 || !verifyBookshelfById()) dispatch(getBookshelfBooks());
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
            <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={getBookshelfBooksInProgress}>
                <CircularProgress color='inherit' />
            </Backdrop>
            <Typography variant='h4' textAlign={'justify'}>
                My Bookshelf
            </Typography>
            <Divider sx={{ mt: 1, mb: 2 }} />
            <Stack sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                {getBookshelfBookError ? <ReportProblemIcon /> : null}
                {bookshelfBooks.map(book => {
                    return <BookCard book={book} key={book.id} onSearchBooks={null} isAdminPage={false} />;
                })}
            </Stack>
        </Paper>
    );
};

export default BookshelfPage;
