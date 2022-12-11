import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "./../../redux/userReducer";
import { logout } from "./../../redux/authReducer";
import { Container, Paper, Avatar, Typography, Button } from "@mui/material";
import { ExitToApp } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ProfilePage = (props) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  });

  React.useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const fullName = currentUser && currentUser.displayName;
  const firstLetterName = fullName ? fullName.charAt(0) : null;
  const email = currentUser && currentUser.email;

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        sx={{
          mt: 8,
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1 }}>{firstLetterName}</Avatar>
        <Typography component="h1" variant="h5">
          {fullName}
        </Typography>
        <Typography color="textSecondary">{email}</Typography>
        <Button
          variant="contained"
          color="secondary"
          sx={{ mt: 4 }}
          startIcon={<ExitToApp />}
          onClick={() => handleLogout()}
        >
          Logout
        </Button>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
