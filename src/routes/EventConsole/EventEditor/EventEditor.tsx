import { Button, TextField as TextFieldBase, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { DateTimePicker } from "@mui/x-date-pickers";
import { Wysimark, useEditor } from "@wysimark/react";
import { Timestamp } from "firebase/firestore";
import { DateTime } from "luxon";
import { useCallback } from "react";

import { useFormReducer } from "../../../customHooks";
import { RawFirestoreEvent } from "../../../firebase/types/FirestoreEvent";

const FormTextField = (props: Parameters<typeof TextFieldBase>[0] & {eventReducer: ReturnType<typeof useFormReducer<RawFirestoreEvent>>} & {name: keyof RawFirestoreEvent}) => {
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
      {...({ ...props, eventReducer: undefined })}
      value={event[props.name]}
      onChange={(e) => updateEvent([ "update", [ "title", e.target.value ] ])}
      error={errors[props.name] != null}
      helperText={helperText}
      margin="dense"
      fullWidth
    />
  );
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

  const editor = useEditor({ initialMarkdown: initialData?.description ?? "" }, [initialData?.description]);

  const eventReducer = useFormReducer<RawFirestoreEvent>(initialData ?? { title: "", description: "" }, (event) => {
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

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onEventSaved?.(event);
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
          renderInput={(props) => <TextFieldBase margin="dense" required fullWidth {...props} />}
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
          renderInput={(props) => <TextFieldBase margin="dense" required fullWidth {...props} />}
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
        onChange={(value) => updateEvent([ "update", [ "description", value.getMarkdown() ] ])}
      />

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
