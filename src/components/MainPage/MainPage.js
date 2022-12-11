import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Backdrop, CircularProgress, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MainPage = props => {
    const { isAuthenticated } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) navigate('/login');
    });

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
                alignItems: 'center',
            }}
        >
            <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={false}>
                <CircularProgress color='inherit' />
            </Backdrop>
        </Paper>
    );
};

export default MainPage;
