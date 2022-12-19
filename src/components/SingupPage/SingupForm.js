import React from 'react';
import { Link } from 'react-router-dom';
import { Form } from 'react-final-form';
import { Grid, Button, Typography, CircularProgress, Backdrop } from '@mui/material';
import FieldTextInput from './../../common/FieldTextInput/FieldTextInput';

const USER_TAKEN = 'auth/email-already-in-use';

const SignupForm = props => {
  return (
    <Form
      {...props}
      render={formProps => {
        const { handleSubmit, inProgress, onError } = formProps;

        const errorMessage = onError
          ? onError.code === USER_TAKEN
            ? 'This email is already registered'
            : 'Something went wrong. Try again'
          : null;

        return (
          <form sx={{ width: '100%', mt: 3 }} onSubmit={handleSubmit}>
            <Backdrop
              sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
              open={inProgress}
            >
              <CircularProgress color='inherit' />
            </Backdrop>

            {errorMessage ? (
              <Typography color='error' sx={{ mb: 3 }}>
                {errorMessage}
              </Typography>
            ) : null}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FieldTextInput
                  autoComplete='name'
                  name='Name'
                  variant='outlined'
                  required
                  id='Name'
                  label='Name'
                />
              </Grid>
              <Grid item xs={12}>
                <FieldTextInput
                  variant='outlined'
                  required
                  type='email'
                  id='email'
                  label='Email Address'
                  name='email'
                  autoComplete='email'
                />
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
            <Button
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
              sx={{ mt: 2 }}
              startIcon={inProgress ? <CircularProgress /> : null}
            >
              Sign Up
            </Button>
            <Grid container justify='flex-end'>
              <Grid item sx={{ mt: 1 }}>
                <Link to='/login'>Already have an account? Sign in</Link>
              </Grid>
            </Grid>
          </form>
        );
      }}
    />
  );
};

export default SignupForm;
