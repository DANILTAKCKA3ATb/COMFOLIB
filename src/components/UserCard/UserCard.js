import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Avatar, Box, Card, CardContent, IconButton, Typography } from '@mui/material';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import { Container, Stack } from '@mui/system';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import { removeUserAdmin } from '../../redux/userReducer';

const UserCard = ({
  user,
  setIsMakeUserAdminMenuOpen,
  setUserForMakingAdmin,
  isUsersPage,
  ...props
}) => {
  const dispatch = useDispatch();

  const [cardColor, setCardColor] = useState(null);

  useEffect(() => {
    if (user.isAdmin) setCardColor('green');
  }, []);

  const onMakeAdminUser = () => {
    setUserForMakingAdmin(user.id);
    setIsMakeUserAdminMenuOpen(true);
  };

  const onRemoveAdminUser = () => {
    dispatch(removeUserAdmin(user.id));
  };

  return (
    <>
      <Card
        elevation={4}
        sx={{
          position: 'relative',
          width: '320px',
          height: '110px',
          m: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            left: '280px',
            top: '35px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {isUsersPage ? (
            user.isAdmin ? (
              <IconButton
                color='success'
                onClick={e => {
                  e.stopPropagation();
                  onRemoveAdminUser();
                }}
              >
                <KeyboardDoubleArrowDownIcon />
              </IconButton>
            ) : (
              <IconButton
                color='success'
                onClick={e => {
                  e.stopPropagation();
                  onMakeAdminUser();
                }}
              >
                <KeyboardDoubleArrowUpIcon />
              </IconButton>
            )
          ) : null}
        </Box>
        <CardContent sx={{ my: 'auto' }}>
          <Stack direction={'row'}>
            <Avatar sx={{ bgcolor: cardColor }}>{user.Name.substr(0, 1)}</Avatar>
            <Container>
              <Typography variant='body1'>{user.Name}</Typography>
              <Typography variant='body2'>{user.Email}</Typography>
              {user.isAdmin ? <Typography variant='subtitle2'>Admin</Typography> : null}
            </Container>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};

export default UserCard;
