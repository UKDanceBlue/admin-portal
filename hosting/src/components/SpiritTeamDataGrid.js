import { collection, doc, setDoc } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { DataGrid } from "@mui/x-data-grid";
import { firestore } from "../firebase/firebaseApp";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";
import deepEquals from "deep-is";

// TODO convert this to a generic interface for editing a firestore collection

const spiritTeamsCollectionRef = collection(firestore, "teams");

const DataGridFirebaseErrorOverlay = ({ code, message }) => {
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

const SpiritTeamDataGrid = (props) => {
  const [membersDialogOpen, setMembersDialogOpen] = useState(false);
  const [membersDialogContent, setMembersDialogContent] = useState({});

  const membersDialogDescriptionElementRef = useRef(null);
  useEffect(() => {
    if (membersDialogOpen) {
      const { current: descriptionElement } =
        membersDialogDescriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [membersDialogOpen]);

  const [snackbar, setSnackbar] = useState(null);
  const [spiritTeams, loading, error] = useCollection(spiritTeamsCollectionRef);

  const handleProcessRowUpdateError = useCallback((error) => {
    setSnackbar({ children: error.message, severity: "error" });
  }, []);

  const showTeamMembersDialog = useCallback((teamMembers) => {
    setMembersDialogContent(teamMembers);
    setMembersDialogOpen(true);
  }, []);

  const processRowUpdate = useCallback(async (newRow, oldRow) => {
    if (deepEquals(newRow, oldRow)) {
      return oldRow;
    } else {
      if (newRow.id !== oldRow.id) {
        throw new Error("Row ID changed, database update aborted");
      } else {
        return setDoc(doc(spiritTeamsCollectionRef, newRow.id), newRow).then(
          () => newRow
        );
      }
    }
  }, []);

  return (
    <>
      <DataGrid
        {...props}
        experimentalFeatures={{ newEditingApi: true }}
        rows={
          spiritTeams
            ? spiritTeams.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            : []
        }
        columns={[
          {
            field: "id",
            headerName: "Team ID",
            width: 200,
          },
          {
            field: "name",
            headerName: "Name",
            width: 300,
            editable: true,
          },
          {
            field: "networkForGoodId",
            headerName: "Network For Good ID",
            width: 200,
            editable: true,
          },
          {
            field: "totalSpiritPoints",
            headerName: "Total Spirit Points",
            width: 200,
          },
          {
            field: "members",
            headerName: "Members",
            width: 200,
            selectable: false,
            renderCell: ({ value }) => {
              return (
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Button
                    variant="contained"
                    disabled={!value || Object.keys(value).length === 0}
                    onClick={() => showTeamMembersDialog(value)}
                    sx={{
                      my: "5%",
                      justifyContent: "left",
                    }}
                  >
                    Show
                  </Button>
                </div>
              );
            },
          },
        ]}
        loading={loading}
        error={error}
        components={{
          ErrorOverlay: DataGridFirebaseErrorOverlay,
        }}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
      />
      {!!snackbar && (
        <Snackbar
          open
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          onClose={() => setSnackbar(null)}
          autoHideDuration={6000}
        >
          <Alert {...snackbar} onClose={() => setSnackbar(null)} />
        </Snackbar>
      )}
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
            {Object.entries(membersDialogContent).map(
              ({ 0: key, 1: value }) => (
                <ListItem key={key}>
                  <ListItemText primary={value} />
                </ListItem>
              )
            )}
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
