import { Box, Button, Dialog, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { FirestoreEvent } from "@ukdanceblue/db-app-common";
import { DateTime } from "luxon";
import { useEffect, useRef, useState } from "react";
import { useFunctions, useStorage } from "reactfire";

import { listEventsParsed } from "../../bbnvolved/event-search";
import ErrorBoundary from "../../components/ErrorBoundary";
import { useLoading } from "../../components/LoadingWrapper";

/**
 * Gets and displays a list of BBNvolved events using bbnvolved/event-search.ts
*/
export const BbnvolvedImportDialog = ({
  open, setFilledEvent, onClose,
}: {open:boolean, setFilledEvent?: (event: FirestoreEvent) => void, onClose: () => void}) => {
  const loaded = useRef(false);
  const [ , setIsLoading ] = useLoading();
  const [ events, setEvents ] = useState<FirestoreEvent[]>([]);
  const functions = useFunctions();
  const storage = useStorage();

  useEffect(() => {
    if (open === true && loaded.current === false) {
      setIsLoading(true);
      listEventsParsed({
        endsAfter: DateTime.now(),
        organizationId: 192535, // DanceBlue's organization ID
        functions,
        storage
      }).then((events) => {
        setEvents(events);
        setIsLoading(false);
        loaded.current = true;
      });
    }
  }, [
    functions, open, setIsLoading, storage
  ]);

  return (
    <ErrorBoundary>
      <Dialog open={open} onClose={onClose} >
        <DialogTitle>Import Event</DialogTitle>
        <DialogContentText sx={{ px: "1em" }}>
        Select an event to import from BBNvolved. Note that this will only show you the next few events.
        Click outside of this dialog to cancel.
        </DialogContentText>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "1em" }} component="ul">
            {
              events.map((listedEvent) => (
                <Box key={listedEvent.name} sx={{ flexDirection: "row" }} component="li">
                  <Box sx={{ flex: 2 }}>
                    {listedEvent.name}
                  </Box>
                  <Button sx={{ flex: 1 }} onClick={() => {
                    if (listedEvent && setFilledEvent) {
                      setFilledEvent(listedEvent);
                    } else {
                      alert("Error: No event found.");
                    }
                    onClose();
                  }}>
                Import
                  </Button>
                </Box>
              ))
            }
          </Box>
        </DialogContent>
      </Dialog>
    </ErrorBoundary>
  );
};
