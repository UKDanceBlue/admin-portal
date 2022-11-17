import { Delete, Edit } from "@mui/icons-material";
import { GridActionsCellItem, GridColumns } from "@mui/x-data-grid";
import { FirestoreEvent, FirestoreEventJsonV1, MaybeWithFirestoreMetadata } from "@ukdanceblue/db-app-common";
import { Firestore, collection, deleteDoc, doc } from "firebase/firestore";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useFirestore } from "reactfire";

import { routeDefinitions } from "..";
import FirestoreCollectionDataGrid from "../../components/FirestoreCollectionDataGrid";
import { makeConverter } from "../../firebase/Converter";

const getColumns = (firestore: Firestore, navigate: ReturnType<typeof useNavigate>): GridColumns<MaybeWithFirestoreMetadata<FirestoreEventJsonV1> & {id: string}> => [
  {
    field: "name",
    headerName: "Event Name",
    flex: 1
  },
  {
    field: "interval.start",
    headerName: "Start Time",
    type: "dateTime",
    valueGetter: ({ row }) => row.interval?.start?.toDate(),
    flex: 1
  },
  {
    field: "interval.end",
    headerName: "End Time",
    type: "dateTime",
    valueGetter: ({ row }) => row.interval?.end?.toDate(),
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
        <FirestoreCollectionDataGrid
          firestoreCollectionRef={collection(firestore, "events").withConverter(makeConverter(FirestoreEvent))}
          columns={columns}
          dataGridProps={{ getRowHeight: () => "auto" }}
          enablePopover
          defaultSortField="interval.start"
        />
      </div>
    </div>
  );
};

export default EventsDataGrid;
