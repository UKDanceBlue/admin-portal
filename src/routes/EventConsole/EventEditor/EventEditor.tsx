import { Delete } from "@mui/icons-material";
import { Button, IconButton, Paper, TextField as TextFieldBase, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { DateTimePicker } from "@mui/x-date-pickers";
import { Wysimark, useEditor } from "@wysimark/react";
import { Timestamp } from "firebase/firestore";
import { FirebaseStorage, ref, uploadBytes } from "firebase/storage";
import { DateTime } from "luxon";
import { useCallback, useRef } from "react";
import { useStorage } from "reactfire";

import ImageSelect, { ImageSelectModeRef } from "../../../components/ImageSelect";
import { useFormReducer } from "../../../customHooks";
import { FirestoreImage } from "../../../firebase/types";
import { RawFirestoreEvent } from "../../../firebase/types/FirestoreEvent";

type RawFirestoreEventWithNullableImage = Omit<RawFirestoreEvent, "image"> & {
  image?: FirestoreImage | (FirestoreImage | null)[];
};

const FormTextField = (props: Parameters<typeof TextFieldBase>[0] & {eventReducer: ReturnType<typeof useFormReducer<RawFirestoreEventWithNullableImage>>} & {name: keyof RawFirestoreEvent}) => {
  if (props.name == null) {
    throw new Error("FormTextField requires a name prop");
  }

  const [ [ event, updateEvent ], errors ] = props.eventReducer;

  let { helperText } = props;
  if (typeof errors[props.name] === "string") {
    helperText = errors[props.name];
  }

  return (
    <TextFieldBase
      {...Object.fromEntries(Object.entries(props).filter(([key]) => key !== "eventReducer"))}
      value={event[props.name]}
      onChange={(e) => updateEvent([ "update", [ "title", e.target.value ] ])}
      error={errors[props.name] != null}
      helperText={helperText}
      margin="dense"
      fullWidth
    />
  );
};

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

export const normalizeImage = async (param: string | {
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


export const EventEditor = (
  {
    initialData, onEventSaved, disabled = false, resetMe
  }:
  {
    initialData?: RawFirestoreEvent;
    onEventSaved?: (event: RawFirestoreEvent) => void;
    disabled?: boolean;
    resetMe?: () => void;
  }
) => {
  const now = DateTime.now().startOf("minute");

  const fbStorage = useStorage();
  const imageSelectModeRef = useRef<ImageSelectModeRef>();

  const editor = useEditor({ initialMarkdown: initialData?.description ?? "" }, [initialData?.description]);

  const eventReducer = useFormReducer<RawFirestoreEventWithNullableImage>(initialData ?? { title: "", description: "" }, (event) => {
    const errors: Partial<Record<keyof RawFirestoreEvent, string>> = {};

    if (event.title !== "" && event.title.trim() === "") {
      errors.title = "Title is required";
    }

    if (event.startTime == null) {
      errors.startTime = "Start time is required";
    }

    if (event.endTime == null) {
      errors.endTime = "End time is required";
    }

    if (event.startTime != null && event.endTime != null && event.startTime >= event.endTime) {
      errors.endTime = "End time must be after start time";
    }

    if (event.description !== "" && event.description.trim() === "") {
      errors.description = "Description is required";
    }

    return errors;
  });

  const [[ event, updateEventBase ]] = eventReducer;

  const updateEvent = useCallback(
    (action: Parameters<typeof updateEventBase>[0]): ReturnType<typeof updateEventBase> => {
      if (action[0] === "update" && action[1][1] === "" && action[1][0] !== "description" && action[1][0] !== "title") {
        return updateEventBase([ "update", [ action[1][0], undefined ] ]);
      } else {
        return updateEventBase(action);
      }
    },
    [updateEventBase]
  );

  const eventImages = Array.isArray(event.image)
    ? event.image
    : (
      event.image == null
        ? []
        : [event.image]
    );
  const eventLinks = Array.isArray(event.link)
    ? event.link
    : (
      event.link == null
        ? []
        : [event.link]
    );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        // Need to remove any nulls from the event's image array before we try to save it
        const eventToSave: RawFirestoreEvent = {
          ...event,
          image: eventImages.filter((image) => image != null) as Exclude<typeof eventImages[number], null>[],
        };
        onEventSaved?.(eventToSave);
      }}
      onReset={resetMe ? () => {
        if (confirm("Are you sure you want to reset?")) {
          resetMe();
        }
      } : undefined}
    >
      <FormTextField
        label="Title"
        name="title"
        required
        disabled={disabled}
        eventReducer={eventReducer}
      />
      <FormTextField
        label="Short Description"
        name="shortDescription"
        helperText="This will be displayed on the event's card"
        disabled={disabled}
        eventReducer={eventReducer}
      />
      <FormTextField
        label="Address"
        name="address"
        helperText="Make sure the address works in Google Maps"
        disabled={disabled}
        eventReducer={eventReducer}
      />
      <Box sx={{ display: "flex", flexDirection: "row", gap: "1em" }}>
        <DateTimePicker
          disableMaskedInput
          disabled={disabled}
          renderInput={(props) => <TextFieldBase margin="dense" fullWidth {...props} />}
          label="Start Time" value={DateTime.fromMillis((event.startTime?.toMillis()?? now.toMillis()))}
          disablePast
          onChange={(value) => {
            if (value != null && (event.endTime?.toMillis() ?? now.toMillis()) < value.toMillis()) {
              updateEvent([ "update", [ "endTime", Timestamp.fromMillis(value.plus({ hours: 1 }).toMillis()) ] ]);
            }
            updateEvent([ "update", [ "startTime", value != null ? Timestamp.fromMillis(value.toMillis()) : undefined ] ]);
          }}
        />
        <DateTimePicker
          disableMaskedInput
          disabled={disabled}
          renderInput={(props) => <TextFieldBase margin="dense" fullWidth {...props} />}
          label="End Time" value={DateTime.fromMillis((event.endTime?.toMillis() ?? now.toMillis()))}
          minDateTime={DateTime.fromMillis((event.startTime?.toMillis() ?? now.toMillis()))}
          disablePast
          onChange={(value) => updateEvent([ "update", [ "endTime", value != null ? Timestamp.fromMillis(value.toMillis()) : undefined ] ])}
        />
      </Box>
      <Typography mt={2}>
        Full Description:
      </Typography>
      <Wysimark
        editor={editor}
        onChange={(value) => value.getMarkdown() !== event.description && updateEvent([ "update", [ "description", value.getMarkdown() ] ])}
      />
      <Paper sx={{ display: "flex", flexDirection: "column", gap: "1em", my: "1em", mx: "1em", p: "1.5em" }} elevation={3}>
        {eventLinks.map((thisLink, index) => (
          <Paper sx={{ display: "flex", flexDirection: "row", gap: "1em", padding: "1em" }} elevation={4} key={index}>
            <TextFieldBase
              required
              disabled={disabled}
              label="Link Text"
              value={thisLink?.text ?? ""}
              fullWidth
              onChange={({ target: { value } }) => updateEvent([ "update", [ "link", eventLinks.slice(0, index).concat({ text: value, url: thisLink?.url ?? "" }).concat(eventLinks.slice(index + 1)) ] ])}
            />
            <TextFieldBase
              required
              disabled={disabled || thisLink == null}
              label="Link URL"
              value={thisLink?.url ?? ""}
              fullWidth
              onChange={({ target: { value } }) => updateEvent([ "update", [ "link", eventLinks.slice(0, index).concat({ text: thisLink?.text ?? "", url: value }).concat(eventLinks.slice(index + 1)) ] ])}
            />
            <IconButton
              onClick={() => updateEvent([ "update", [ "link", eventLinks.slice(0, index).concat(eventLinks.slice(index + 1)) ] ])}
            >
              <Delete />
            </IconButton>

          </Paper>
        ))}
        <Button
          onClick={() => updateEvent([ "update", [ "link", [ ...eventLinks, { url: "", text: "" } ] ] ])}
          variant="outlined"
          color="secondary"
        >
        Add Link
        </Button>
        {eventImages.map((thisImage, index) => {
          let initialValue: HTMLImageElement | string | undefined;
          if (thisImage?.uri.startsWith("http")) {
            initialValue = new Image();
            initialValue.src = thisImage?.uri ?? "";
          } else {
            initialValue = thisImage?.uri;
          }

          return (
            <Box key={index} sx={{ display: "flex", flexDirection: "row", gap: "1em" }}>
              <ImageSelect
                isLoading={disabled}
                modeRef={imageSelectModeRef}
                onChange={(image) => {
                  if (image == null) {
                    updateEvent( [ "update", [ "image", eventImages.slice(0, index).concat(null).concat(eventImages.slice(index + 1)) ] ] );
                  } else {
                    normalizeImage(image, fbStorage)
                      .then((normalizedImage) => {
                        updateEvent([ "update", [ "image", eventImages.slice(0, index).concat(normalizedImage).concat(eventImages.slice(index + 1)) ] ] );
                      })
                      .catch((error) => {
                        console.error(error);
                        alert("Error uploading image");
                      });
                  }
                }}
                disabled={disabled}
                initialValue={initialValue}
              />
              <IconButton
                onClick={() => updateEvent([ "update", [ "image", eventImages.slice(0, index).concat(eventImages.slice(index + 1)) ] ])}
              >
                <Delete />
              </IconButton>
            </Box>
          );
        })}
        <Button
          onClick={() => {
            const newImages: (FirestoreImage | null)[] = [ ...eventImages, null ];
            updateEvent([ "update", [ "image", newImages ] ]);
          }}
          variant="outlined"
          color="secondary"
        >
        Add Image
        </Button>
      </Paper>

      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <div></div>
        <Box sx={{ display: "flex", gap: "1em", justifyContent: "flex-end" }}>
          {resetMe && (
            <Button
              type="reset"
              variant="contained"
              color="error"
              disabled={disabled}
              sx={{ mt: 2 }}
            >
              Reset
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={disabled || Object.keys(eventReducer[1]).length > 0 ||event.title == null || event.description == null}
            sx={{ mt: 2 }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </form>
  );
};
