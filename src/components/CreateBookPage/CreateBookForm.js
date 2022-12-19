import {
  Autocomplete,
  Backdrop,
  Button,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-final-form';
import FieldTextInput from '../../common/FieldTextInput/FieldTextInput';
import defaultBookCover from './../../assets/defaultBookImg/defaultBookCover.jpg';
import { setBookTopics } from '../../redux/createBookReducer';
import { getTopics } from '../../redux/searchBookReducer';

export const CreateBookForm = props => {
  const dispatch = useDispatch();
  const { allTopics } = useSelector(state => state.searchBook);
  const { bookForChange, bookTopics } = useSelector(state => state.createBook);

  const [coverPreview, setCoverPreview] = useState();
  const [coverFileName, setCoverFileName] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');

  useEffect(() => {
    dispatch(getTopics());
  });

  const onSelectImage = e => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    props.setCover(file);

    setCoverPreview(URL.createObjectURL(file));
    setCoverFileName(file.name);
  };

  const onSelectedPDFFile = e => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    props.setPdf(file);

    setPdfFileName(file.name);
  };

  return (
    <Form
      {...props}
      initialValues={bookForChange}
      render={formProps => {
        const { handleSubmit, inProgress, onError } = formProps;
        const errorMessage = onError ? 'Something is wrong ¯\\_(ツ)_/¯' : null;

        return (
          <form sx={{ width: '100%', mt: 3, p: 1 }} onSubmit={handleSubmit}>
            <Backdrop
              sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
              open={inProgress}
            >
              <CircularProgress color='inherit' />
            </Backdrop>

            <Typography variant='h4' sx={{ mb: 2, mt: 1 }}>
              {bookForChange ? 'Change book' : 'Create Book'}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Stack direction='row'>
              <Paper
                component='img'
                sx={{ height: '450px', width: '300px', objectFit: 'contain' }}
                src={
                  coverPreview
                    ? coverPreview
                    : !!bookForChange
                    ? bookForChange.BookCover
                    : defaultBookCover
                }
                alt='Book Cover'
              ></Paper>
              <Container>
                <Stack direction='column' gap={1}>
                  <FieldTextInput
                    required
                    variant='outlined'
                    type='text'
                    id='BookName'
                    label='Book Name'
                    name='BookName'
                  />
                  <FieldTextInput
                    required
                    variant='outlined'
                    type='text'
                    id='AuthorName'
                    label='Author'
                    name='AuthorName'
                  />
                  <FieldTextInput
                    required
                    variant='outlined'
                    type='number'
                    id='Year'
                    label='Year of writing'
                    name='Year'
                  />
                  <Button variant='contained' component='label'>
                    <Typography variant='h6'>Add book cover</Typography>
                    {!!bookForChange ? (
                      <input
                        type='file'
                        id='BookCover'
                        name='BookCover'
                        accept='image/*'
                        onChange={onSelectImage}
                        hidden
                      />
                    ) : (
                      <input
                        required
                        type='file'
                        id='BookCover'
                        name='BookCover'
                        accept='image/*'
                        onChange={onSelectImage}
                        hidden
                      />
                    )}
                  </Button>
                  <Typography variant='caption' color='green' textAlign={'center'}>
                    {coverFileName}
                  </Typography>
                  <Typography variant='caption' textAlign={'center'}>
                    (Important! The image must be in jpg or png format, with an aspect ratio of 2:3)
                  </Typography>
                  <Button variant='contained' component='label'>
                    <Typography variant='h6'>Add book pdf file </Typography>
                    {!!bookForChange ? (
                      <input
                        type='file'
                        id='BookPDF'
                        name='BookPDF'
                        accept='.pdf'
                        onChange={onSelectedPDFFile}
                        hidden
                      />
                    ) : (
                      <input
                        required
                        type='file'
                        id='BookPDF'
                        name='BookPDF'
                        accept='.pdf'
                        onChange={onSelectedPDFFile}
                        hidden
                      />
                    )}
                  </Button>
                  <Typography variant='caption' color='green' textAlign={'center'}>
                    {pdfFileName}
                  </Typography>
                  <Typography variant='caption' textAlign={'center'}>
                    {' '}
                    (Important! Compress PDF file before uploading)
                  </Typography>
                  <Autocomplete
                    multiple
                    options={allTopics}
                    defaultValue={bookTopics}
                    isOptionEqualToValue={(option, value) => option === value}
                    filterSelectedOptions
                    getOptionLabel={option => option}
                    onChange={(target, value) => dispatch(setBookTopics(value))}
                    renderInput={params => <TextField {...params} label='Topics' />}
                  />
                </Stack>
              </Container>
              <Divider orientation='vertical' flexItem />
              <Container>
                <FieldTextInput
                  required
                  variant='outlined'
                  type='text'
                  id='Description'
                  label='Description'
                  name='Description'
                  autoComplete='The story of the...'
                  multiline
                  fullWidth
                  rows={18}
                />
              </Container>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Stack
              direction='row'
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              {errorMessage ? (
                <Typography color='error' sx={{ mb: 3 }}>
                  {errorMessage}
                </Typography>
              ) : null}
              <Button
                type='submit'
                size='large'
                variant='contained'
                color='success'
                sx={{ ml: 'auto' }}
              >
                {bookForChange ? 'Change book' : 'Create Book'}
              </Button>
            </Stack>
          </form>
        );
      }}
    />
  );
};
