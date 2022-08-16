import AdapterLuxon from "@date-io/luxon";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { uploadBytes } from "firebase/storage";
import { DateTime } from "luxon";
import { useReducer, useState } from "react";
import { useFirestore } from "reactfire";

import ImageUpload from "../../components/ImageUpload";

type EventType = {
  title: string,
  description: string,
  startTime: Timestamp,
  endTime: Timestamp
  address?: string,
  image?: {
    file: File,
    width: number,
    height: number
  },
  link?: {
    url: string,
    text: string
  }
}

const defaultEvent: EventType = { title: "", description: "", startTime: new Timestamp(DateTime.now().toSeconds(), 0), endTime: new Timestamp(DateTime.now().plus({ days: 1 }).toSeconds(), 0) };

const NewEventForm = () => {
  const [ isLoading, setIsLoading ] = useState(false);

  const [ event, updateEvent ] = useReducer<(prev: EventType, action: [keyof EventType, EventType[keyof EventType]]) => EventType>((prev: EventType, action: [keyof EventType, EventType[keyof EventType]]) => {
    if (action[0] === "address" && (action[1] == null || typeof action[1] === "string")) {
      return { ...prev, address: action[1] };
    }
    return {
      ...prev,
      [action[0]]: action[1]
    };
  }, defaultEvent);


  const firestore = useFirestore();

  return (
    <form onSubmit={async (e) => {
      e.preventDefault();
      const eventsCollection = collection(firestore, "events");
      try {
        setIsLoading(true);
        const eventDocData: any = { ...event };
        delete eventDocData.image;
        if (event.image != null) {
          uploadBytes;
        }
        await addDoc(eventsCollection, eventDocData);
        Object.entries(defaultEvent).forEach((entry) => {
          updateEvent(entry as [keyof EventType, EventType[keyof EventType]]);
        });
      } catch (e) {
        alert(`Error adding event to Firestore:\n${JSON.stringify((e as any).message, undefined, 2)}`);
      } finally {
        setIsLoading(false);
      }
    }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "1em", my: "2em" }}>
        {isLoading && <CircularProgress
          sx={{
            display: "block",
            position: "fixed",
            zIndex: 1031, /* High z-index so it is on top of the page */
            top: "50%",
            right: "50%", /* Or: left: 50%; */
          }} />}
        <TextField
          disabled={isLoading}
          label="Event Title"
          required
          value={event.title ?? ""}
          onChange={({ target: { value } }) => updateEvent([ "title", value ?? undefined ])}
        />
        <TextField
          disabled={isLoading}
          label="Description" required value={event.description ?? ""}
          multiline fullWidth
          onChange={({ target: { value } }) => updateEvent([ "description", value ?? undefined ])}
        />
        <Box sx={{ display: "flex", flexDirection: "row", gap: "1em" }}>
          <LocalizationProvider dateAdapter={AdapterLuxon} >
            <DateTimePicker
              disabled={isLoading}
              renderInput={(props) => <TextField fullWidth {...props} />}
              label="Start Time" value={DateTime.fromMillis(event.startTime.toMillis())}
              maxDateTime={DateTime.fromMillis(event.endTime.toMillis())}
              disablePast
              onChange={(value) => updateEvent([ "startTime", value != null ? Timestamp.fromMillis(value.toMillis()) : undefined ])}
            />
            <DateTimePicker
              disabled={isLoading}
              renderInput={(props) => <TextField fullWidth {...props} />}
              label="End Time" value={DateTime.fromMillis(event.endTime.toMillis())}
              minDateTime={DateTime.fromMillis(event.startTime.toMillis())}
              disablePast
              onChange={(value) => updateEvent([ "endTime", value != null ? Timestamp.fromMillis(value.toMillis()) : undefined ])}
            />
          </LocalizationProvider>
        </Box>
        <TextField
          disabled={isLoading}
          label="Address"
          value={event.address ?? ""}
          fullWidth
          onChange={({ target: { value } }) => updateEvent([ "address", value ?? undefined ])}
        />
        <TextField
          disabled={isLoading}
          label="Link Text"
          value={event.link?.text ?? ""}
          fullWidth
          // eslint-disable-next-line no-constant-binary-expression
          onChange={({ target: { value } }) => updateEvent([ "link", { text: value, url: event.link?.url ?? "" } ?? undefined ])}
        />
        <TextField
          disabled={isLoading || event.link == null}
          label="Link URL"
          value={event.link?.url ?? ""}
          fullWidth
          // eslint-disable-next-line no-constant-binary-expression
          onChange={({ target: { value } }) => updateEvent([ "link", { text: event.link?.text ?? "", url: value } ?? undefined ])}
        />
        <ImageUpload onUploaded={(file, {
          width, height
        }) => {
          if (file != null) {
            updateEvent([ "image", { file, width, height } ]);
          }
        }} />
        <Button
          disabled={isLoading}
          variant="contained"
          color="primary"
          type="submit"
        >
          Create
        </Button>
      </Box>
    </form>
  );
};

export default NewEventForm;
