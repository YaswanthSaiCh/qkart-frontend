import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import { Link, useHistory } from "react-router-dom";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();
  const user = localStorage.getItem("username");
  const isLoggedIn = user ? true : false;

  const handleLogout = (event) => {
    localStorage.clear();
    // location.reload();
    history.push("/");
  };

  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>

      {children}

      {!hasHiddenAuthButtons && (
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => history.push("/")}
        >
          Back to explore
        </Button>
      )}
      {hasHiddenAuthButtons && !isLoggedIn && (
        <Stack direction="row">
          <Button variant="text" onClick={() => history.push("/login")}>
            Login
          </Button>
          <Button variant="contained" onClick={() => history.push("/register")}>
            Register
          </Button>
        </Stack>
      )}
      {hasHiddenAuthButtons && isLoggedIn && (
        <Stack direction="row" spacing={2}>
          <Avatar alt={user} src="avatar.png" />
          <p style={{ marginTop: "10px" }}>{user}</p>
          <Button variant="text" onClick={handleLogout}>
            Logout
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default Header;
