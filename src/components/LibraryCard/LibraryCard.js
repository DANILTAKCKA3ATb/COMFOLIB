import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Card, CardContent, IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteLibrary, setLibraryForChange } from '../../redux/createLibraryReducer';
import { searchLibraries } from '../../redux/searchLibraryReducer';
import { Container } from '@mui/system';

const LibraryCard = ({ library, isAdminPage, ...props }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { deleteLibraryError } = useSelector(state => state.createLibrary);

    useEffect(() => {});

    const onChangeLibrary = book => {
        dispatch(setLibraryForChange(book));
        navigate('/createlibrary');
    };

    const onDeleteLibrary = id => {
        dispatch(deleteLibrary(id));
        if (deleteLibraryError == null) dispatch(searchLibraries());
    };

    return (
        <Card
            elevation={4}
            sx={{ position: 'relative', width: '200px', height: '80px', m: 1, display: 'flex', flexDirection: 'column' }}
            onClick={e => {
                e.stopPropagation();
                if(isAdminPage) navigate('/librarypage/' + library.id);
            }}
        >
            {isAdminPage ? (
                <Box sx={{ position: 'absolute', left: '160px', display: 'flex', flexDirection: 'column' }}>
                    <IconButton
                        color='primary'
                        onClick={e => {
                            e.stopPropagation();
                            onChangeLibrary(library);
                        }}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        color='error'
                        onClick={e => {
                            e.stopPropagation();
                            onDeleteLibrary(library.id);
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ) : null}

            <CardContent sx={{ my: 'auto' }}>
                <Typography variant='body2'>{library.LibraryName}</Typography>
                <Typography variant='caption'>{library.Address}</Typography>
            </CardContent>
        </Card>
    );
};

export default LibraryCard;
