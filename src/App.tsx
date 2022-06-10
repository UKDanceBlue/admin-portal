import { Box, Paper } from "@mui/material";
import { Route, Routes } from "react-router-dom";

import MenuBar from "./components/MenuBar";
import SecuredParent from "./components/SecuredParent";
import routeList from "./routes";

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
          {routeList.map((route, index) => (
            <Route
              key={index}
              path={route.pathFragment}
              element={
                route.signInRequired ? (
                  <SecuredParent requiredClaims={route.requiredClaims}>
                    {route.element}
                  </SecuredParent>
                ) : (
                  route.element
                )
              }
            />
          ))}
        </Routes>
      </Paper>
    </Box>
  );
}
