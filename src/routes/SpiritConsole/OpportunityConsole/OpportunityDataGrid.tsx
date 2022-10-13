import { Delete, Numbers } from "@mui/icons-material";
import { GridActionsCellItem, GridColumns, GridRowParams } from "@mui/x-data-grid";
import { Timestamp, collection, deleteDoc, doc } from "firebase/firestore";
import { useFirestore } from "reactfire";

import FirestoreCollectionDataGrid from "../../../components/FirestoreCollectionDataGrid";

const OpportunityDataGrid = () => {
  const firestore = useFirestore();

  const opportunitiesCollectionRef = collection(firestore, "/spirit/opportunities/documents");

  const columns: GridColumns<{
    id: string,
    name: string | null,
    date: Timestamp | null
  }> = [
    {
      field: "name",
      headerName: "Name",
      flex: 2.5,
      editable: true,
      valueSetter: ({
        row, value
      }) => ({ ...row, name: value == null ? null : value })
    },
    {
      field: "date",
      headerName: "Date (for sorting)",
      flex: 2.5,
      editable: true,
      type: "dateTime",
      valueGetter: ({ row }) => row.date == null ? Date.now() : row.date.toDate(),
      valueSetter: ({
        row, value
      }) => ({ ...row, date: value == null ? null : Timestamp.fromDate(value) })
    },
    {
      field: "totalPoints",
      headerName: "Total Points",
      flex: 1,
      type: "number",
      editable: false,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.75,
      editable: false,
      type: "actions",
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key={1}
          icon={<Delete />}
          onClick={() => {
            const displayedName = ((params.row["name"]?.length ?? 0) === 0)
              ? "this opportunity"
              : params.row["name"];

            if (confirm(`Are you sure you want to delete ${displayedName}?`)) {
              deleteDoc(doc(opportunitiesCollectionRef, params.row["id"])).catch((error) => {
                console.error("Error removing document: ", error);
                alert(`Error removing document: ${ error}`);
              });
            }
          }}
          label="Delete"
          title="Delete"
        />,
        <GridActionsCellItem
          key={2}
          onClick={() => {
            navigator.clipboard.writeText(params.row.id);
          }}
          label="Copy ID"
          title="Copy ID"
          icon={<Numbers />}
        />,
      ],
    }
  ];

  return (
    <FirestoreCollectionDataGrid
      columns={columns}
      firestoreCollectionRef={opportunitiesCollectionRef}
      defaultSortField="date"
    />
  );
};

export default OpportunityDataGrid;
