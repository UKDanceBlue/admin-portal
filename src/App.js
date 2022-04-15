import * as React from "react";
import Home from "./routes/Home";
import MarathonConsole from "./routes/MarathonConsole";
import MoraleConsole from "./routes/MoraleConsole";
import SpiritConsole from "./routes/SpiritConsole";
import NotificationConsole from "./routes/NotificationConsole";
import { Route, Routes } from "react-router-dom";
import MenuBar from "./components/MenuBar";
import { Box, Paper } from "@mui/material";

export default function App() {
  return (
    <Box sx={{ alignContent: "center" }}>
      <MenuBar />
      <Paper elevation={3} sx={{ px: "0.5em", mx: "auto", maxWidth: "lg" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="marathon-console" element={<MarathonConsole />} />
          <Route path="morale-console" element={<MoraleConsole />} />
          <Route path="spirit-console" element={<SpiritConsole />} />
          <Route
            path="notification-console"
            element={<NotificationConsole />}
          />
        </Routes>
      </Paper>
    </Box>
  );
}
