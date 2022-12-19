import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Backdrop,
  CircularProgress,
  Divider,
  Modal,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { searchLibraries } from '../../redux/searchLibraryReducer';
import LibraryCard from '../LibraryCard/LibraryCard';

const MakeUserAdminMenu = ({
  isMakeUserAdminMenuOpen,
  setIsMakeUserAdminMenuOpen,
  handleSubmit,
  ...props
}) => {
  const dispatch = useDispatch();
  const { libraries, searchLibraryInProgress, searchLibraryError } = useSelector(
    state => state.searchLibrary
  );

  useEffect(() => {
    dispatch(searchLibraries());
  }, []);

  return (
    <Modal
      open={isMakeUserAdminMenuOpen}
      onClose={() => {
        setIsMakeUserAdminMenuOpen(false);
      }}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Paper
        elevation={5}
        sx={{
          m: 1,
          mx: '30%',
          p: 2,
          minHeight: '510px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Backdrop
          sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
          open={searchLibraryInProgress}
        >
          <CircularProgress color='inherit' />
        </Backdrop>
        <Typography variant='h4'>Are you sure you want to make this user admin?</Typography>
        <Typography variant='h6'>Select the library in which this administrator works</Typography>
        <Divider sx={{ mt: 1, mb: 2 }} />
        <Stack
          sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          {searchLibraryError ? <ReportProblemIcon /> : null}
          {libraries.map(library => {
            return (
              <LibraryCard
                library={library}
                key={library.id}
                isAdminPage={false}
                handleSubmit={handleSubmit}
              />
            );
          })}
        </Stack>
      </Paper>
    </Modal>
  );
};

export default MakeUserAdminMenu;
