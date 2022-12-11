import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../../redux/authReducer';
import { Container, Avatar, Typography, Paper } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import SignupForm from './SingupForm';
import { useNavigate } from 'react-router-dom';

const SignupPage = props => {
    const dispatch = useDispatch();
    const { signupInProgress, signupError } = useSelector(state => state.auth);

    const { isAuthenticated } = useSelector(state => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) navigate('/main');
    });

    const handleSubmit = values => {
        dispatch(signup(values));
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
                    Create an account
                </Typography>
                <SignupForm onSubmit={handleSubmit} inProgress={signupInProgress} onError={signupError} />
            </Paper>
        </Container>
    );
};

export default SignupPage;
