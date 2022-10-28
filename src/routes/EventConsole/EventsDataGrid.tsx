import { Delete, Edit } from "@mui/icons-material";
import { GridActionsCellItem, GridColumns } from "@mui/x-data-grid";
import { Firestore, collection, deleteDoc, doc } from "firebase/firestore";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useFirestore } from "reactfire";

import { routeDefinitions } from "..";
import FirestoreCollectionDataGrid from "../../components/FirestoreCollectionDataGrid";
import { RawFirestoreEvent } from "../../firebase/types/FirestoreEvent";

const getColumns = (firestore: Firestore, navigate: ReturnType<typeof useNavigate>): GridColumns<RawFirestoreEvent & {id: string}> => [
  {
    field: "title",
    headerName: "Title",
    flex: 1
  },
  {
    field: "startTime",
    headerName: "Start Time",
    type: "dateTime",
    valueGetter: ({ row }) => row.startTime?.toDate(),
    flex: 1
  },
  {
    field: "endTime",
    headerName: "End Time",
    type: "dateTime",
    valueGetter: ({ value }) => value?.toDate(),
    flex: 1
  },
  {
    field: "address",
    headerName: "Address",
    flex: 2
  },
  {
    field: "link",
    headerName: "Link",
    renderCell: ({ value }) => {
      if (value == null) {
        return null;
      } else if (Array.isArray(value)) {
        return (
          <div>
            {value.map((link, index) => (<a key={index} href={link.url} target="_blank" rel="noreferrer">{link.text}</a>))}
          </div>
        );
      } else {
        return (<a href={value.url} target="_blank" rel="noreferrer">{value.text}</a>);
      }
    },
    flex: 1.8
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
        onClick={() => deleteDoc(doc(firestore, `events/${rowData.id}`)).catch((e) => {
          console.error(e);
          alert(`Error deleting event: ${e.message}`);
        })}
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
          firestoreCollectionRef={collection(firestore, "events")}
          columns={columns}
          dataGridProps={{ getRowHeight: () => "auto" }}
          enablePopover
          defaultSortField="startTime"
        />
      </div>
    </div>
  );
};

export default EventsDataGrid;
