import { FormControl } from "@mui/material";
import { collection } from "firebase/firestore";
import { useState } from "react";
import { useFirestore } from "reactfire";

import FirestoreCollectionDropdown from "../../components/FirestoreCollectionDropdown";
import { GenericFirestoreDocument } from "../../firebase/types";

const NotificationForm = () => {
  const firestore = useFirestore();

  const [selectedTeams, setSelectedTeams] = useState<GenericFirestoreDocument[]>([]);

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
      </FormControl>
      <p>{JSON.stringify(selectedTeams, undefined, 2)}</p>
    </>
  );
};

export default NotificationForm;
