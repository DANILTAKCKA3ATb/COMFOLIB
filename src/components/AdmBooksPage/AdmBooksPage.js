import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Backdrop, Button, CircularProgress, Container, Divider, IconButton, Paper, Stack, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import BookCard from '../BookCard/BookCard';
import { searchBooks } from '../../redux/searchBookReducer';
import { setBookForChange } from '../../redux/createBookReducer';

const AdmBooksPage = props => {
    const { isAuthenticated, isAdmin } = useSelector(state => state.auth);
    const { books, searchBookInProgress, searchBookError } = useSelector(state => state.searchBook);
    const { deleteBookInProgress, deleteBookError } = useSelector(state => state.createBook);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) navigate('/login');
        dispatch(searchBooks('a'));
        dispatch(setBookForChange(null));
        setIsLoading(false);
    }, []);

    const onSearchBooks = () => {
        dispatch(searchBooks());
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
            <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={isLoading || searchBookInProgress || deleteBookInProgress}>
                <CircularProgress color='inherit' />
            </Backdrop>
            <Stack direction='row' sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <TextField size='small' label='Search' variant='filled' sx={{ flexBasis: '50%' }} />
                <IconButton
                    size='large'
                    sx={{ mx: 1 }}
                    onClick={() => {
                        onSearchBooks();
                    }}
                >
                    <SearchIcon />
                </IconButton>
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
            </Stack>
            <Divider sx={{ mt: 1, mb: 2 }} />
            <Stack sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                {searchBookError || deleteBookError ? <ReportProblemIcon /> : null}
                {books.map(book => {
                    return <BookCard book={book} key={book.id} onSearchBooks={onSearchBooks} />;
                })}
            </Stack>
        </Paper>
    );
};

export default AdmBooksPage;
