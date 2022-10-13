import { Box, Button } from "@mui/material";
import { NavLink } from "react-router-dom";

import { routeDefinitions } from "..";

import SpiritTeamList from "./SpiritTeamList";

const SpiritConsole = () => {
  return (
    <Box display="flex" flexDirection="column">
      <SpiritTeamList />
      <NavLink to={routeDefinitions["spirit-opportunities"].path ?? ""}>
        <Button>
          Manage Spirit Opportunities
        </Button>
      </NavLink>
    </Box>
  );
};

export default SpiritConsole;
