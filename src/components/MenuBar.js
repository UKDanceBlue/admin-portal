import * as React from "react";
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
import { Image } from "@mui/icons-material";

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

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters variant="dense">
          <Container>
            <img
              style={{ height: "4em" }}
              alt="DanceBlue Logo"
              src="https://www.danceblue.org/wp-content/uploads/2018/04/DB-Web-Logo-Final-03.svg"
              srcSet="https://www.danceblue.org/wp-content/uploads/2018/04/DB-Web-Logo-Final-03.svg 1x"
            />
          </Container>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              onClick={handleOpenNavMenu}
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
              onClose={handleCloseNavMenu}
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
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {navLinks.map((page) => (
              <MenuItem key={page.path} onClick={() => navigate(page.path)}>
                <Typography textAlign="center">{page.title}</Typography>
              </MenuItem>
            ))}
          </Box>
          {(!user || user.isAnonymous) && (
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <MenuItem onClick={triggerLogin}>
                <Typography textAlign="center">Login</Typography>
              </MenuItem>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default MenuBar;
