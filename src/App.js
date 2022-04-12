import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Home from "./routes/Home";
import MarathonConsole from "./routes/MarathonConsole";
import MoraleConsole from "./routes/MoraleConsole";
import SpiritConsole from "./routes/SpiritConsole";
import NotificationConsole from "./routes/NotificationConsole";
import { Route, Routes } from "react-router-dom";
import MenuBar from "./components/MenuBar";

export default function App() {
  return (
    <Container sx={{ width: "100%" }}>
      <MenuBar />
      <Typography variant="h4" component="h1" gutterBottom>
        Create React App example
      </Typography>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="marathon-console" element={<MarathonConsole />} />
        <Route path="morale-console" element={<MoraleConsole />} />
        <Route path="spirit-console" element={<SpiritConsole />} />
        <Route path="notification-console" element={<NotificationConsole />} />
      </Routes>
    </Container>
  );
}
