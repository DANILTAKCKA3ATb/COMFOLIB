import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Backdrop, CircularProgress, Divider, IconButton, Paper, Stack, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { getUsers, setSearchText } from '../../redux/userReducer';
import UserCard from '../../common/UserCard/UserCard';

const UsersPage = props => {
    const { isAuthenticated, isAdmin } = useSelector(state => state.auth);
    const { searchText, getUsersInProgress, getUsersError, users } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) navigate('/login');
        dispatch(getUsers());
    }, []);

    const textFilter = user => {
        if (searchText === '') return true;
        if (user.Name.toLowerCase().includes(searchText)) return true;
        if (user.Email.toLowerCase().includes(searchText)) return true;
        return false;
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
            <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={getUsersInProgress}>
                <CircularProgress color='inherit' />
            </Backdrop>
            <Stack direction='row' sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <TextField
                    size='small'
                    label='Search'
                    variant='filled'
                    sx={{ flexBasis: '50%' }}
                    value={searchText}
                    onChange={e => {
                        dispatch(setSearchText(e.target.value));
                    }}
                />
            </Stack>
            <Divider sx={{ mt: 1, mb: 2 }} />
            <Stack sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                {/* {getUsersError || deleteUserError ? <ReportProblemIcon /> : null} */}
                {users.map(user => {
                    if (textFilter(user)) return <UserCard user={user} key={user.id} />;
                })}
            </Stack>
        </Paper>
    );
};

export default UsersPage;
