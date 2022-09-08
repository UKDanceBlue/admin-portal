import { Box, Paper } from "@mui/material";
import { Route, Routes } from "react-router-dom";

import MenuBar from "./components/MenuBar";
import SecuredParent from "./components/SecuredParent";
import { routeDefinitions } from "./routes";

/**
 * Core application component, mounted by index.tsx to the root div.
 *
 * @return The main App component
 */
export default function App() {
  return (
    <Box sx={{ alignContent: "center" }}>
      <MenuBar />
      <Paper elevation={3} sx={{ px: "0.5em", py: "5vh", mx: "auto", maxWidth: "lg" }}>
        <Routes>
          <Route path={routeDefinitions["/"].pathFragment} element={routeDefinitions["/"].element} />
          <Route path={routeDefinitions["event-manager"].pathFragment} element={
            <SecuredParent requiredClaims={routeDefinitions["event-manager"].requiredClaims}>
              {routeDefinitions["event-manager"].element}
            </SecuredParent>
          } />
          <Route path={routeDefinitions["spirit-points"].pathFragment} element={
            <SecuredParent requiredClaims={routeDefinitions["spirit-points"].requiredClaims}>
              {routeDefinitions["spirit-points"].element}
            </SecuredParent>
          } />
          <Route path={routeDefinitions["spirit-opportunities"].pathFragment} element={
            <SecuredParent requiredClaims={routeDefinitions["spirit-opportunities"].requiredClaims}>
              {routeDefinitions["spirit-opportunities"].element}
            </SecuredParent>
          } />
          <Route path={routeDefinitions["notification-console"].pathFragment} element={
            <SecuredParent requiredClaims={routeDefinitions["notification-console"].requiredClaims}>
              {routeDefinitions["notification-console"].element}
            </SecuredParent>
          } />
        </Routes>
      </Paper>
    </Box>
  );
}
