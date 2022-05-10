import { Box, Paper } from "@mui/material";
import { Route, Routes } from "react-router-dom";

import MenuBar from "./components/MenuBar";
import SecuredParent from "./components/SecuredParent";
import Home from "./routes/Home";
import MarathonConsole from "./routes/MarathonConsole";
import MoraleConsole from "./routes/MoraleConsole";
import NotificationConsole from "./routes/NotificationConsole";
import SpiritConsole from "./routes/SpiritConsole";



/**
 * Core application component, mounted by index.tsx to the root div.
 *
 * @return {JSX.Element} The main App component
 */
export default function App() {
  return (
    <Box sx={{ alignContent: "center" }}>
      <MenuBar />
      <Paper elevation={3} sx={{ px: "0.5em", mx: "auto", maxWidth: "lg" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="marathon-console"
            element={
              <SecuredParent
                requiredClaims={[
                  { claimKey: "dbRole", claimValues: ["committee"] },
                  {
                    claimKey: "committeeRank",
                    claimValues: ["coordinator", "chair"],
                  },
                ]}
              >
                <MarathonConsole />
              </SecuredParent>
            }
          />
          <Route
            path="morale-console"
            element={
              <SecuredParent
                requiredClaims={[
                  { claimKey: "dbRole", claimValues: ["committee"] },
                  {
                    claimKey: "committeeRank",
                    claimValues: ["coordinator", "chair"],
                  },
                ]}
              >
                <MoraleConsole />
              </SecuredParent>
            }
          />
          <Route
            path="spirit-console"
            element={
              <SecuredParent
                requiredClaims={[
                  { claimKey: "dbRole", claimValues: ["committee"] },
                  {
                    claimKey: "committeeRank",
                    claimValues: ["coordinator", "chair"],
                  },
                ]}
              >
                <SpiritConsole />
              </SecuredParent>
            }
          />
          <Route
            path="notification-console"
            element={
              <SecuredParent
                requiredClaims={[
                  { claimKey: "dbRole", claimValues: ["committee"] },
                  {
                    claimKey: "committeeRank",
                    claimValues: ["coordinator", "chair"],
                  },
                ]}
              >
                <NotificationConsole />
              </SecuredParent>
            }
          />
        </Routes>
      </Paper>
    </Box>
  );
}
