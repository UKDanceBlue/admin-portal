import { People, TableRows } from "@mui/icons-material";
import { Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Typography } from "@mui/material";
import { GridActionsCellItem, GridRowParams } from "@mui/x-data-grid";
import { collection } from "firebase/firestore";
import PropTypes from "prop-types";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { useFirestore } from "reactfire";

import FirestoreCollectionDataGrid from "../../components/FirestoreCollectionDataGrid";

const DataGridFirebaseErrorOverlay = ({
  code, message
}: { code: string; message: string }) => {
  return (
    <div>
      <Typography variant="h4" component="h4">
        An error has occurred
      </Typography>
      <p>Error code &apos;{code}&apos;</p>
      {message && <p>{message}</p>}
    </div>
  );
};

DataGridFirebaseErrorOverlay.propTypes = {
  code: PropTypes.string.isRequired,
  message: PropTypes.string,
};

const SpiritTeamDataGrid = () => {
  const firestore = useFirestore();

  const [ membersDialogOpen, setMembersDialogOpen ] = useState(false);
  const [ membersDialogContent, setMembersDialogContent ] = useState({});

  const spiritTeamsCollectionRef = collection(firestore, "spirit/teams/documents");

  const membersDialogDescriptionElementRef = useRef<any>(null);
  useEffect(() => {
    if (membersDialogOpen) {
      const { current: descriptionElement } = membersDialogDescriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [membersDialogOpen]);

  const showTeamMembersDialog = useCallback((teamMembers: unknown[]) => {
    setMembersDialogContent(teamMembers);
    setMembersDialogOpen(true);
  }, []);

  return (
    <>
      <FirestoreCollectionDataGrid
        columns={[
          {
            field: "id",
            headerName: "Team ID",
            flex: 2,
          },
          {
            field: "name",
            headerName: "Name",
            flex: 2.5,
            editable: true,
          },
          {
            field: "networkForGoodId",
            headerName: "Network For Good ID",
            flex: 1.75,
            editable: true,
            type: "number",
          },
          {
            field: "totalPoints",
            headerName: "Total Spirit Points",
            flex: 1.75,
            type: "number",
          },
          {
            field: "members",
            headerName: "Members",
            flex: 0.75,
            editable: false,
            type: "actions",
            getActions: (params: GridRowParams) => [
              <GridActionsCellItem
                key={0}
                icon={<People />}
                disabled={!params.row["members"] || Object.keys(params.row["members"]).length === 0}
                onClick={() => showTeamMembersDialog(params.row["members"])}
                label="Details"
              />,
              <GridActionsCellItem
                key={1}
                icon={<TableRows />}
                disabled={!params.row["members"] || Object.keys(params.row["members"]).length === 0}
                onClick={() => window.location.assign(`/spirit-points/spirit-teams/${params.row["id"]}`)}
                label="Details"
              />,
            ],
          },
        ]}
        firestoreCollectionRef={spiritTeamsCollectionRef}
        defaultSortField="name"
      />
      <Dialog
        open={membersDialogOpen}
        onClose={() => setMembersDialogOpen(false)}
        scroll={"paper"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Team Members</DialogTitle>
        <DialogContent dividers={true}>
          <List>
            {Object.entries(membersDialogContent).map(({
              0: key, 1: value
            }) => (
              <ListItem key={key}>
                <ListItemText primary={value as ReactNode} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMembersDialogOpen(false)}>OK</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SpiritTeamDataGrid;
