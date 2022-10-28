import { useParams } from "react-router-dom";

import { useFormReducer } from "../../../customHooks";
import { RawFirestoreEvent } from "../../../firebase/types/FirestoreEvent";

export const EventEditor = (
  {
    initialData, onEventSaved, disabled = false
  }:
  {
    initialData?: RawFirestoreEvent;
    onEventSaved?: (event: RawFirestoreEvent) => void;
    disabled?: boolean;
  }
) => {
  const params = useParams();
  const [event] = useFormReducer<RawFirestoreEvent>(initialData ?? { title: "", description: "" });
  return <>{JSON.stringify({ params, event })}</>;
};
