import { Alert, AlertColor, Popover, Snackbar, Typography } from "@mui/material";
import { DataGrid, GridColumns, GridRowModel } from "@mui/x-data-grid";
import deepEquals from "deep-equal";
import { CollectionReference, GeoPoint, Timestamp, doc, setDoc } from "firebase/firestore";
import { MouseEvent, useCallback, useState } from "react";
import { useFirestoreCollection } from "reactfire";

import { GenericFirestoreDocument } from "../firebase/types";

const DataGridFirebaseErrorOverlay = ({
  code, message
}: { code: string; message?: string }) => {
  return (
    <div>
      <Typography variant="h4" component="h4">
        An error has occurred
      </Typography>
      {code && <p>Error code &apos;{code}&apos;</p>}
      {message && <p>{message}</p>}
    </div>
  );
};

function FirestoreCollectionDataGrid<T extends GridRowModel<GenericFirestoreDocument>>({
  columns,
  firestoreCollectionRef,
  dataGridProps,
  enablePopover = false
}: {
  columns: GridColumns<T>;
  firestoreCollectionRef: CollectionReference;
  dataGridProps?: Partial<Parameters<typeof DataGrid>[0]>;
  enablePopover?: boolean;
}) {
  const [ snackbar, setSnackbar ] = useState<{ children: string; severity: AlertColor } | null>(null);
  const firestoreCollection = useFirestoreCollection(firestoreCollectionRef);

  const [ popoverAnchorEl, setPopoverAnchorEl ] = useState<HTMLElement | null>(null);
  const [ popoverText, setPopoverText ] = useState<string | null>(null);

  const data = firestoreCollection.data
    ? firestoreCollection.data.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    : [];

  const handleProcessRowUpdateError = useCallback((error: Error) => {
    setSnackbar({ children: error.message, severity: "error" });
  }, []);

  const handlePopoverOpen = (event: MouseEvent<HTMLElement>) => {
    const field = event.currentTarget.dataset.field!;
    const id = event.currentTarget.parentElement!.dataset.id!;
    const row = data.find((r) => r.id === id)!;
    const value = (row as Record <string, unknown>)[field];
    if (value != null) {
      if (value instanceof Timestamp) {
        setPopoverAnchorEl(event.currentTarget);
        setPopoverText(value.toDate().toLocaleString());
      } else if (value instanceof GeoPoint) {
        setPopoverAnchorEl(event.currentTarget);
        setPopoverText(`(${value.latitude}, ${value.longitude})`);
      } else if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        setPopoverAnchorEl(event.currentTarget);
        setPopoverText(String(value));
      } else if (typeof value === "object") {
        setPopoverAnchorEl(event.currentTarget);
        setPopoverText(JSON.stringify(value, undefined, 2));
      } else {
        setPopoverAnchorEl(null);
        setPopoverText(null);
      }
    } else {
      setPopoverAnchorEl(null);
      setPopoverText(null);
    }
  };

  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
  };

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
          data
        }
        columns={columns}
        loading={firestoreCollection.status === "loading"}
        error={firestoreCollection.error}
        components={{ ErrorOverlay: DataGridFirebaseErrorOverlay }}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        componentsProps={{
          cell: enablePopover ? {
            onMouseEnter: handlePopoverOpen,
            onMouseLeave: handlePopoverClose,
          } : undefined,
        }}
        {...dataGridProps}
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
      <Popover
        id="cell-popover"
        sx={{ pointerEvents: "none" }}
        open={enablePopover && Boolean(popoverAnchorEl)}
        anchorEl={popoverAnchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={() => setPopoverAnchorEl(null)}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1 }}>{popoverText}</Typography>
      </Popover>
    </>
  );
}

export default FirestoreCollectionDataGrid;
