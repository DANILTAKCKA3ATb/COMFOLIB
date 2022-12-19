import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Backdrop,
  Checkbox,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { getUsers, setSearchText, setUserAdmin } from '../../redux/userReducer';
import UserCard from '../UserCard/UserCard';
import MakeUserAdminMenu from './MakeUserAdminMenu';

const UsersPage = props => {
  const { isAuthenticated } = useSelector(state => state.auth);
  const { searchText, getUsersInProgress, getUsersError, users } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isMakeUserAdminMenuOpen, setIsMakeUserAdminMenuOpen] = useState(false);
  const [userForMakingAdmin, setUserForMakingAdmin] = useState({});

  const [onlyAdmin, setOnlyAdmin] = useState(false);

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

  const handleSubmit = libraryId => {
    dispatch(setUserAdmin(userForMakingAdmin, libraryId));
    setIsMakeUserAdminMenuOpen(false);
    setUserForMakingAdmin({});
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
      <Backdrop
        sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
        open={getUsersInProgress}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
      {isMakeUserAdminMenuOpen ? (
        <MakeUserAdminMenu
          isMakeUserAdminMenuOpen={isMakeUserAdminMenuOpen}
          setIsMakeUserAdminMenuOpen={setIsMakeUserAdminMenuOpen}
          handleSubmit={handleSubmit}
        />
      ) : null}

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
        <Checkbox
          checked={onlyAdmin}
          onClick={() => {
            setOnlyAdmin(!onlyAdmin);
          }}
        />
        <Typography variant='subtitle2'> Only Admin</Typography>
      </Stack>
      <Divider sx={{ mt: 1, mb: 2 }} />
      <Stack
        sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}
      >
        {getUsersError ? <ReportProblemIcon /> : null}
        {users.map(user => {
          if (textFilter(user)) {
            if (onlyAdmin) {
              if (user.isAdmin)
                return (
                  <UserCard
                    user={user}
                    key={user.id}
                    setIsMakeUserAdminMenuOpen={setIsMakeUserAdminMenuOpen}
                    setUserForMakingAdmin={setUserForMakingAdmin}
                    isUsersPage={true}
                  />
                );
            } else {
              return (
                <UserCard
                  user={user}
                  key={user.id}
                  setIsMakeUserAdminMenuOpen={setIsMakeUserAdminMenuOpen}
                  setUserForMakingAdmin={setUserForMakingAdmin}
                  isUsersPage={true}
                />
              );
            }
          }
        })}
      </Stack>
    </Paper>
  );
};

export default UsersPage;
