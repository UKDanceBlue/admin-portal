import { Delete } from "@mui/icons-material";
import { Button, IconButton, Paper, TextField as TextFieldBase, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { DateTimePicker } from "@mui/x-date-pickers";
import { FirestoreEvent, FirestoreEventJson, FirestoreImageJson, FirestoreMetadata } from "@ukdanceblue/db-app-common";
import { hasFirestoreMetadata } from "@ukdanceblue/db-app-common/dist/firestore/internal";
import { useFormReducer } from "@ukdanceblue/db-app-common/dist/util/formReducer";
import { Wysimark, useEditor } from "@wysimark/react";
import { Timestamp } from "firebase/firestore";
import { FirebaseStorage, ref, uploadBytes } from "firebase/storage";
import { DateTime } from "luxon";
import { useCallback, useRef } from "react";
import { useStorage } from "reactfire";

import ImageSelect, { ImageSelectModeRef } from "../../../components/ImageSelect";

type FirestoreEventJsonWithNullableImage = FirestoreEventJson & {
  images?: (FirestoreImageJson | null)[];
};

function filterNullImages(event: FirestoreEventJsonWithNullableImage): FirestoreEventJson {
  return {
    ...event,
    images: event.images == null ? [] : (event.images.filter((image) => image != null) as NonNullable<(typeof event.images)[number]>[]),
  };
}

const FormTextField = (props: Parameters<typeof TextFieldBase>[0] & {eventReducer: ReturnType<typeof useFormReducer<FirestoreEventJsonWithNullableImage>>} & {name: keyof FirestoreEventJson}) => {
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
      onChange={(e) => updateEvent([ "update", [ props.name, e.target.value ] ])}
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
}, storage: FirebaseStorage): Promise<FirestoreImageJson> => {
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

function valueForDateTimePicker(value: unknown, inAnHour?: boolean): DateTime | null {
  if (value instanceof Timestamp) {
    return DateTime.fromJSDate(value.toDate());
  } else if (inAnHour) {
    return DateTime.now().plus({ hours: 1 });
  } else {
    return DateTime.now();
  }
}


export const EventEditor = (
  {
    initialData, onEventSaved, disabled = false, resetMe
  }:
  {
    initialData?: FirestoreEventJson;
    onEventSaved?: (event: FirestoreEventJson) => void;
    disabled?: boolean;
    resetMe?: () => void;
  }
) => {
  const now = DateTime.now().startOf("minute");

  const fbStorage = useStorage();
  const imageSelectModeRef = useRef<ImageSelectModeRef>();

  const editor = useEditor({ initialMarkdown: initialData?.description ?? "" }, [initialData?.description]);

  const eventReducer = useFormReducer<FirestoreEventJsonWithNullableImage>(initialData ?? { name: "", shortDescription: "", description: "" }, (event) => {
    return FirestoreEvent.whatIsWrongWithThisJson(event) ?? {};
  });

  const [[ event, updateEventBase ]] = eventReducer;

  const updateEvent = useCallback(
    (action: Parameters<typeof updateEventBase>[0]): ReturnType<typeof updateEventBase> => {
      if (action[0] === "update" && action[1][0] === "description") {
        // We ignore description to let slate handle it's own state, the value is extracted in the onSubmit method
        return;
      } else if (action[0] === "update" && action[1][1] === "" && action[1][0] !== "name" && action[1][0] !== "shortDescription" && action[1][0] !== "description") {
        return updateEventBase([ "remove-field", action[1][0] ]);
      } else {
        return updateEventBase(action);
      }
    },
    [updateEventBase]
  );

  const eventImages: (FirestoreImageJson | null)[] = Array.isArray(event.images)
    ? event.images
    : (
      event.images == null
        ? []
        : [event.images]
    );
  const eventLinks = Array.isArray(event.highlightedLinks)
    ? event.highlightedLinks
    : (
      event.highlightedLinks == null
        ? []
        : [event.highlightedLinks]
    );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        const existingMetadata: FirestoreMetadata = hasFirestoreMetadata(event) ? event.__meta : {};
        existingMetadata.schemaVersion = 1;

        // Set the schema version and grab the markdown
        const completeEvent: FirestoreEventJson = {
          ...event,
          __meta: existingMetadata,
          description: editor.getMarkdown()
        };

        // Need to remove any nulls from the event's image array before we try to save it
        onEventSaved?.(filterNullImages(completeEvent));
      }}
      onReset={resetMe ? () => {
        if (confirm("Are you sure you want to reset?")) {
          resetMe();
        }
      } : undefined}
    >
      <FormTextField
        label="Event Name"
        name="name"
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
          label="Start Time"
          value={valueForDateTimePicker(event.interval?.start)}
          disablePast
          onChange={(value) => {
            const currentInterval = event.interval;
            if (value != null && currentInterval != null) {
              if ((currentInterval?.start?.toMillis() ?? now.toMillis()) < value.toMillis()) {
                const newInterval = {
                  start: Timestamp.fromDate(value.toJSDate()),
                  end: currentInterval.end
                };
                updateEvent([ "update", [ "interval", newInterval ] ]);
              } else {
                alert("Start time must be before end time");

                updateEvent([
                  "update", [
                    "interval", {
                      start: currentInterval.start,
                      end: currentInterval.end
                    }
                  ]
                ]);
              }
            } else if (currentInterval != null) {
              updateEvent([
                "update", [
                  "interval", {
                    start: currentInterval.start,
                    end: currentInterval.end
                  }
                ]
              ]);
            } else if (value != null) {
              updateEvent([
                "update", [
                  "interval", {
                    start: Timestamp.fromDate(value.toJSDate()),
                    end: Timestamp.fromDate(value.plus({ hours: 1 }).toJSDate())
                  }
                ]
              ]);
            } else {
              updateEvent([ "remove-field", "interval" ]);
            }
          }}
        />
        <DateTimePicker
          disableMaskedInput
          disabled={disabled}
          renderInput={(props) => <TextFieldBase margin="dense" fullWidth {...props} />}
          label="End Time"
          value={valueForDateTimePicker(event.interval?.end)}
          minDateTime={DateTime.fromMillis((event.interval?.start?.toMillis() ?? now.toMillis()))}
          disablePast
          onChange={(value) => {
            const currentInterval = event.interval;
            if (value != null && currentInterval != null) {
              if ((currentInterval?.end?.toMillis() ?? now.toMillis()) < value.toMillis()) {
                const newInterval = {
                  end: Timestamp.fromDate(value.toJSDate()),
                  start: currentInterval.start
                };
                updateEvent([ "update", [ "interval", newInterval ] ]);
              } else {
                alert("end time must be before start time");

                updateEvent([
                  "update", [
                    "interval", {
                      end: currentInterval.end,
                      start: currentInterval.start
                    }
                  ]
                ]);
              }
            } else if (currentInterval != null) {
              updateEvent([
                "update", [
                  "interval", {
                    end: currentInterval.end,
                    start: currentInterval.start
                  }
                ]
              ]);
            } else if (value != null) {
              updateEvent([
                "update", [
                  "interval", {
                    end: Timestamp.fromDate(value.toJSDate()),
                    start: Timestamp.fromDate(value.plus({ hours: 1 }).toJSDate())
                  }
                ]
              ]);
            } else {
              updateEvent([ "remove-field", "interval" ]);
            }
          }}
        />
      </Box>
      <Typography mt={2}>
        Full Description:
      </Typography>
      <Wysimark
        editor={editor}
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
              onChange={({ target: { value } }) => updateEvent([ "update", [ "highlightedLinks", eventLinks.slice(0, index).concat({ text: value, url: thisLink?.url ?? "" }).concat(eventLinks.slice(index + 1)) ] ])}
            />
            <TextFieldBase
              required
              disabled={disabled || thisLink == null}
              label="Link URL"
              value={thisLink?.url ?? ""}
              fullWidth
              onChange={({ target: { value } }) => updateEvent([ "update", [ "highlightedLinks", eventLinks.slice(0, index).concat({ text: thisLink?.text ?? "", url: value }).concat(eventLinks.slice(index + 1)) ] ])}
            />
            <IconButton
              onClick={() => updateEvent([ "update", [ "highlightedLinks", eventLinks.slice(0, index).concat(eventLinks.slice(index + 1)) ] ])}
            >
              <Delete />
            </IconButton>

          </Paper>
        ))}
        <Button
          onClick={() => updateEvent([ "update", [ "highlightedLinks", [ ...eventLinks, { url: "", text: "" } ] ] ])}
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
                    updateEvent( [ "update", [ "images", eventImages.slice(0, index).concat(null).concat(eventImages.slice(index + 1)) ] ] );
                  } else {
                    normalizeImage(image, fbStorage)
                      .then((normalizedImage) => {
                        updateEvent([ "update", [ "images", eventImages.slice(0, index).concat(normalizedImage).concat(eventImages.slice(index + 1)) ] ] );
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
                onClick={() => updateEvent([ "update", [ "images", eventImages.slice(0, index).concat(eventImages.slice(index + 1)) ] ])}
              >
                <Delete />
              </IconButton>
            </Box>
          );
        })}
        <Button
          onClick={() => {
            const newImages: (FirestoreImageJson | null)[] = [ ...eventImages, null ];
            updateEvent([ "update", [ "images", newImages ] ]);
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
            disabled={disabled || Object.keys(eventReducer[1]).length > 0 || event.name == null || event.shortDescription == null || event.description == null}
            sx={{ mt: 2 }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </form>
  );
};
