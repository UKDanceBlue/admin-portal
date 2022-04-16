import React, { useEffect, useState } from "react";
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
import { auth, functions } from "../firebase/firebaseApp";
import { useSignInWithUkMicrosoft } from "../customHooks";
import { getAdditionalUserInfo, signOut } from "firebase/auth";
import { httpsCallable } from "firebase/functions";

const navLinks = [
  {
    title: "Home",
    path: "/",
  },
  {
    title: "Marathon Manager",
    path: "/marathon-console",
    requiredClaims: [
      { claimKey: "dbRole", claimValues: ["committee"] },
      { claimKey: "committee", claimValues: ["tech-committee"] },
    ],
  },
  {
    title: "Spirit Point Manager",
    path: "/spirit-console",
    requiredClaims: [
      { claimKey: "dbRole", claimValues: ["committee"] },
      { claimKey: "committee", claimValues: ["tech-committee"] },
    ],
  },
  {
    title: "Morale Point Manager",
    path: "/morale-console",
    requiredClaims: [
      { claimKey: "dbRole", claimValues: ["committee"] },
      { claimKey: "committee", claimValues: ["tech-committee"] },
    ],
  },
  {
    title: "Notification Manager",
    path: "/notification-console",
    requiredClaims: [
      { claimKey: "dbRole", claimValues: ["committee"] },
      { claimKey: "committee", claimValues: ["tech-committee"] },
    ],
  },
];

const MenuBar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [authClaims, setAuthClaims] = useState({});

  const navigate = useNavigate();

  const [user] = useAuthState(auth);
  const [triggerLogin, userCredential] = useSignInWithUkMicrosoft(auth);

  useEffect(() => {
    (async () => {
      if (userCredential) {
        // If there is a userCredential, then the user has just signed in and may need claims updated
        await httpsCallable(functions, "updateUserClaims")("");
        const idToken = await userCredential.user.getIdTokenResult(true);
        setAuthClaims(idToken.claims);
      }
    })();
  }, [userCredential]);

  useEffect(() => {
    (async () => {
      if (user) {
        const idToken = await user.getIdTokenResult();
        setAuthClaims(idToken.claims);
      } else {
        setAuthClaims({ dbRole: ["public"] });
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
            {navLinks
              .filter((page) => {
                if (page.requiredClaims) {
                  return page.requiredClaims.every((claim) => {
                    return authClaims[claim.claimKey]?.includes(
                      claim.claimValues
                    );
                  });
                } else {
                  return true;
                }
              })
              .map((page) => (
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
          {navLinks
            .filter((page) => {
              if (page.requiredClaims) {
                return page.requiredClaims.every((claim) =>
                  claim.claimValues.includes(authClaims[claim.claimKey])
                );
              } else {
                return true;
              }
            })
            .map((page) => (
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
