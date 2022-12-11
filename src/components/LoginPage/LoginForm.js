import React from 'react';
import { Link } from 'react-router-dom';
import { Form } from 'react-final-form';

import FieldTextInput from './../../common/FieldTextInput/FieldTextInput';
import { Backdrop, Button, CircularProgress, Grid, Typography } from '@mui/material';
const WRONG_CREDENTIALS = 'auth/wrong-password';
const NOT_FOUND = 'auth/user-not-found';
const LOGIN_BLOCKED = 'auth/too-many-requests';

const printErrorMessage = error => {
    switch (error.code) {
        case WRONG_CREDENTIALS:
            return 'Wrong email or password';
        case NOT_FOUND:
            return 'User does not exist';
        case LOGIN_BLOCKED:
            return 'User blocked ¯\\_(ツ)_/¯';
        default:
            return 'Something went wrong. Try again';
    }
};

const LoginForm = props => {
    return (
        <Form
            {...props}
            render={formProps => {
                const { handleSubmit, inProgress, onError } = formProps;

                const errorMessage = onError ? printErrorMessage(onError) : null;

                return (
                    <form sx={{ width: '100%', mt: 3, p: 1 }} onSubmit={handleSubmit}>
                        <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={inProgress}>
                            <CircularProgress color='inherit' />
                        </Backdrop>

                        {errorMessage ? (
                            <Typography color='error' sx={{ mb: 3 }}>
                                {errorMessage}
                            </Typography>
                        ) : null}
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FieldTextInput variant='outlined' required type='email' id='email' label='Email Address' name='email' autoComplete='email' />
                            </Grid>
                            <Grid item xs={12}>
                                <FieldTextInput
                                    variant='outlined'
                                    required
                                    name='password'
                                    label='Password'
                                    type='password'
                                    id='password'
                                    autoComplete='current-password'
                                />
                            </Grid>
                        </Grid>
                        <Button type='submit' fullWidth variant='contained' color='primary' sx={{ mt: 2 }}>
                            Sign In
                        </Button>
                        <Grid container justify='flex-end'>
                            <Grid item sx={{ mt: 1 }}>
                                <Link to='/signup'>Don't have an account? Sign Up</Link>
                            </Grid>
                        </Grid>
                    </form>
                );
            }}
        />
    );
};

export default LoginForm;
