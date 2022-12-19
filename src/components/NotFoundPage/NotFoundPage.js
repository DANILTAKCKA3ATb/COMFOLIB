import { Container, Paper } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Container component='main' maxWidth='xs'>
      <Paper sx={{ mt: 8, p: 3 }}>
        404 Page not found. <Link to='/login'> Maybe you want to Sign in? </Link>
      </Paper>
    </Container>
  );
};

export default NotFoundPage;
