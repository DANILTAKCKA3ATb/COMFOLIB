import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Worker } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import {
  changeViewBookLike,
  getLibrariesWithBook,
  getViewBook,
  getViewBookLike,
} from '../../redux/searchBookReducer';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { addRemoveBookshelfBook, getBookshelfBooksId } from '../../redux/bookshelfReducer';
import LibraryCard from '../LibraryCard/LibraryCard';

const BookPage = props => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  const {
    viewBook,
    getViewBookError,
    getViewBookInProgress,
    getLibrariesWithBookInProgress,
    getLibrariesWithBookError,
    librariesWithBook,
    getViewBookLikeInProgress,
    getViewBookLikeError,
    viewBookLike,
  } = useSelector(state => state.searchBook);
  const { addBookshelfBookInProgress, addBookshelfBookError, bookshelfBooksId } = useSelector(
    state => state.bookshelf
  );
  const [isDescriptionOpen, setIsDescriptonOpen] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isBookReaderOpen, setIsBookReaderOpen] = useState(false);

  useEffect(() => {
    const id = window.location.href.split('/')[4];
    dispatch(getViewBook(id));
    dispatch(getBookshelfBooksId());
    dispatch(getLibrariesWithBook(id));
    dispatch(getViewBookLike(id));
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
          getViewBookInProgress ||
          addBookshelfBookInProgress ||
          getLibrariesWithBookInProgress ||
          getViewBookLikeInProgress
        }
      >
        <CircularProgress color='inherit' />
      </Backdrop>

      <Stack direction={'row'} gap={2}>
        <Stack direction={'column'} gap={2}>
          <Paper
            elevation={4}
            component='img'
            sx={{
              height: '480px',
              width: '320px',
              objectFit: 'contain',
              backgroundColor: '#f1f1f1',
            }}
            src={viewBook.BookCover}
            alt='Book Cover'
          ></Paper>
          {isAuthenticated ? (
            <Stack direction={'row'} sx={{ display: 'flex', flexDirection: 'row' }}>
              <Button
                variant='contained'
                color='error'
                onClick={() => {
                  dispatch(changeViewBookLike(viewBook.id, viewBook.Topics));
                }}
              >
                Like
                {viewBookLike ? (
                  <FavoriteIcon sx={{ mx: 0.3 }} />
                ) : (
                  <FavoriteBorderIcon sx={{ mx: 0.3 }} />
                )}
              </Button>
              <Button
                variant='contained'
                color='secondary'
                sx={{ ml: 'auto' }}
                onClick={() => {
                  dispatch(
                    addRemoveBookshelfBook(viewBook.id, bookshelfBooksId.includes(viewBook.id))
                  );
                }}
              >
                {bookshelfBooksId.includes(viewBook.id) ? 'Remove from shelf' : 'Add to bookshelf'}
                {bookshelfBooksId.includes(viewBook.id) ? (
                  <TurnedInIcon sx={{ mx: 0.3 }} />
                ) : (
                  <TurnedInNotIcon sx={{ mx: 0.3 }} />
                )}
              </Button>
            </Stack>
          ) : null}

          <Button
            variant='contained'
            onClick={() => {
              setIsBookReaderOpen(!isBookReaderOpen);
            }}
          >
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
              setIsAccordionOpen(false);
            }}
          >
            {isDescriptionOpen
              ? viewBook.Description
              : viewBook.Description.slice(0, 1000) +
                (viewBook.Description.length >= 1000 ? '...' : '')}
          </Typography>
          <Divider />
          <Accordion
            expanded={isAccordionOpen}
            onClick={() => {
              setIsAccordionOpen(!isAccordionOpen);
              setIsDescriptonOpen(false);
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1a-content'
              id='panel1a-header'
            >
              <Typography variant='subtitle1'>Where can I find this book?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                {librariesWithBook.map(library => {
                  return (
                    <LibraryCard
                      key={library.id}
                      library={library}
                      isAdminPage={false}
                      handleSubmit={null}
                    />
                  );
                })}
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Stack>
      </Stack>
      <Worker workerUrl='https://unpkg.com/pdfjs-dist@3.1.81/build/pdf.worker.min.js'>
        {isBookReaderOpen ? (
          <Paper elevation={4} sx={{ mx: 4, mb: 2, mt: 7, width: '100', height: '665px' }}>
            <Viewer fileUrl={viewBook.BookPDF} />
          </Paper>
        ) : null}
      </Worker>
    </Paper>
  );
};

export default BookPage;
