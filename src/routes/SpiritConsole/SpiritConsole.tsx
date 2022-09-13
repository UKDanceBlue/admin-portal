import { Box, Button } from "@mui/material";
import { NavLink } from "react-router-dom";

import { routeDefinitions } from "..";

import SpiritTeamDataGrid from "./SpiritTeamDataGrid";

const SpiritConsole = () => {
  return (
    <Box display="flex" flexDirection="column">
      <h1>Spirit Teams</h1>
      <div style={{ minHeight: "60vh", display: "flex" }}>
        <div style={{ flex: 1, padding: "1em" }}>
          <SpiritTeamDataGrid />
        </div>
      </div>
      <NavLink to={routeDefinitions["spirit-opportunities"].path ?? ""}>
        <Button>
          Manage Spirit Opportunities
        </Button>
      </NavLink>
    </Box>
  );
};

export default SpiritConsole;
