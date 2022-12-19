import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import moment from 'moment';

const BorrowedCard = ({ borrowed, isAdminPage, ...props }) => {
  const [color, setColor] = useState('#f1f1f1');
  const [daysLeft] = useState(moment(borrowed.borrowedLastDate).diff(moment(), 'days') + 1);

  useEffect(() => {
    if (borrowed.borrowedReturned) setColor('#30bf56');
    else if (daysLeft <= 3 && daysLeft > 0) setColor('#d49426');
    else if (daysLeft <= 0) setColor('#cc4233');
  }, []);

  return (
    <Paper
      elevation={4}
      sx={{ width: '100%', height: 'auto', m: 0.4, px: 1, pt: 1, alignItems: 'center' }}
    >
      <Grid container spacing={1}>
        <Grid item xs={3} sx={{ p: 1 }}>
          <Typography variant='body2' sx={{ fontSize: 12 }}>
            {borrowed.userName}
          </Typography>
          <Typography variant='body2' sx={{ fontSize: 12 }}>
            {borrowed.userEmail}
          </Typography>
          <Typography variant='body2' sx={{ fontSize: 9, color: 'gray' }}>
            {isAdminPage ? borrowed.userId : null}
          </Typography>
        </Grid>
        <Grid item xs={3} sx={{ p: 1 }}>
          <Typography variant='body2' sx={{ fontSize: 12 }}>
            {borrowed.bookName}
          </Typography>
          <Typography variant='body2' sx={{ fontSize: 12 }}>
            {borrowed.bookAuthorName} - {borrowed.bookYear}
          </Typography>
          <Typography variant='body2' sx={{ fontSize: 9, color: 'gray' }}>
            {isAdminPage ? borrowed.bookId : null}
          </Typography>
        </Grid>
        <Grid item xs={3} sx={{ p: 1 }}>
          <Typography variant='body2' sx={{ fontSize: 12 }}>
            {borrowed.libraryName}
          </Typography>
          <Typography variant='body2' sx={{ fontSize: 12 }}>
            {borrowed.libraryAddress}
          </Typography>
          <Typography variant='body2' sx={{ fontSize: 9, color: 'gray' }}>
            {isAdminPage ? borrowed.libraryId : null}
          </Typography>
        </Grid>
        <Grid item xs={3} sx={{ p: 1 }} backgroundColor={color}>
          <Typography variant='body2' sx={{ fontSize: 12 }}>
            Should be returned on {moment(borrowed.borrowedLastDate).format('DD.MM.YYYY')}
          </Typography>
          <Typography variant='body2' sx={{ fontSize: 12 }}>
            {borrowed.borrowedReturned ? 'Returned' : 'Not returned --- days left: ' + daysLeft}
          </Typography>
          <Typography variant='body2' sx={{ fontSize: 9, color: 'gray' }}>
            {isAdminPage ? borrowed.borrowedId : null}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default BorrowedCard;
