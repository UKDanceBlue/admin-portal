import { Delete, Edit } from "@mui/icons-material";
import { GridActionsCellItem, GridColumns } from "@mui/x-data-grid";
import { FirestoreEvent, FirestoreEventJsonV1, MaybeWithFirestoreMetadata } from "@ukdanceblue/db-app-common";
import { Firestore, collection, deleteDoc, doc } from "firebase/firestore";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useFirestore } from "reactfire";

import { routeDefinitions } from "..";
import ErrorBoundary from "../../components/ErrorBoundary";
import FirestoreCollectionDataGrid from "../../components/FirestoreCollectionDataGrid";
import { makeConverter } from "../../firebase/Converter";

const dateValueGetter = ({ row }: { row: MaybeWithFirestoreMetadata<FirestoreEventJsonV1> }): Date => row.interval?.start?.toDate() ?? new Date(0);
const dateValueFormatter = ({ value }: { value?: Date }): string => {
  if (value == null || value.getTime() === 0) {
    return "N/A";
  } else {
    return value.toLocaleString();
  }
};

const getColumns = (firestore: Firestore, navigate: ReturnType<typeof useNavigate>): Readonly<GridColumns<MaybeWithFirestoreMetadata<FirestoreEventJsonV1> & {id: string}>> => [
  {
    field: "name",
    headerName: "Event Name",
    flex: 1
  },
  {
    field: "interval.start",
    headerName: "Start Time",
    type: "dateTime",
    valueGetter: dateValueGetter,
    valueFormatter: dateValueFormatter,
    flex: 1
  },
  {
    field: "interval.end",
    headerName: "End Time",
    type: "dateTime",
    valueGetter: dateValueGetter,
    valueFormatter: dateValueFormatter,
    flex: 1
  },
  {
    field: "address",
    headerName: "Address",
    flex: 2
  },
  {
    field: "actions",
    headerName: "Actions",
    flex: 1,
    type: "actions",
    getActions: (rowData) => [
      <GridActionsCellItem
        key={0}
        icon={<Delete />}
        onClick={() => {
          if (confirm("Are you sure you want to delete this event?")) {
            deleteDoc(doc(firestore, `events/${rowData.id}`)).catch((e) => {
              console.error(e);
              alert(`Error deleting event: ${e.message}`);
            });
          }
        }}
        label="Delete"
      />,
      <GridActionsCellItem
        key={1}
        icon={<Edit />}
        onClick={() => navigate({ pathname: `/${ routeDefinitions["event-manager"].pathFragment }/${ rowData.id}` })}
        label="Edit"
      />
    ]
  }
];

const EventsDataGrid = () => {
  const firestore = useFirestore();
  const navigate = useNavigate();

  const columns = useMemo(() => getColumns(firestore, navigate), [ firestore, navigate ]);

  return (
    <div style={{ minHeight: "60vh", display: "flex" }}>
      <div style={{ flex: 1, padding: "1em" }}>
        <ErrorBoundary>
          <FirestoreCollectionDataGrid
            firestoreCollectionRef={collection(firestore, "events").withConverter(makeConverter(FirestoreEvent))}
            columns={columns}
            dataGridProps={{ getRowHeight: () => "auto" }}
            enablePopover
            defaultSortField="interval.start"
          />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default EventsDataGrid;
