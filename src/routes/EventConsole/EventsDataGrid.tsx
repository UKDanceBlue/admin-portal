import { Button } from "@mui/material";
import { GeoPoint, collection, doc, updateDoc } from "firebase/firestore";
import { useFirestore } from "reactfire";

import FirestoreCollectionDataGrid from "../../components/FirestoreCollectionDataGrid";
import LoadableImage from "../../components/LoadableImage";

async function geocodeAddress(address: string) {
  const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${address}&lang=en&limit=1&bias=proximity:-84.503,38.04|countrycode:none&format=geojson&apiKey=${"d38fe150b0e0446cb01e8b47720ed296"}`);
  const json = await response.json();
  return JSON.stringify(json);
}

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
              editable: true,
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
              editable: true,
              flex: 2
            },
            {
              field: "addressGeoJson",
              headerName: "Position Info",
              renderCell: ({
                value, row
              }) => (
                <Button
                  disabled={!(value == null || value === "") || row.address == null}
                  variant="contained"
                  color="secondary"
                  type="button"
                  onClick={() => {
                    if (row.address != null) {
                      geocodeAddress(row.address).then((geoJson) => {
                        updateDoc(
                          doc(firestore, `events/${row.id}`),
                          { addressGeoJson: geoJson }
                        )
                          .catch((error) => {
                            console.error(error);
                          });
                      }).catch((e) => {
                        alert(`Error geocoding address: ${e}`);
                      });
                    }
                  }}
                >
                  {
                    value == null || value === ""
                      ? (
                        row.address == null
                          ? "No address"
                          : "Calculate"
                      )
                      : "Already calculated"
                  }
                </Button>
              ),
              valueFormatter: ({ value }) => value == null ? undefined : `(${(value as GeoPoint)?.latitude}, ${(value as GeoPoint)?.longitude})`,
              flex: 1.8
            },
            {
              field: "description",
              headerName: "Description",
              editable: true,
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
