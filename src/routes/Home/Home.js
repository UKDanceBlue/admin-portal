import { Box, Typography } from "@mui/material";
import React from "react";

const Home = () => {
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Typography variant="h3" component="h1">
          Welcome to the DanceBlue online portal!
        </Typography>
      </Box>
      <br />
      <Typography variant="body1" component="b">
        If you do not recognize this page, you may be looking for the{" "}
      </Typography>
      <a href="https://www.danceblue.org">DanceBlue website</a>
      <Typography variant="body1" component="b">
        {" "}
        instead. This page is used for online access and entry to the DanceBlue
        database.
      </Typography>
    </Box>
  );
};

export default Home;
