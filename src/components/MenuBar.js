import React, { useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebaseApp";
import { useSignInWithUkMicrosoft } from "../customHooks";
import { signOut } from "firebase/auth";

const navLinks = [
  { title: "Home", path: "/" },
  { title: "Marathon Manager", path: "/marathon-console" },
  { title: "Spirit Point Manager", path: "/spirit-console" },
  { title: "Morale Point Manager", path: "/morale-console" },
  {
    title: "Notification Manager",
    path: "/notification-console",
  },
];

const MenuBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const navigate = useNavigate();

  const [user] = useAuthState(auth);
  const [triggerLogin] = useSignInWithUkMicrosoft(auth);

  useEffect(() => {
    (async () => {
      if (user) {
        const idToken = await user.getIdTokenResult();
        console.log(idToken);
      }
    })();
  }, [user]);

  return (
    <AppBar position="sticky">
      <Toolbar disableGutters variant="dense">
        <img
          style={{ padding: "0.5em" }}
          alt="DanceBlue Logo"
          src="https://www.danceblue.org/wp-content/uploads/2018/04/DB-Web-Logo-Final-03.svg"
          srcSet="https://www.danceblue.org/wp-content/uploads/2018/04/DB-Web-Logo-Final-03.svg 1x"
        />
        <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
          <IconButton
            size="large"
            onClick={(event) => {
              setAnchorElNav(event.currentTarget);
            }}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(anchorElNav)}
            onClose={() => {
              setAnchorElNav(null);
            }}
            sx={{
              display: { xs: "block", md: "none" },
            }}
          >
            {navLinks.map((page) => (
              <MenuItem key={page.path} onClick={() => navigate(page.path)}>
                <Typography textAlign="center">{page.title}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            display: { xs: "none", md: "flex" },
          }}
        >
          {navLinks.map((page) => (
            <MenuItem key={page.path} onClick={() => navigate(page.path)}>
              <Typography textAlign="center">{page.title}</Typography>
            </MenuItem>
          ))}
        </Box>
        {(!user || user.isAnonymous) && (
          <Box>
            <MenuItem onClick={triggerLogin}>
              <Typography textAlign="center">Login</Typography>
            </MenuItem>
          </Box>
        )}
        {user && !user.isAnonymous && (
          <Box>
            <MenuItem onClick={() => signOut(auth)}>
              <Typography textAlign="center">Log Out</Typography>
            </MenuItem>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};
export default MenuBar;
