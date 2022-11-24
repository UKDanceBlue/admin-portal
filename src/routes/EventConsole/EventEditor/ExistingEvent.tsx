import { FirestoreEvent, FirestoreEventJsonV1 } from "@ukdanceblue/db-app-common";
import { Firestore, collection, doc, setDoc } from "firebase/firestore";
import { useEffect, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFirestore, useFirestoreDocDataOnce } from "reactfire";

import { routeDefinitions } from "../..";
import ErrorBoundary from "../../../components/ErrorBoundary";
import { useLoading } from "../../../components/LoadingWrapper";
import { makeConverter } from "../../../firebase/Converter";

import { EventEditor } from "./EventEditor";

function getEventDoc(firestore: Firestore, eventId: string) {
  return doc(collection(firestore, "events"), eventId).withConverter(makeConverter(FirestoreEvent));
}

export const ExistingEvent = () => {
  const { eventId } = useParams();

  if (!eventId) {
    alert("Invalid URL!");
    throw new Error("Event ID not provided");
  }

  const [ isLoading, setIsLoading ] = useLoading();

  const navigate = useNavigate();
  const firestore = useFirestore();

  const {
    data, error, status
  } = useFirestoreDocDataOnce(getEventDoc(firestore, eventId));

  const [ key, resetEditor ] = useReducer((key) => key + 1, 0);

  useEffect(() => {
    if (error){
      alert(`There was an error loading the event: ${error.message}`);
      console.error(error);
      navigate({ pathname: routeDefinitions["event-manager"].path });
    }
  }, [ error, navigate ]);

  const saveEvent = async (event: FirestoreEventJsonV1) => {
    setIsLoading(true);
    await setDoc(getEventDoc(firestore, eventId), event);
    setIsLoading(false);
    navigate({ pathname: routeDefinitions["event-manager"].path });
  };

  return (
    <div style={{ minHeight: "60vh", display: "flex" }}>
      <div style={{ flex: 1, padding: "1em" }}>
        {status === "loading" && <div>Loading...</div>}
        {status === "success" && (
          <ErrorBoundary>
            <EventEditor
              onEventSaved={saveEvent}
              disabled={isLoading}
              key={key}
              resetMe={resetEditor}
              initialData={data as FirestoreEventJsonV1}
            />
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
};
