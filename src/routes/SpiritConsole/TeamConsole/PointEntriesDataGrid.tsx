import { Delete, Numbers } from "@mui/icons-material";
import { Button, IconButton, Paper, TextField, Typography } from "@mui/material";
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
  const [ isLoadingGlobal, setIsLoading ] = useLoading(`${teamId}-point-entries`);
  const isLoading = isLoadingGlobal || !opportunitiesBasicInfoIsComplete;

  const [ newEntry, updateNewEntry ] = useReducer((state: Partial<PointEntry>, newState: Partial<PointEntry>) => ({ ...state, ...(Object.fromEntries(Object.entries(newState).filter(([ , val ]) => (val != null)))) }), {});

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
                field: "displayName",
                headerName: "Entry Name",
                flex: 2,
              },
              {
                field: "linkblue",
                headerName: "Linkblue",
                flex: 1.5,
                type: "linkblue",
                valueFormatter: ({ value }) => value === "%TEAM%" ? "Everyone" : value,
              },
              {
                headerName: "Total Points",
                flex: 1,
                field: "points",
              },
              {
                headerName: "Opportunity",
                flex: 1.5,
                field: "opportunityId",
                valueFormatter: ({ value }) => opportunitiesBasicInfo.data()?.basicInfo[value]?.name ?? value,
              },
              {
                field: "actions",
                headerName: "Actions",
                flex: 1,
                type: "actions",
                getActions: (rowData) => [
                  <IconButton
                    key={`${rowData.row.id }-delete`}
                    onClick={() => {
                      // @ts-expect-error - displayName is a valid field
                      const displayedName = (((rowData.row["displayName"] as string)?.length ?? 0) === 0)
                        ? "this person"
                        // @ts-expect-error - displayName is a valid field
                        : rowData.row["displayName"];

                      if (confirm(`Are you sure you want to delete the entry for ${displayedName}?`)) {
                        deleteDoc(doc(entiresCollectionRef, rowData.row.id)).catch((error) => {
                          console.error("Error removing document: ", error);
                          alert(`Error removing document: ${ error}`);
                        });
                      }
                    }}
                    title="Delete"
                  >
                    <Delete />
                  </IconButton>,
                  <IconButton
                    key={`${rowData.row.id }-id`}
                    onClick={() => {
                      navigator.clipboard.writeText(rowData.row.id);
                    }}
                    title="Copy ID"
                  >
                    <Numbers />
                  </IconButton>,
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
              setDoc(newDocument, { ...newEntry, teamId })
                .then(() => {
                  updateNewEntry({
                    displayName: undefined,
                    linkblue: undefined,
                    opportunityId: undefined,
                    points: undefined,
                  });
                })
                .catch((e) => {
                  alert(e);
                  console.error(e);
                })
                .finally(() => {
                  setIsLoading(false);
                });
            }}
          >
            <TextField
              fullWidth
              label="Reason"
              disabled={isLoading}
              value={newEntry.displayName ?? ""}
              onChange={(e) => updateNewEntry({ displayName: e.target.value })}
            />
            <Typography
              variant="caption"
              sx={{ marginBottom: "1em" }}
            >
              Like &apos;memo&apos; on a check
            </Typography>
            <TextField
              fullWidth
              label="Linkblue"
              disabled={isLoading}
              value={newEntry.linkblue ?? ""}
              onChange={(e) => updateNewEntry({ linkblue: e.target.value })}
            />
            <Typography
              variant="caption"
              sx={{ marginBottom: "1em" }}
            >
              (blank for team)
            </Typography>
            <TextField
              fullWidth
              label="Opportunity"
              sx={{ marginBottom: "1em" }}
              value={newEntry.opportunityId ?? ""}
              onChange={(e) => updateNewEntry({ opportunityId: e.target.value })}
              select
              SelectProps={{ native: true }}
              disabled={isLoading}
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
              disabled={isLoading}
              sx={{ marginBottom: "1em" }}
              value={newEntry.points ?? ""}
              onChange={(e) => updateNewEntry({ points: e.target.value.length === 0 ? undefined : Number(e.target.value) })}
              type="number"
              required
            />
            <Button fullWidth type="submit" variant="contained" color="primary" disabled={isLoading}>
              Add
            </Button>
          </form>
        </Paper></Box>
    </Box>
  );
};

export default PointEntriesDataGrid;
