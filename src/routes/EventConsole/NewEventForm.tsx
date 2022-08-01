import AdapterLuxon from "@date-io/luxon";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { GeoPoint, Timestamp, addDoc, collection } from "firebase/firestore";
import { DateTime } from "luxon";
import { useReducer, useState } from "react";
import { useFirestore } from "reactfire";

type EventType = {
  title: string,
  description: string,
  startTime: Timestamp,
  endTime: Timestamp
  address?: string,
  position?: GeoPoint,
  image?: {
    uri: string,
    width: number,
    height: number
  }
}

const defaultEvent: EventType = { title: "", description: "", startTime: new Timestamp(DateTime.now().toSeconds(), 0), endTime: new Timestamp(DateTime.now().plus({ days: 1 }).toSeconds(), 0) };

const NewEventForm = () => {
  const [ isLoading, setIsLoading ] = useState(false);

  const [ event, updateEvent ] = useReducer((prev: EventType, action: [keyof EventType, EventType[keyof EventType]]) => {
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
        await addDoc(eventsCollection, event);
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
          disabled
          label="Address"
          value={event.address ?? ""}
          fullWidth onChange={({ target: { value } }) => updateEvent([ "address", value ?? undefined ])}
        />
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
