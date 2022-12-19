import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/authReducer';
import { Container, Avatar, Typography, Paper } from '@mui/material';
import LoginForm from './LoginForm';
import { LockOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const LoginPage = props => {
  const dispatch = useDispatch();
  const { loginInProgress, loginError } = useSelector(state => state.auth);

  const { isAuthenticated } = useSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/main');
  }, [isAuthenticated]);

  const handleSubmit = values => {
    const { email, password } = values;

    dispatch(login(email, password));
  };

  return (
    <Container component='main' maxWidth='xs'>
      <Paper
        sx={{
          mt: 8,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1 }}>
          <LockOutlined />
        </Avatar>
        <Typography component='h1' variant='h5' sx={{ pb: 1 }}>
          Sign in
        </Typography>
        <LoginForm onSubmit={handleSubmit} inProgress={loginInProgress} onError={loginError} />
      </Paper>
    </Container>
  );
};

export default LoginPage;
