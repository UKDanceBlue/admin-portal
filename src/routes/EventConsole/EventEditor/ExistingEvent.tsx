import { FirestoreDataConverter, collection, doc, setDoc } from "firebase/firestore";
import { useEffect, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFirestore, useFirestoreDocDataOnce } from "reactfire";

import { routeDefinitions } from "../..";
import { useLoading } from "../../../components/LoadingWrapper";
import { RawFirestoreEvent, isRawFirestoreEvent } from "../../../firebase/types/FirestoreEvent";

import { EventEditor } from "./EventEditor";

// @ts-ignore There is a weird complex type error here - ts(2589)
const eventConverter: FirestoreDataConverter<RawFirestoreEvent> = {
  toFirestore(event){
    return event;
  },
  fromFirestore(snapshot, options?) {
    const event = snapshot.data(options);
    if (isRawFirestoreEvent(event)){
      return event;
    } else {
      throw new Error("Invalid data");
    }
  },
};

export const ExistingEvent = () => {
  const { eventId } = useParams();
  const [ isLoading, setIsLoading ] = useLoading();

  const navigate = useNavigate();
  const firestore = useFirestore();

  const {
    data, error, status
  } = useFirestoreDocDataOnce<RawFirestoreEvent>(doc(collection(firestore, "events"), eventId).withConverter(eventConverter));

  const [ key, resetEditor ] = useReducer((key) => key + 1, 0);

  useEffect(() => {
    if (error){
      alert(`There was an error loading the event: ${error.message}`);
      console.error(error);
      navigate({ pathname: routeDefinitions["event-manager"].path });
    }
  }, [ error, navigate ]);

  const saveEvent = async (event: RawFirestoreEvent) => {
    setIsLoading(true);
    await setDoc(doc(collection(firestore, "events"), eventId), event);
    setIsLoading(false);
    navigate({ pathname: routeDefinitions["event-manager"].path });
  };

  return (
    <div style={{ minHeight: "60vh", display: "flex" }}>
      <div style={{ flex: 1, padding: "1em" }}>
        {status === "loading" && <div>Loading...</div>}
        {status === "success" && (
          <EventEditor
            onEventSaved={saveEvent}
            disabled={isLoading}
            key={key}
            resetMe={resetEditor}
            initialData={data}
          />
        )}
      </div>
    </div>
  );
};
