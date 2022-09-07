import AdapterLuxon from "@date-io/luxon";
import { Delete } from "@mui/icons-material";
import { Box, Button, CircularProgress, IconButton, Paper, TextField, Typography } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { FirebaseStorage, ref, uploadBytes } from "firebase/storage";
import { DateTime } from "luxon";
import { useReducer, useRef, useState } from "react";
import { useFirestore, useStorage } from "reactfire";

import ImageSelect, { ImageSelectRef } from "../../components/ImageSelect";
import { FirestoreImage, isFirestoreImage } from "../../firebase/types";

type EventType = {
  title: string,
  description: string,
  startTime: Timestamp,
  endTime: Timestamp
  address?: string,
  image:( {
    file: File,
    width: number,
    height: number
  } | string | null)[],
  link: {
    url: string,
    text: string
  }[]
}

const normalizeImage = async (param: string | {
  file: File,
  width: number,
  height: number
}, storage: FirebaseStorage): Promise<FirestoreImage> => {
  if (typeof param === "string") {
    if (param.startsWith("http://") || param.startsWith("https://") || param.startsWith("gs://")) {
      const {
        width, height
      } = await findSizeOfLinkedImage(param);
      return {
        uri: param as `gs://${string}` | `http://${string}` | `https://${string}`,
        width,
        height
      };
    } else {
      throw new Error("Error, url must start with 'gs://', 'http://', or 'https://'");
    }
  } else {
    const uploadTaskSnapshot = await uploadBytes(ref(storage, "assets/events"), param.file);
    return {
      uri: uploadTaskSnapshot.ref.toString() as `gs://${string}`,
      width: param.width,
      height: param.height
    };
  }
};

const defaultEvent: EventType = { title: "", description: "", startTime: new Timestamp(DateTime.now().toSeconds(), 0), endTime: new Timestamp(DateTime.now().plus({ days: 1 }).toSeconds(), 0), image: [], link: [] };

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
  const imageSelectRef = useRef<ImageSelectRef>();

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
          if (event.image.length > 1) {
            const imageUploadPromises = event.image.filter((img) => img != null).map((img) => normalizeImage(img as Parameters<typeof normalizeImage>[0], storage));
            eventDocData.image = (await Promise.all(imageUploadPromises)).filter(isFirestoreImage);
          } else if (event.image.length === 1 && event.image[0] != null) {
            eventDocData.image = await normalizeImage(event.image[0], storage);
          }
        }
        await addDoc(eventsCollection, eventDocData);
        updateEvent("reset");
        imageSelectRef.current?.setImageMode(null);
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
        {event.link.map((thisLink, index) => (
          <Paper sx={{ display: "flex", flexDirection: "row", gap: "1em", padding: "1em" }} elevation={4} key={index}>
            <TextField
              disabled={isLoading}
              label="Link Text"
              value={thisLink?.text ?? ""}
              fullWidth
              onChange={({ target: { value } }) => updateEvent([ "link", event.link.slice(0, index).concat({ text: value, url: thisLink?.url ?? "" }).concat(event.link.slice(index + 1)) ])}
            />
            <TextField
              disabled={isLoading || thisLink == null}
              label="Link URL"
              value={thisLink?.url ?? ""}
              fullWidth
              onChange={({ target: { value } }) => updateEvent([ "link", event.link.slice(0, index).concat({ text: thisLink?.text ?? "", url: value }).concat(event.link.slice(index + 1)) ])}
            />
            <IconButton
              onClick={() => updateEvent([ "link", event.link.slice(0, index).concat(event.link.slice(index + 1)) ])}
            >
              <Delete />
            </IconButton>

          </Paper>
        ))}
        <Button
          onClick={() => updateEvent([ "link", [ ...event.link, { url: "", text: "" } ] ])}
          variant="outlined"
          color="secondary"
        >
            Add Link
        </Button>
        {event.image.map((thisImage, index) => (
          <Box key={index} sx={{ display: "flex", flexDirection: "row", gap: "1em" }}>
            <ImageSelect
              isLoading={isLoading}
              ref={imageSelectRef}
              onChange={(image) => updateEvent([ "image", event.image.slice(0, index).concat(image ?? null).concat(event.image.slice(index + 1)) ])}
              disabled={isLoading}
              value={thisImage ?? undefined}
            />
            <IconButton
              onClick={() => updateEvent([ "image", event.image.slice(0, index).concat(event.image.slice(index + 1)) ])}
            >
              <Delete />
            </IconButton>
          </Box>
        ))}
        <Button
          onClick={() => updateEvent([ "image", [ ...event.image, null ] ])}
          variant="outlined"
          color="secondary"
        >
            Add Image
        </Button>
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
