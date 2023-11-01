import { Box, Paper } from "@mui/material";
import { Route, Routes } from "react-router-dom";

import ErrorBoundary from "./components/ErrorBoundary";
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
      <ErrorBoundary>
        <Paper elevation={3} sx={{ px: "0.5em", py: "5vh", mx: "auto", maxWidth: "xl" }}>
          <Routes>
            <Route
              path={routeDefinitions["/"].pathFragment}
              element={routeDefinitions["/"].element}
            />
            <Route
              path={routeDefinitions["spirit-teams"].pathFragment}
              element={
                <SecuredParent requiredClaims={routeDefinitions["spirit-teams"].requiredClaims}>
                  {routeDefinitions["spirit-teams"].element}
                </SecuredParent>
              }
            />
            <Route
              path={routeDefinitions["spirit-opportunities"].pathFragment}
              element={
                <SecuredParent
                  requiredClaims={routeDefinitions["spirit-opportunities"].requiredClaims}
                >
                  {routeDefinitions["spirit-opportunities"].element}
                </SecuredParent>
              }
            />
            <Route
              path={routeDefinitions["spirit-points"].pathFragment}
              element={
                <SecuredParent requiredClaims={routeDefinitions["spirit-points"].requiredClaims}>
                  {routeDefinitions["spirit-points"].element}
                </SecuredParent>
              }
            />
            <Route
              path={routeDefinitions["notification-console"].pathFragment}
              element={
                <SecuredParent
                  requiredClaims={routeDefinitions["notification-console"].requiredClaims}
                >
                  {routeDefinitions["notification-console"].element}
                </SecuredParent>
              }
            />
          </Routes>
        </Paper>
      </ErrorBoundary>
    </Box>
  );
}
