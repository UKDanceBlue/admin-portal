import { Timestamp, collection } from "firebase/firestore";
import { useFirestore } from "reactfire";

import FirestoreCollectionDataGrid from "../../../components/FirestoreCollectionDataGrid";

const OpportunityDataGrid = () => {
  const firestore = useFirestore();

  const opportunitiesCollectionRef = collection(firestore, "opportunities");

  return (
    <FirestoreCollectionDataGrid
      columns={[
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
        },
        {
          field: "dateTime",
          headerName: "Date (for sorting)",
          flex: 2.5,
          editable: true,
          type: "date",
          valueGetter: ({ value }) => value.date == null ? Date.now() : value.date.toDate(),
          valueSetter: ({ value }) => ({ ...value, date: value.date == null ? null : Timestamp.fromDate(value.date) })
        }
        // TODO: Add a button to load the total points for the opportunity
      ]}
      firestoreCollectionRef={opportunitiesCollectionRef}
    />
  );
};

export default OpportunityDataGrid;
