import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Box, Card, CardContent, IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import BlockIcon from '@mui/icons-material/Block';
import { Container, Stack } from '@mui/system';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';

const UserCard = ({ user, ...props }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {} = useSelector(state => state.user);

    const [cardColor, setCardColor] = useState(null);
    useEffect(() => {
        if (user.isAdmin) setCardColor('green');
    });

    const onDeleteUser = id => {
        //dispatch(deleteLibrary(id));
        //if (deleteLibraryError == null) dispatch(searchLibraries());
    };

    const onMakeAdminUser = id => {
        //dispatch(deleteLibrary(id));
        //if (deleteLibraryError == null) dispatch(searchLibraries());
    };

    const onRemoveAdminUser = id => {
        //dispatch(deleteLibrary(id));
        //if (deleteLibraryError == null) dispatch(searchLibraries());
    };

    return (
        <>
            <Card elevation={4} sx={{ position: 'relative', width: '320px', height: '110px', m: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ position: 'absolute', left: '280px', top: '15px', display: 'flex', flexDirection: 'column' }}>
                    {user.isAdmin ? (
                        <IconButton
                            color='success'
                            onClick={e => {
                                e.stopPropagation();
                                onRemoveAdminUser(user.id);
                            }}
                        >
                            <KeyboardDoubleArrowDownIcon />
                        </IconButton>
                    ) : (
                        <IconButton
                            color='success'
                            onClick={e => {
                                e.stopPropagation();
                                onMakeAdminUser(user.id);
                            }}
                        >
                            <KeyboardDoubleArrowUpIcon />
                        </IconButton>
                    )}

                    <IconButton
                        color='error'
                        onClick={e => {
                            e.stopPropagation();
                            onDeleteUser(user.id);
                        }}
                    >
                        <BlockIcon />
                    </IconButton>
                </Box>

                <CardContent sx={{ my: 'auto' }}>
                    <Stack direction={'row'}>
                        <Avatar sx={{ bgcolor: cardColor }}>{user.Name.substr(0, 1)}</Avatar>
                        <Container>
                            <Typography variant='body1'>{user.Name}</Typography>
                            <Typography variant='body2'>{user.Email}</Typography>
                            {user.isAdmin ? <Typography variant='caption'>Admin</Typography> : null}
                        </Container>
                    </Stack>
                </CardContent>
            </Card>
        </>
    );
};

export default UserCard;
