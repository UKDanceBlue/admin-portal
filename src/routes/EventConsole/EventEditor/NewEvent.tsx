import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { FirestoreEvent, FirestoreEventJsonV1 } from "@ukdanceblue/db-app-common";
import { collection, doc, setDoc } from "firebase/firestore";
import { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFirestore } from "reactfire";
import { v4 } from "uuid";

import { routeDefinitions } from "../..";
import { useLoading } from "../../../components/LoadingWrapper";
import { makeConverter } from "../../../firebase/Converter";
import { BbnvolvedImportDialog } from "../BbnvolvedImportDialog";

import { EventEditor } from "./EventEditor";

export const NewEvent = () => {
  const navigate = useNavigate();
  const firestore = useFirestore();

  const [ key, resetEditor ] = useReducer((key) => key + 1, 0);

  const [ isLoading, setIsLoading ] = useLoading();
  const [ isBbnvolvedDialogOpen, setIsBbnvolvedDialogOpen ] = useState(false);
  const [ filledEvent, setFilledEvent ] = useState<FirestoreEventJsonV1 | undefined>();

  const saveEvent = async (event: FirestoreEventJsonV1) => {
    setIsLoading(true);
    await setDoc(doc(collection(firestore, "events").withConverter(makeConverter(FirestoreEvent)), v4()), event);
    setIsLoading(false);
    navigate({ pathname: routeDefinitions["event-manager"].path });
  };

  return (
    <Box sx={{ minHeight: "60vh", display: "flex" }}>
      <Box sx={{ flex: 1, padding: "1em" }}>
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h5">Add a New Event</Typography>
          <Button
            variant="contained"
            disabled={isLoading}
            onClick={() => setIsBbnvolvedDialogOpen(true)}
          >
            Autofill From BBNvolved
          </Button>
        </Box>
        <EventEditor
          onEventSaved={saveEvent}
          key={key}
          resetMe={() => {
            setFilledEvent(undefined);
            resetEditor();
          }}
          disabled={isLoading}
          initialData={filledEvent}
        />
      </Box>
      <BbnvolvedImportDialog
        open={isBbnvolvedDialogOpen}
        onClose={() => setIsBbnvolvedDialogOpen(false)}
        setFilledEvent={(newEvent: FirestoreEventJsonV1) => {
          setFilledEvent(newEvent);
          resetEditor();
        }} />
    </Box>
  );
};
