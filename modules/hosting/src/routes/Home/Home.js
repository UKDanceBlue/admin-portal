"use strict";
exports.__esModule = true;
var material_1 = require("@mui/material");
var Home = function () {
    return (<material_1.Box>
      <material_1.Box sx={{ display: "flex", justifyContent: "center" }}>
        <material_1.Typography variant="h3" component="h1">
          Welcome to the DanceBlue online portal!
        </material_1.Typography>
      </material_1.Box>
      <br />
      <material_1.Typography variant="body1" component="b">
        If you do not recognize this page, you may be looking for the{" "}
      </material_1.Typography>
      <a href="https://www.danceblue.org">DanceBlue website</a>
      <material_1.Typography variant="body1" component="b">
        {" "}
        instead. This page is used for online access and entry to the DanceBlue
        database.
      </material_1.Typography>
    </material_1.Box>);
};
exports["default"] = Home;
