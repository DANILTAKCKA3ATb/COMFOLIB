import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Backdrop,
    Button,
    Chip,
    CircularProgress,
    Container,
    Divider,
    IconButton,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getViewBook } from '../../redux/searchBookReducer';
import { Box } from '@mui/system';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

const BookPage = props => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, isAdmin } = useSelector(state => state.auth);
    const { viewBook, getViewBookError, getViewBookInProgress } = useSelector(state => state.searchBook);

    const [isDescriptionOpen, setIsDescriptonOpen] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) navigate('/login');
        const id = window.location.href.split('/')[4];
        dispatch(getViewBook(id));
    }, []);

    // useEffect(() => {
    //     if (!getViewBookInProgress) setBookCover(viewBook.BookCover);
    // });

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
            <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={getViewBookInProgress}>
                <CircularProgress color='inherit' />
            </Backdrop>

            <Stack direction={'row'} gap={2}>
                <Stack direction={'column'} gap={2}>
                    <Box
                        component='img'
                        sx={{ position: 'relative', height: '480px', width: '320px', objectFit: 'contain', backgroundColor: '#f1f1f1' }}
                        src={viewBook.BookCover}
                        alt='Book Cover'
                    ></Box>
                    <Box sx={{ position: 'absolute', left: '428px', display: 'flex', flexDirection: 'column' }}>
                        <IconButton color='error' onClick={() => {}}>
                            <FavoriteBorderIcon sx={{ fontSize: 60 }} />
                        </IconButton>
                    </Box>
                    <Button variant='contained' color='secondary'>
                        Add to bookshelf
                        <TurnedInNotIcon sx={{ mx: 0.3 }} />
                    </Button>
                    <Button variant='contained'>
                        Read
                        <MenuBookIcon sx={{ mx: 0.5 }} />
                    </Button>
                </Stack>
                <Stack direction={'column'} gap={0.7}>
                    <Typography variant='h4' textAlign={'justify'}>
                        {viewBook.BookName}
                    </Typography>
                    <Typography variant='h6'>
                        {viewBook.AuthorName} - {viewBook.Year}
                    </Typography>
                    <Divider />
                    <Stack
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                        }}
                    >
                        {viewBook.Topics.map(topic => {
                            return <Chip key={topic} size='small' label={topic} sx={{ m: 0.2 }} />;
                        })}
                    </Stack>
                    <Divider />
                    <Typography
                        textAlign={'justify'}
                        variant='body2'
                        onClick={() => {
                            setIsDescriptonOpen(!isDescriptionOpen);
                        }}
                    >
                        {isDescriptionOpen ? viewBook.Description : viewBook.Description.slice(0, 1000) + (viewBook.Description.length >= 1000 ? '...' : '')}
                    </Typography>
                    <Divider />
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
                            <Typography variant='subtitle1'>Where can I find this book?</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </Stack>
            </Stack>
        </Paper>
    );
};

export default BookPage;
