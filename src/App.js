import * as React from "react";
import Home from "./routes/Home";
import MarathonConsole from "./routes/MarathonConsole";
import MoraleConsole from "./routes/MoraleConsole";
import SpiritConsole from "./routes/SpiritConsole";
import NotificationConsole from "./routes/NotificationConsole";
import { Route, Routes } from "react-router-dom";
import MenuBar from "./components/MenuBar";
import { Box, Paper } from "@mui/material";
import SecuredParent from "./components/SecuredParent";

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
                  { claimKey: "committee", claimValues: ["tech-committee"] },
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
                  { claimKey: "committee", claimValues: ["tech-committee"] },
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
                  { claimKey: "committee", claimValues: ["tech-committee"] },
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
                  { claimKey: "committee", claimValues: ["tech-committee"] },
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
