import { Button, Paper, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { DateTimePicker } from "@mui/x-date-pickers";
import { Timestamp, collection, doc, setDoc } from "firebase/firestore";
import { DateTime } from "luxon";
import { useReducer } from "react";
import { useFirestore } from "reactfire";
import { v4 as uuidV4 } from "uuid";

import { useLoading } from "../../../components/LoadingWrapper";
import type { FirestoreOpportunityInfo } from "../../../firebase/types/FirestoreSpiritOpportunityInfo";

import OpportunityDataGrid from "./OpportunityDataGrid";

const OpportunityConsole = () => {
  const [ isLoading, setIsLoading ] = useLoading();
  const [ newEntry, updateNewEntry ] = useReducer((state: Omit<FirestoreOpportunityInfo, "totalPoints"> & {totalPoints?: number}, newState: Partial<Omit<FirestoreOpportunityInfo, "totalPoints"> & {totalPoints?: number}>) => ({ ...state, ...newState }), {
    name: "",
    date: Timestamp.now(),
  });

  const firestore = useFirestore();

  return (
    <div>
      <h1>Spirit Opportunities</h1>
      <div style={{ minHeight: "60vh", display: "flex" }}>
        <div style={{ flex: 1, padding: "1em" }}>
          <OpportunityDataGrid />
        </div>
      </div>
      <Box sx={{ flex: 1, flexDirection: "column", mx: "1em" }}>
        <Paper sx={{ px: "1em", pb: "1em", pt: "0.25em" }} elevation={4}>
          <h3>Add New</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();

              if (!(newEntry.name && newEntry.date)) {
                alert("Please fill out all fields (name and date).");
                return;
              }

              setIsLoading(true);
              const newDocument = doc(collection(firestore, "spirit/opportunities/documents"), uuidV4());
              setDoc(newDocument, { name: newEntry.name, date: newEntry.date }).then(() => {
                setIsLoading(false);

                updateNewEntry({
                  name: "",
                  date: Timestamp.now(),
                  totalPoints: undefined,
                });
              }).catch((e) => {
                setIsLoading(false);
                alert(e);
              });
            }}
          >
            <TextField
              fullWidth
              label="Name"
              sx={{ marginBottom: "1em" }}
              value={newEntry.name}
              onChange={(e) => updateNewEntry({ name: e.target.value })}
              disabled={isLoading}
              required
            />
            <DateTimePicker
              label="Date (for sorting in the list)"
              value={DateTime.fromJSDate(newEntry.date.toDate())}
              onChange={(newValue) => updateNewEntry({ date: newValue == null ? undefined : Timestamp.fromDate(newValue.toJSDate()) })}
              renderInput={(params) => <TextField fullWidth sx={{ marginBottom: "1em" }} required {...params} />}
              disabled={isLoading}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}>
              Create
            </Button>
          </form>
        </Paper>
      </Box>
    </div>
  );
};

export default OpportunityConsole;
