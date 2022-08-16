import AdapterLuxon from "@date-io/luxon";
import { Box, Button, CircularProgress, Paper, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { DateTime } from "luxon";
import { useReducer, useState } from "react";
import { useFirestore, useStorage } from "reactfire";

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
  } | string,
  link?: {
    url: string,
    text: string
  }
}

const defaultEvent: EventType = { title: "", description: "", startTime: new Timestamp(DateTime.now().toSeconds(), 0), endTime: new Timestamp(DateTime.now().plus({ days: 1 }).toSeconds(), 0) };

function findSizeOfLinkedImage(url: string): Promise<{ width: number; height: number; }> {
  return new Promise<{ width: number, height: number }>((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = (err) => {
      reject(err);
    };
    image.src = url;
  });
}

const NewEventForm = () => {
  const [ isLoading, setIsLoading ] = useState(false);
  const [ imageMode, setImageMode ] = useState<null | "url" | "upload">(null);

  const [ event, updateEvent ] = useReducer<(prev: EventType, action: [keyof EventType, EventType[keyof EventType]] | "reset") => EventType>((prev, action) => {
    if (action === "reset") {
      return defaultEvent;
    }
    if (action[0] === "address" && (action[1] == null || typeof action[1] === "string")) {
      return { ...prev, address: action[1] };
    }
    return {
      ...prev,
      [action[0]]: action[1]
    };
  }, defaultEvent);

  const firestore = useFirestore();
  const storage = useStorage();

  return (
    <form onSubmit={async (e) => {
      e.preventDefault();
      const eventsCollection = collection(firestore, "events");
      try {
        setIsLoading(true);
        const eventDocData: any = { ...event, image: undefined };

        if (event.image != null) {
          if (typeof event.image === "string") {
            const {
              width, height
            } = await findSizeOfLinkedImage(event.image);
            eventDocData.image = {
              uri: event.image,
              width,
              height
            };
          } else {
            const uploadTaskSnapshot = await uploadBytes(ref(storage, "assets/events"), event.image.file);
            eventDocData.image = {
              uri: uploadTaskSnapshot.ref.toString(),
              width: event.image?.width,
              height: event.image?.height
            };
          }
        }
        await addDoc(eventsCollection, eventDocData);
        updateEvent("reset");
        setImageMode(null);
      } catch (e) {
        alert(`Error adding event to Firestore:\n${JSON.stringify((e as any).message, undefined, 2)}`);
      } finally {
        setIsLoading(false);
      }
    }}>
      <Paper sx={{ display: "flex", flexDirection: "column", gap: "1em", my: "2em", mx: "1em", p: "1.5em" }} elevation={3}>
        {isLoading && <CircularProgress
          sx={{
            display: "block",
            position: "fixed",
            zIndex: 1031, /* High z-index so it is on top of the page */
            top: "50%",
            right: "50%", /* Or: left: 50%; */
          }} />}
        <Typography variant="h5">Add a New Event</Typography>
        <TextField
          disabled={isLoading}
          label="Event Title"
          required
          value={event.title ?? ""}
          onChange={({ target: { value } }) => updateEvent([ "title", value.length > 0 ? value : undefined ])}
        />
        <TextField
          disabled={isLoading}
          label="Description" required
          value={event.description ?? ""}
          multiline
          fullWidth
          onChange={({ target: { value } }) => updateEvent([ "description", value.length > 0 ? value : undefined ])}
        />
        <Box sx={{ display: "flex", flexDirection: "row", gap: "1em" }}>
          <LocalizationProvider dateAdapter={AdapterLuxon} >
            <DateTimePicker
              disabled={isLoading}
              renderInput={(props) => <TextField fullWidth {...props} />}
              label="Start Time" value={DateTime.fromMillis(event.startTime.toMillis())}
              disablePast
              onChange={(value) => {
                if (value != null && event.endTime.toMillis() < value.toMillis()) {
                  updateEvent([ "endTime", Timestamp.fromMillis(value.plus({ hours: 1 }).toMillis()) ]);
                }
                updateEvent([ "startTime", value != null ? Timestamp.fromMillis(value.toMillis()) : undefined ]);
              }}
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
          onChange={({ target: { value } }) => updateEvent([ "address", value.length > 0 ? value : undefined ])}
        />
        <Paper sx={{ display: "flex", flexDirection: "row", gap: "1em", padding: "1em" }} elevation={4}>
          <TextField
            disabled={isLoading}
            label="Link Text"
            value={event.link?.text ?? ""}
            fullWidth
            onChange={({ target: { value } }) => updateEvent([ "link", { text: value, url: event.link?.url ?? "" } ])}
          />
          <TextField
            disabled={isLoading || event.link == null}
            label="Link URL"
            value={event.link?.url ?? ""}
            fullWidth
            onChange={({ target: { value } }) => updateEvent([ "link", { text: event.link?.text ?? "", url: value } ])}
          />
        </Paper>
        <Paper sx={{ display: "flex", flexDirection: "column", gap: "1em", padding: "1em" }} elevation={4}>
          <Box sx={{ display: "flex", gap: "1em", padding: "1em" }}>
            <ToggleButtonGroup
              value={imageMode}
              exclusive
              onChange={(_, val) => {
                updateEvent([ "image", undefined ]);
                setImageMode(val);
              }}
              aria-label="text alignment"
            >
              <ToggleButton value="upload">
              Upload
              </ToggleButton>
              <ToggleButton value="url">
              Link
              </ToggleButton>
            </ToggleButtonGroup>
            <Typography>
              When possible, prefer the link option as it saves us a few cents of storage (basically, avoid downloading an image from a website and re-uploading here, just put the image&apos;s URL in the link field).
            </Typography>
          </Box>

          {
            imageMode === "upload" && <ImageUpload onUploaded={(file, {
              width, height
            }) => {
              if (file != null) {
                updateEvent([ "image", { file, width, height } ]);
              }
            }} />
          }
          {
            imageMode === "url" && <TextField
              disabled={isLoading}
              label="Image URL"
              value={event.image ?? ""}
              fullWidth
              onChange={({ target: { value } }) => updateEvent([ "image", value.length > 0 ? value : undefined ])}
            />
          }
        </Paper>
        <Button
          disabled={isLoading}
          variant="contained"
          color="primary"
          type="submit"
        >
          Create
        </Button>
      </Paper>
    </form>
  );
};

export default NewEventForm;
