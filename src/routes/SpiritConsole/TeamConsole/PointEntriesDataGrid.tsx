import { Delete } from "@mui/icons-material";
import { Button, IconButton, Paper, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { DocumentData, DocumentReference, Timestamp, collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import { useFirestore, useFirestoreDocOnce } from "reactfire";
import { v4 as uuidV4 } from "uuid";

import FirestoreCollectionDataGrid from "../../../components/FirestoreCollectionDataGrid";
import { useLoading } from "../../../components/LoadingWrapper";

interface PointEntry {
  displayName: string;
  linkblue: string;
  opportunityId: string;
  teamId: string;
  points: number;
}

const PointEntriesDataGrid = () => {
  const { teamId } = useParams<{teamId: string}>();

  const firestore = useFirestore();

  interface RootOpportunitiesDoc extends DocumentData{
    basicInfo: {
      [id: string]: {
        name: string;
        date: Timestamp;
      };
    };
  }

  const {
    data: opportunitiesBasicInfo, error: opportunitiesBasicInfoError, isComplete: opportunitiesBasicInfoIsComplete
  } = useFirestoreDocOnce<RootOpportunitiesDoc>(doc(firestore, "spirit/opportunities") as DocumentReference<RootOpportunitiesDoc>);
  const [ , setIsLoading ] = useLoading();

  const [ newEntry, updateNewEntry ] = useReducer((state: Partial<PointEntry>, newState: Partial<PointEntry>) => ({ ...state, ...newState }), {});

  const entiresCollectionRef = collection(firestore, `/spirit/teams/documents/${teamId}/pointEntries`);

  useEffect(() => {
    if (opportunitiesBasicInfoError) {
      console.error(opportunitiesBasicInfoError);
    }
  }, [opportunitiesBasicInfoError]);

  return (
    <Box sx={{ display: "flex", flexDirection: "row", gap: "1em" }}>
      <Box sx={{ flex: 5, flexDirection: "column" }}>
        <Box sx={{ height: "60vh", padding: "1em" }}>
          <FirestoreCollectionDataGrid
            columns={[
              {
                field: "id",
                headerName: "Entry Id",
                flex: 1.5,
              },
              {
                field: "displayName",
                headerName: "Name",
                flex: 2.5,
              },
              {
                field: "linkblue",
                headerName: "Date (for sorting)",
                flex: 2.5,
                type: "linkblue",
              },
              {
                headerName: "Total Points",
                flex: 1,
                field: "points",
              },
              {
                headerName: "Opportunity",
                flex: 1,
                field: "opportunityId",
              },
              {
                field: "actions",
                headerName: "Actions",
                flex: 1,
                type: "actions",
                getActions: (rowData) => [
                  <IconButton key={rowData.row.id} onClick={() => deleteDoc(doc(entiresCollectionRef, rowData.row.id)).catch(alert)}>
                    <Delete />
                  </IconButton>
                ]
              }
            ]}
            firestoreCollectionRef={entiresCollectionRef}
            defaultSortField="linkblue"
          />
        </Box>
      </Box>
      <Box sx={{ flex: 1, flexDirection: "column", mr: "1em" }}>
        <Paper sx={{ padding: "1em" }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsLoading(true);
              const newDocument = doc(entiresCollectionRef, uuidV4());
              setDoc(newDocument, { ...newEntry, teamId }).then(() => {
                setIsLoading(false);

                updateNewEntry({
                  displayName: undefined,
                  linkblue: undefined,
                  opportunityId: undefined,
                  points: undefined,
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
              value={newEntry.displayName ?? ""}
              onChange={(e) => updateNewEntry({ displayName: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Linkblue"
              sx={{ marginBottom: "1em" }}
              value={newEntry.linkblue ?? ""}
              onChange={(e) => updateNewEntry({ linkblue: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Opportunity"
              sx={{ marginBottom: "1em" }}
              value={newEntry.opportunityId ?? ""}
              onChange={(e) => updateNewEntry({ opportunityId: e.target.value })}
              select
              SelectProps={{ native: true }}
              disabled={!opportunitiesBasicInfoIsComplete}
              required
            >
              <option value="" />
              {opportunitiesBasicInfoIsComplete && (
                Object.entries(opportunitiesBasicInfo.data()?.basicInfo ?? {})
                  .sort((a, b) => a[1].date.toMillis() - b[1].date.toMillis())
                  .map(
                    ([ id, { name } ]) => (
                      <option key={id} value={id}>{name}</option>
                    )
                  )
              )}
            </TextField>
            <TextField
              fullWidth
              label="Points"
              sx={{ marginBottom: "1em" }}
              value={newEntry.points ?? ""}
              onChange={(e) => updateNewEntry({ points: Number(e.target.value) })}
              type="number"
              required
            />
            <Button fullWidth type="submit" variant="contained" color="primary" disabled={!opportunitiesBasicInfoIsComplete}>
              Add
            </Button>
          </form>
        </Paper></Box>
    </Box>
  );
};

export default PointEntriesDataGrid;
