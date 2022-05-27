import { FormControl } from "@mui/material";
import { collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useFirestore } from "reactfire";

import FirestoreCollectionDropdown from "../../../components/FirestoreCollectionDropdown";
import { GenericFirestoreDocument } from "../../../firebase/types";

import { NotificationFormPendingState } from ".";
// import { Notification } from "../types";

const AudiencePage = ({
  pendingState,
  handlePageUpdated,
}: {
  pendingState: NotificationFormPendingState;
  handlePageUpdated: (changedContent: NotificationFormPendingState) => void;
}) =>
  //   {
  //   handlePageUpdated,
  // }: {
  //   handlePageUpdated: (changedContent: Notification) => void;
  // }
  {
    const firestore = useFirestore();

    const [selectedTeams, setSelectedTeams] = useState<GenericFirestoreDocument[]>(
      pendingState.selectedTeams ?? []
    );

    useEffect(() => {
      handlePageUpdated({
        selectedTeams,
      });
    }, [handlePageUpdated, selectedTeams]);

    return (
      <>
        <FormControl variant="outlined" fullWidth>
          <FirestoreCollectionDropdown
            label="Team Selection"
            getLabel={(doc) => doc.name}
            onChange={(__, value) => {
              setSelectedTeams(value);
            }}
            collectionRef={collection(firestore, "teams").withConverter({
              toFirestore(data: GenericFirestoreDocument) {
                const dataToUpload = { ...data };
                delete dataToUpload.id;
                return dataToUpload;
              },
              fromFirestore(snapshot, options) {
                const data = snapshot.data(options);
                return { ...data, id: snapshot.id };
              },
            })}
          />
          {/* <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select> */}
        </FormControl>
      </>
    );
  };

export default AudiencePage;
