import { GeoPoint, collection } from "firebase/firestore";
import { useFirestore } from "reactfire";

import FirestoreCollectionDataGrid from "../../components/FirestoreCollectionDataGrid";
import LoadableImage from "../../components/LoadableImage";

const EventsDataGrid = () => {
  const firestore = useFirestore();

  return (
    <div style={{ minHeight: "60vh", display: "flex" }}>
      <div style={{ flex: 1, padding: "1em" }}>
        <FirestoreCollectionDataGrid
          firestoreCollectionRef={collection(firestore, "events")}
          columns={[
            {
              field: "title",
              headerName: "Title",
              flex: 1
            },
            {
              field: "startTime",
              headerName: "Start Time",
              type: "dateTime",
              valueGetter: ({ value }) => value?.toDate(),
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
              field: "position",
              headerName: "Coordinates",
              valueFormatter: ({ value }) => value == null ? undefined : `(${(value as GeoPoint)?.latitude}, ${(value as GeoPoint)?.longitude})`,
              flex: 1
            },
            {
              field: "description",
              headerName: "Description",
              flex: 3
            },
            {
              field: "image",
              headerName: "Image",
              renderCell: (rowData) => rowData.value == null ? undefined : <LoadableImage
                src={rowData.value?.uri}
                alt={rowData.row.title}
                isStorageUri
                height={160}
              />,
              flex: 3
            }
          ]}
          dataGridProps={{ getRowHeight: () => "auto" }}
          enablePopover
        />
      </div>
    </div>
  );
};

export default EventsDataGrid;
