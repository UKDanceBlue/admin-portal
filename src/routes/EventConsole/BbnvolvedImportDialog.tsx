import { Box, Button, Dialog, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Timestamp } from "firebase/firestore";
import { DateTime } from "luxon";
import { useEffect, useRef, useState } from "react";
import { useFunctions, useStorage } from "reactfire";
import TurndownService from "turndown";

import { getEvent } from "../../bbnvolved/event-get";
import { ListedEvent, listEvents } from "../../bbnvolved/event-search";
import { useLoading } from "../../components/LoadingWrapper";
import { RawFirestoreEvent } from "../../firebase/types/FirestoreEvent";

import { normalizeImage } from "./EventEditor/EventEditor";

function htmlToMarkdown(html: string): string {
  const turndownService = new TurndownService();
  return turndownService.turndown(html);
}

/**
 * Gets and displays a list of BBNvolved events using bbnvolved/event-search.ts
*/
export const BbnvolvedImportDialog = ({
  open, setFilledEvent, onClose,
}: {open:boolean, setFilledEvent?: (event: RawFirestoreEvent) => void, onClose: () => void}) => {
  const loaded = useRef(false);
  const [ , setIsLoading ] = useLoading();
  const [ events, setEvents ] = useState<ListedEvent[]>([]);
  const functions = useFunctions();
  const storage = useStorage();

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
            events.map((listedEvent) => (
              <Box key={listedEvent.id} sx={{ flexDirection: "row" }} component="li">
                <Box sx={{ flex: 2 }}>
                  {listedEvent.name}
                </Box>
                <Button sx={{ flex: 1 }} onClick={() => {
                  if (!listedEvent.id) {
                    return;
                  }
                  getEvent({ id: listedEvent.id, functions }).then(async (fullEvent) => {
                    if (!setFilledEvent || !fullEvent.name || !fullEvent.description) {
                      alert("Something went wrong. Please try again later.");
                      console.error("One of setFilledEvent, fullEvent.name, or fullEvent.description was falsy in BbnvolvedImportDialog");
                      return;
                    }
                    const createdEvent: RawFirestoreEvent = {
                      title: fullEvent.name,
                      description: htmlToMarkdown(fullEvent.description),
                    };
                    if (fullEvent.startsOn) {
                      createdEvent.startTime = Timestamp.fromDate(DateTime.fromISO(fullEvent.startsOn).toJSDate());
                    }
                    if (fullEvent.endsOn) {
                      createdEvent.endTime = Timestamp.fromDate(DateTime.fromISO(fullEvent.endsOn).toJSDate());
                    }
                    if (fullEvent.address?.address) {
                      createdEvent.address = fullEvent.address.address;
                    }
                    if (fullEvent.imageUrl) {
                      createdEvent.image = [await normalizeImage(`${fullEvent.imageUrl}?preset=large-w`, storage)];
                    }

                    const links: {
                      url: string;
                      text: string;
                    }[] = [
                      {
                        url: `https://uky.campuslabs.com/engage/event/${listedEvent.id}`,
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
                    createdEvent.link = links;

                    setFilledEvent(createdEvent);
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
