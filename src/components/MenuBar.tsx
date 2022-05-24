import MenuIcon from "@mui/icons-material/Menu";
import { Drawer } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { OAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useFunctions, useIdTokenResult, useUser } from "reactfire";

import routeList from "../routes";

const MenuBar = () => {
  const navigate = useNavigate();

  const auth = useAuth();
  const functions = useFunctions();

  const [menuOpen, setMenuOpen] = useState(false);

  const user = useUser();
  const authClaims = useIdTokenResult(user.data);

  const triggerLogin = useCallback(async () => {
    const linkblueAuthProvider = new OAuthProvider("microsoft.com");

    linkblueAuthProvider.setCustomParameters({
      tenant: "2b30530b-69b6-4457-b818-481cb53d42ae",
      domain_hint: "uky.edu",
    });

    linkblueAuthProvider.addScope("openid");
    linkblueAuthProvider.addScope("profile");
    linkblueAuthProvider.addScope("email");
    linkblueAuthProvider.addScope("offline_access");
    linkblueAuthProvider.addScope("User.Read");

    const userCredential = await signInWithPopup(auth, linkblueAuthProvider);
    // If there is a userCredential, then the user has just signed in and may need claims updated
    // Calling getIdTokenResult forces the client to get a new token, updating useIdTokenResult
    const updateUserClaims = httpsCallable(functions, "updateUserClaims");

    if (updateUserClaims) {
      await updateUserClaims("");
      userCredential.user.getIdTokenResult(true);
    }
  }, []);

  return (
    <AppBar position="sticky">
      <Toolbar disableGutters variant="dense" sx={{ display: "flex" }}>
        <img
          style={{
            padding: "0.5em",
            height: "5em",
            width: "5em",
          }}
          alt="DanceBlue Logo"
          src="/db_app_portal_logo.png"
        />
        <Box sx={{ flex: 9, display: { xs: "flex", md: "none" } }}>
          <IconButton
            size="large"
            onClick={() => {
              setMenuOpen(true);
            }}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            variant="temporary"
            ModalProps={{
              keepMounted: true,
            }}
            anchor="left"
            open={Boolean(menuOpen)}
            onClose={() => {
              setMenuOpen(false);
            }}
          >
            {routeList
              .filter((page) => {
                if (!page.requiredClaims) {
                  return true;
                }
                if (authClaims.status !== "success") {
                  return false;
                }
                return page.requiredClaims.every((claim) => {
                  const userClaimValue = authClaims.data.claims[claim.claimKey];
                  if (typeof userClaimValue === "string") {
                    return claim.claimValues.includes(userClaimValue);
                  } else {
                    return false;
                  }
                });
              })
              .map((page) => (
                <MenuItem key={page.path} onClick={() => navigate(page.path)}>
                  <Typography textAlign="center">{page.title}</Typography>
                </MenuItem>
              ))}
          </Drawer>
        </Box>
        <Box
          sx={{
            flex: 9,
            display: { xs: "none", md: "flex" },
          }}
        >
          {routeList
            .filter((page) => {
              if (!page.requiredClaims) {
                return true;
              }
              if (authClaims.status !== "success") {
                return false;
              }
              return page.requiredClaims.every((claim) => {
                const userClaimValue = authClaims.data.claims[claim.claimKey];
                if (typeof userClaimValue === "string") {
                  return claim.claimValues.includes(userClaimValue);
                } else {
                  return false;
                }
              });
            })
            .map((page) => (
              <MenuItem key={page.path} onClick={() => navigate(page.path)}>
                <Typography textAlign="center">{page.title}</Typography>
              </MenuItem>
            ))}
        </Box>
        {(!user.data || user.data.isAnonymous) && (
          <Box>
            <MenuItem onClick={() => triggerLogin}>
              <Typography textAlign="center">Login</Typography>
            </MenuItem>
          </Box>
        )}
        {user.data && !user.data.isAnonymous && (
          <Box>
            <MenuItem
              onClick={() => {
                void signOut(auth);
              }}
            >
              <Typography textAlign="center">Log Out</Typography>
            </MenuItem>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};
export default MenuBar;
