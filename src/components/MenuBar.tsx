import MenuIcon from "@mui/icons-material/Menu";
import { Drawer } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { IdTokenResult, signOut } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useFunctions, useUser } from "reactfire";

import { signInWithLinkblue } from "../firebase/linkblue";
import routeList from "../routes";

const MenuBar = () => {
  const navigate = useNavigate();

  const auth = useAuth();
  const functions = useFunctions();

  const [menuOpen, setMenuOpen] = useState(false);

  const user = useUser();
  const [authClaims, setAuthClaims] = useState<IdTokenResult | null>(null);

  const triggerLogin = useCallback(async () => {
    const userCredential = await signInWithLinkblue(auth);

    const updateUserClaims = httpsCallable(functions, "updateUserClaims");
    if (updateUserClaims) {
      await updateUserClaims("");
      // Calling getIdTokenResult(true) forces the client to get a new token, updating useIdTokenResult
      userCredential.user.getIdTokenResult(true);
    }
  }, [auth, functions]);

  useEffect(
    () =>
      void (async () => {
        if (user.data) {
          setAuthClaims(await user.data.getIdTokenResult());
        } else {
          setAuthClaims(null);
        }
      })(),
    [user]
  );

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
                if (!authClaims) {
                  return false;
                }
                return page.requiredClaims.every((claim) => {
                  const userClaimValue = authClaims.claims[claim.claimKey];
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
              if (!authClaims) {
                return false;
              }
              return page.requiredClaims.every((claim) => {
                const userClaimValue = authClaims.claims[claim.claimKey];
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
            <MenuItem onClick={triggerLogin}>
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
