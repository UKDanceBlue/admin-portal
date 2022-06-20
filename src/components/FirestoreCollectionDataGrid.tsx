import { Alert, AlertColor, Snackbar, Typography } from "@mui/material";
import { DataGrid, GridColumns } from "@mui/x-data-grid";
import deepEquals from "deep-equal";
import { CollectionReference, doc, setDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { useFirestoreCollection } from "reactfire";

const DataGridFirebaseErrorOverlay = ({
  code, message
}: { code: string; message?: string }) => {
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

const FirestoreCollectionDataGrid = ({
  columns,
  firestoreCollectionRef,
}: {
  columns: GridColumns<{
    [key: string]: string;
  }>;
  firestoreCollectionRef: CollectionReference;
}) => {
  const [ snackbar, setSnackbar ] = useState<{ children: string; severity: AlertColor } | null>(null);
  const firestoreCollection = useFirestoreCollection(firestoreCollectionRef);

  const handleProcessRowUpdateError = useCallback((error: Error) => {
    setSnackbar({ children: error.message, severity: "error" });
  }, []);

  const processRowUpdate = useCallback(
    (newRow: { [key: string]: string }, oldRow: { [key: string]: string }) => {
      if (deepEquals(newRow, oldRow)) {
        return oldRow;
      } else if (newRow.id !== oldRow.id) {
        throw new Error("Row ID changed, database update aborted");
      } else {
        return setDoc(doc(firestoreCollectionRef, newRow.id || ""), newRow).then(() => newRow);
      }
    },
    [firestoreCollectionRef]
  );

  return (
    <>
      <DataGrid
        experimentalFeatures={{ newEditingApi: true }}
        rows={
          firestoreCollection.data
            ? firestoreCollection.data.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            : []
        }
        columns={columns}
        loading={firestoreCollection.status === "loading"}
        error={firestoreCollection.error}
        components={{ ErrorOverlay: DataGridFirebaseErrorOverlay }}
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
    </>
  );
};

export default FirestoreCollectionDataGrid;
