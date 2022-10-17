import { Button } from "@mui/material";
import { doc, setDoc } from "firebase/firestore";
import { useFirestore } from "reactfire";
import { v4 } from "uuid";

import SpiritTeamDataGrid from "./SpiritTeamDataGrid";

const SpiritTeamList = () => {
  const firestore = useFirestore();

  return (
    <>
      <h1>Spirit Teams</h1>
      <p>
        You can hover over a column&apos;s header and click the ... button to show sorting and filtering options. Be warned that sorting by a field will HIDE any teams that have no value for that field (same for all other tables).
      </p>
      <div style={{ minHeight: "60vh", display: "flex" }}>
        <div style={{ flex: 1, padding: "1em" }}>
          <SpiritTeamDataGrid />
        </div>
      </div>
      {/** Create a new team */}
      <Button
        onClick={() => {
          const name = prompt("Enter a name");
          if (name) {
            setDoc(doc(firestore, `/spirit/teams/documents/${v4()}`), { name });
          }
        }}
      >
            Create a new team
      </Button>
    </>
  );
};
export default SpiritTeamList;
