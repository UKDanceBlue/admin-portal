"use strict";
exports.__esModule = true;
var react_1 = require("react");
var AppBar_1 = require("@mui/material/AppBar");
var Box_1 = require("@mui/material/Box");
var Toolbar_1 = require("@mui/material/Toolbar");
var IconButton_1 = require("@mui/material/IconButton");
var Typography_1 = require("@mui/material/Typography");
var Menu_1 = require("@mui/icons-material/Menu");
var MenuItem_1 = require("@mui/material/MenuItem");
var react_router_dom_1 = require("react-router-dom");
var auth_1 = require("react-firebase-hooks/auth");
var firebaseApp_1 = require("../firebase/firebaseApp");
var customHooks_1 = require("../customHooks");
var auth_2 = require("firebase/auth");
var functions_1 = require("firebase/functions");
var material_1 = require("@mui/material");
var navLinks = [
    {
        title: "Home",
        path: "/"
    },
    {
        title: "Marathon Manager",
        path: "/marathon-console",
        requiredClaims: [
            { claimKey: "dbRole", claimValues: ["committee"] },
            { claimKey: "committeeRank", claimValues: ["coordinator", "chair"] },
        ]
    },
    {
        title: "Spirit Point Manager",
        path: "/spirit-console",
        requiredClaims: [
            { claimKey: "dbRole", claimValues: ["committee"] },
            { claimKey: "committeeRank", claimValues: ["coordinator", "chair"] },
        ]
    },
    {
        title: "Morale Point Manager",
        path: "/morale-console",
        requiredClaims: [
            { claimKey: "dbRole", claimValues: ["committee"] },
            { claimKey: "committeeRank", claimValues: ["coordinator", "chair"] },
        ]
    },
    {
        title: "Notification Manager",
        path: "/notification-console",
        requiredClaims: [
            { claimKey: "dbRole", claimValues: ["committee"] },
            { claimKey: "committeeRank", claimValues: ["coordinator", "chair"] },
        ]
    },
];
var MenuBar = function () {
    var _a = (0, react_1.useState)(false), menuOpen = _a[0], setMenuOpen = _a[1];
    var authClaims = (0, customHooks_1.useAuthClaims)(firebaseApp_1.auth);
    var navigate = (0, react_router_dom_1.useNavigate)();
    var user = (0, auth_1.useAuthState)(firebaseApp_1.auth)[0];
    var _b = (0, customHooks_1.useSignInWithUkMicrosoft)(firebaseApp_1.auth), triggerLogin = _b[0], userCredential = _b[1];
    (0, react_1.useEffect)(function () {
        if (userCredential) {
            // If there is a userCredential, then the user has just signed in and may need claims updated
            // Calling getIdTokenResult forces the client to get a new token, updating useAuthClaims
            (0, functions_1.httpsCallable)(firebaseApp_1.functions, "updateUserClaims")("").then(userCredential.user.getIdTokenResult(true));
        }
    }, [userCredential]);
    return (<AppBar_1["default"] position="sticky">
      <Toolbar_1["default"] disableGutters variant="dense" sx={{ display: "flex" }}>
        <img style={{
            padding: "0.5em",
            height: "5em",
            width: "5em"
        }} alt="DanceBlue Logo" src="/db_app_portal_logo.png"/>
        <Box_1["default"] sx={{ flex: 9, display: { xs: "flex", md: "none" } }}>
          <IconButton_1["default"] size="large" onClick={function () {
            setMenuOpen(true);
        }} color="inherit">
            <Menu_1["default"] />
          </IconButton_1["default"]>
          <material_1.Drawer variant="temporary" ModalProps={{
            keepMounted: true
        }} anchor="left" open={Boolean(menuOpen)} onClose={function () {
            setMenuOpen(false);
        }}>
            {navLinks
            .filter(function (page) {
            if (!page.requiredClaims) {
                return true;
            }
            if (!authClaims) {
                return false;
            }
            return page.requiredClaims.every(function (claim) {
                return claim.claimValues.includes(authClaims[claim.claimKey]);
            });
        })
            .map(function (page) { return (<MenuItem_1["default"] key={page.path} onClick={function () { return navigate(page.path); }}>
                  <Typography_1["default"] textAlign="center">{page.title}</Typography_1["default"]>
                </MenuItem_1["default"]>); })}
          </material_1.Drawer>
        </Box_1["default"]>
        <Box_1["default"] sx={{
            flex: 9,
            display: { xs: "none", md: "flex" }
        }}>
          {navLinks
            .filter(function (page) {
            if (!page.requiredClaims) {
                return true;
            }
            if (!authClaims) {
                return false;
            }
            return page.requiredClaims.every(function (claim) {
                return claim.claimValues.includes(authClaims[claim.claimKey]);
            });
        })
            .map(function (page) { return (<MenuItem_1["default"] key={page.path} onClick={function () { return navigate(page.path); }}>
                <Typography_1["default"] textAlign="center">{page.title}</Typography_1["default"]>
              </MenuItem_1["default"]>); })}
        </Box_1["default"]>
        {(!user || user.isAnonymous) && (<Box_1["default"]>
            <MenuItem_1["default"] onClick={triggerLogin}>
              <Typography_1["default"] textAlign="center">Login</Typography_1["default"]>
            </MenuItem_1["default"]>
          </Box_1["default"]>)}
        {user && !user.isAnonymous && (<Box_1["default"]>
            <MenuItem_1["default"] onClick={function () { return (0, auth_2.signOut)(firebaseApp_1.auth); }}>
              <Typography_1["default"] textAlign="center">Log Out</Typography_1["default"]>
            </MenuItem_1["default"]>
          </Box_1["default"]>)}
      </Toolbar_1["default"]>
    </AppBar_1["default"]>);
};
exports["default"] = MenuBar;
