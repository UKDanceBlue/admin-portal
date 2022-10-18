import { Box, Button, Dialog, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Timestamp } from "firebase/firestore";
import { DateTime } from "luxon";
import { Dispatch, useEffect, useRef, useState } from "react";
import { useFunctions } from "reactfire";

import { getEvent } from "../../bbnvolved/event-get";
import { ListedEvent, listEvents } from "../../bbnvolved/event-search";
import { useLoading } from "../../components/LoadingWrapper";

import { EventType } from "./NewEventForm";

type updateEventCallback = Dispatch<"reset" | [keyof EventType, string | Timestamp | (string | {
  file: File;
  width: number;
  height: number;
} | null)[] | {
  url: string;
  text: string;
}[] | undefined]>;

/**
 * Gets and displays a list of BBNvolved events using bbnvolved/event-search.ts
*/
export const BbnvolvedImportDialog = ({
  open, updateEvent, onClose,
}: {open:boolean, updateEvent: updateEventCallback, onClose: () => void}) => {
  const loaded = useRef(false);
  const [ , setIsLoading ] = useLoading();
  const [ events, setEvents ] = useState<ListedEvent[]>([]);
  const functions = useFunctions();

  useEffect(() => {
    if (open === true && loaded.current === false) {
      setIsLoading(true);
      listEvents({
        endsAfter: DateTime.now(),
        organizationId: 192535, // DanceBlue's organization ID
        functions
      }).then((events) => {
        setEvents(events.sort((a, b) => (a.startsOn && b.startsOn ? DateTime.fromISO(a.startsOn).toMillis() - DateTime.fromISO(b.startsOn).toMillis() : 0)));
        setIsLoading(false);
        loaded.current = true;
      });
    }
  }, [
    functions, open, setIsLoading
  ]);

  return (
    <Dialog open={open} onClose={onClose} >
      <DialogTitle>Import Event</DialogTitle>
      <DialogContentText sx={{ px: "1em" }}>
        Select an event to import from BBNvolved. Note that this will only show you the next 8 at most.
        Click outside of this dialog to cancel.
      </DialogContentText>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "1em" }} component="ul">
          {
            events.map((event) => (
              <Box key={event.id} sx={{ flexDirection: "row" }} component="li">
                <Box sx={{ flex: 2 }}>
                  {event.name}
                </Box>
                <Button sx={{ flex: 1 }} onClick={() => {
                  if (!event.id) {
                    return;
                  }
                  getEvent({ id: event.id, functions }).then((fullEvent) => {
                    updateEvent("reset");
                    if (fullEvent.name) {
                      updateEvent([ "title", fullEvent.name ]);
                    }
                    if (fullEvent.description) {
                      // Create a new div element
                      const tempDivElement = document.createElement("div");

                      // Set the HTML content with the given value
                      tempDivElement.innerHTML = fullEvent.description;

                      // Retrieve the text property of the element
                      updateEvent([ "description", tempDivElement.textContent ?? tempDivElement.innerText ?? "" ]);
                    }
                    if (fullEvent.startsOn) {
                      updateEvent([ "startTime", Timestamp.fromDate(DateTime.fromISO(fullEvent.startsOn).toJSDate()) ]);
                    }
                    if (fullEvent.endsOn) {
                      updateEvent([ "endTime", Timestamp.fromDate(DateTime.fromISO(fullEvent.endsOn).toJSDate()) ]);
                    }
                    if (fullEvent.address?.address) {
                      updateEvent([ "address", fullEvent.address.address ]);
                    }
                    if (fullEvent.imageUrl) {
                      updateEvent([ "image", [fullEvent.imageUrl] ]);
                    }

                    const links: {
                  url: string;
                  text: string;
                }[] = [
                  {
                    url: `https://uky.campuslabs.com/engage/event/${event.id}`,
                    text: "BBNvolved Page"
                  }
                ];
                    if (fullEvent.address?.onlineLocation) {
                      alert(JSON.stringify(fullEvent.address.onlineLocation));
                      links.push({
                        url: fullEvent.address?.onlineLocation,
                        text: fullEvent.address?.provider ?? "Online Event Url"
                      });
                    }
                    updateEvent([ "link", links ]);
                  });

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
  );
};
