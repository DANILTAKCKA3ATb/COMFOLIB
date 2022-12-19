import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Backdrop,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import AddIcon from '@mui/icons-material/Add';
import { searchLibraries, setSearchText } from '../../redux/searchLibraryReducer';
import { setLibraryForChange } from '../../redux/createLibraryReducer';
import LibraryCard from '../LibraryCard/LibraryCard';

const LibrariesPage = ({ isAdminPage, ...props }) => {
  const { libraries, searchLibraryInProgress, searchLibraryError, searchText } = useSelector(
    state => state.searchLibrary
  );
  const { deleteLibraryError, deleteLibraryInProgress } = useSelector(state => state.createLibrary);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(searchLibraries());
    dispatch(setLibraryForChange(null));
  }, []);

  const textFilter = library => {
    if (searchText === '') return true;
    if (library.LibraryName.toLowerCase().includes(searchText)) return true;
    if (library.Address.toLowerCase().includes(searchText)) return true;
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
      <Backdrop
        sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
        open={searchLibraryInProgress || deleteLibraryInProgress}
      >
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
        {isAdminPage ? (
          <Button
            size='large'
            variant='contained'
            color='success'
            sx={{ ml: 'auto' }}
            onClick={() => {
              navigate('/createlibrary');
            }}
          >
            Add Library
            <AddIcon sx={{ ml: 1 }} />
          </Button>
        ) : null}
      </Stack>
      <Divider sx={{ mt: 1, mb: 2 }} />
      <Stack
        sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}
      >
        {searchLibraryError || deleteLibraryError ? <ReportProblemIcon /> : null}
        {libraries.map(library => {
          if (textFilter(library))
            return (
              <LibraryCard
                library={library}
                key={library.id}
                isAdminPage={isAdminPage}
                handleSubmit={null}
              />
            );
        })}
      </Stack>
    </Paper>
  );
};

export default LibrariesPage;
