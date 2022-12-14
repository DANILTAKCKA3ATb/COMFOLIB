import {  Backdrop, Button, CircularProgress, Container, Divider,  Stack, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-final-form';
import FieldTextInput from '../../common/FieldTextInput/FieldTextInput';

export const CreateLibraryForm = props => {
    const dispatch = useDispatch();
    const {libraryForChange} = useSelector(state => state.createLibrary);

    useEffect(() => {});

    return (
        <Form
            {...props}
            initialValues={libraryForChange}
            render={formProps => {
                const { handleSubmit, inProgress, onError } = formProps;
                const errorMessage = onError ? 'Something is wrong ¯\\_(ツ)_/¯' : null;

                return (
                    <form sx={{ width: '100%', mt: 3, p: 1 }} onSubmit={handleSubmit}>
                        <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={inProgress}>
                            <CircularProgress color='inherit' />
                        </Backdrop>

                        <Typography variant='h4' sx={{ mb: 2, mt: 1 }}>
                            {libraryForChange ? 'Change Library' : 'Create Library'}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Stack direction='row'>
                            <Container sx={{mr: 70 }}>
                                <Stack direction='column' gap={1}>
                                    <FieldTextInput required variant='outlined' type='text' id='LibraryName' label='Library Name' name='LibraryName' />
                                    <FieldTextInput required variant='outlined' type='text' id='Address' label='Address' name='Address' />
                                </Stack>
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
                            <Button type='submit' size='large' variant='contained' color='success' sx={{ ml: 'auto' }}>
                                {libraryForChange ? 'Change Library' : 'Create Library'}
                            </Button>
                        </Stack>
                    </form>
                );
            }}
        />
    );
};
