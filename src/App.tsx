import Home from "./routes/Home";
import MarathonConsole from "./routes/MarathonConsole";
import MoraleConsole from "./routes/MoraleConsole";
import SpiritConsole from "./routes/SpiritConsole";
import NotificationConsole from "./routes/NotificationConsole";
import { Route, Routes } from "react-router-dom";
import MenuBar from "./components/MenuBar";
import { Box, Paper } from "@mui/material";
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
      <Paper elevation={3} sx={{ px: "0.5em", mx: "auto", maxWidth: "lg" }}>
        <Routes>
          {routeList.map((route, index) => (
            <Route
              key={index}
              path={route.pathFragment}
              element={
                <SecuredParent requiredClaims={route.requiredClaims}>{route.element}</SecuredParent>
              }
            />
          ))}
        </Routes>
      </Paper>
    </Box>
  );
}
