import MenuIcon from "@mui/icons-material/Menu";
import { Drawer } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { IdTokenResult, signOut } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useFunctions } from "reactfire";

import { signInWithLinkblue } from "../firebase/linkblue";
import routeList from "../routes";

import { useLoading } from "./LoadingWrapper";

const MenuBar = () => {
  const navigate = useNavigate();

  const auth = useAuth();
  const functions = useFunctions();

  const [ menuOpen, setMenuOpen ] = useState(false);

  const [ authClaims, setAuthClaims ] = useState<IdTokenResult | null>(null);
  const [ user, setUser ] = useState<typeof auth["currentUser"] | null>(null);

  const [ loading, setLoading ] = useLoading();

  const triggerLogin = useCallback(async () => {
    setLoading(true);
    await signInWithLinkblue(auth, functions);
    setLoading(false);
  }, [
    auth, functions, setLoading
  ]);

  useEffect(() => auth.onAuthStateChanged((user) => {
    if (user) {
      user.getIdTokenResult().then(setAuthClaims);
      setUser(user);
    } else {
      setAuthClaims(null);
      setUser(null);
    }
  }
  ), [auth]);

  const pages = routeList
    .filter((page) => {
      if (!(page.showInMenu ?? false)) {
        return false;
      }

      // Are there any auth requirements?
      if (page.requiredClaims != null) {
      // If so, does the user have any claims set, if not just return false
        if (authClaims == null) {
          return false;
        }

        // Check if the user has all the required claims
        if (page.requiredClaims.every((claim) => {
          const userClaimValue = authClaims.claims[claim.claimKey];
          if (typeof userClaimValue === "string") {
            return claim.claimValues.includes(userClaimValue);
          } else {
            return false;
          }
        }) === false) {
          return false;
        }
      }

      // If everything checks out, return true
      return true;
    });

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
            ModalProps={{ keepMounted: true }}
            anchor="left"
            open={Boolean(menuOpen)}
            onClose={() => {
              setMenuOpen(false);
            }}
          >
            {pages.map((page) => (
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
          {pages.map((page) => (
            <MenuItem key={page.path} onClick={() => navigate(page.path)}>
              <Typography textAlign="center">{page.title}</Typography>
            </MenuItem>
          ))}
        </Box>
        {(!user || user.isAnonymous) && (
          <Box>
            <MenuItem onClick={triggerLogin} disabled={loading}>
              <Typography textAlign="center">Login</Typography>
            </MenuItem>
          </Box>
        )}
        {user && !user.isAnonymous && (
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
