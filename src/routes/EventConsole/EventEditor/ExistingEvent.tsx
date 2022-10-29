import { collection, doc, setDoc } from "firebase/firestore";
import { useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFirestore } from "reactfire";

import { routeDefinitions } from "../..";
import { useLoading } from "../../../components/LoadingWrapper";
import { RawFirestoreEvent } from "../../../firebase/types/FirestoreEvent";

import { EventEditor } from "./EventEditor";

export const ExistingEvent = () => {
  const navigate = useNavigate();
  const firestore = useFirestore();

  const [ key, resetEditor ] = useReducer((key) => key + 1, 0);

  const { id } = useParams();

  const [ isLoading, setIsLoading ] = useLoading();

  const saveEvent = async (event: RawFirestoreEvent) => {
    setIsLoading(true);
    await setDoc(doc(collection(firestore, "events"), id), event);
    setIsLoading(false);
    navigate({ pathname: routeDefinitions["event-manager"].path });
  };

  return (
    <div style={{ minHeight: "60vh", display: "flex" }}>
      <div style={{ flex: 1, padding: "1em" }}>
        <EventEditor
          onEventSaved={saveEvent}
          disabled={isLoading}
          key={key}
          resetMe={resetEditor}
        />
      </div>
    </div>
  );
};
