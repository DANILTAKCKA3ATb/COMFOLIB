import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { delay } from '../../redux/createBookReducer';
import { CreateLibraryForm } from './CreateLibraryForm';
import { createLibrary } from '../../redux/createLibraryReducer';

const CreateLibraryPage = props => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);
  const { creationLibraryInProgress, creationLibraryError, libraryForChange } = useSelector(
    state => state.createLibrary
  );

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  });

  const handleSubmit = async values => {
    const library = {
      id: '',
      LibraryName: values.LibraryName,
      Address: values.Address,
      CreatedAt: null,
    };
    console.log(library);
    try {
      if (libraryForChange) dispatch(createLibrary(library, libraryForChange.id));
      else dispatch(createLibrary(library));
    } catch (e) {
      return;
    } finally {
      await delay(500);
      navigate('/librariesAdm');
    }
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
      <CreateLibraryForm
        onSubmit={handleSubmit}
        inProgress={creationLibraryInProgress}
        onError={creationLibraryError}
      />
    </Paper>
  );
};

export default CreateLibraryPage;
