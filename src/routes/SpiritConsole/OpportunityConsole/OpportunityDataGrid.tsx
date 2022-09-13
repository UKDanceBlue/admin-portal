import { GridColumns } from "@mui/x-data-grid";
import { Timestamp, collection } from "firebase/firestore";
import { useFirestore } from "reactfire";

import FirestoreCollectionDataGrid from "../../../components/FirestoreCollectionDataGrid";

const columns: GridColumns<{
  id: string,
  name: string | null,
  date: Timestamp | null
}> = [
  {
    field: "id",
    headerName: "Opportunity ID",
    flex: 2,
  },
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
  }
];
const OpportunityDataGrid = () => {
  const firestore = useFirestore();

  const opportunitiesCollectionRef = collection(firestore, "/spirit/opportunities/documents");

  return (
    <FirestoreCollectionDataGrid
      columns={columns}
      firestoreCollectionRef={opportunitiesCollectionRef}
      defaultSortField="date"
    />
  );
};

export default OpportunityDataGrid;
