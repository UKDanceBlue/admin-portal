import { Box, Button } from "@mui/material";
import { doc, setDoc } from "firebase/firestore";
import { NavLink } from "react-router-dom";
import { useFirestore } from "reactfire";
import { v4 } from "uuid";

import { routeDefinitions } from "..";

import SpiritTeamDataGrid from "./SpiritTeamDataGrid";

const SpiritConsole = () => {
  const firestore = useFirestore();
  return (
    <Box display="flex" flexDirection="column">
      <h1>Spirit Teams</h1>
      <div style={{ minHeight: "60vh", display: "flex" }}>
        <div style={{ flex: 1, padding: "1em" }}>
          <SpiritTeamDataGrid />
        </div>
      </div>
      {/** Create a new team */}
      <Button
        onClick={() => {
          setDoc(doc(firestore, `/spirit/teams/documents/${v4()}`), { name: prompt("Enter a name") });
        }}
      >
            Create a new team
      </Button>
      <NavLink to={routeDefinitions["spirit-opportunities"].path ?? ""}>
        <Button>
          Manage Spirit Opportunities
        </Button>
      </NavLink>
    </Box>
  );
};

export default SpiritConsole;
