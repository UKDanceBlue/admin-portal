import { Box, Checkbox, FormControlLabel, FormGroup, Paper, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { NotificationFormPendingState } from ".";

const ComposePage = ({
  pendingState,
  handlePageUpdated,
}: {
  pendingState: NotificationFormPendingState;
  handlePageUpdated: (changedContent: NotificationFormPendingState) => void;
}) => {
  const [ notificationTitle, setNotificationTitle ] = useState(pendingState.notificationTitle ?? "");
  const [ notificationBody, setNotificationBody ] = useState(pendingState.notificationBody ?? "");
  const [ notificationPayload, setNotificationPayload ] = useState<typeof pendingState["notificationPayload"]>(
    pendingState.notificationPayload ?? {}
  );
  const [ dryRun, setDryRun ] = useState(pendingState.dryRun ?? false);

  useEffect(() => {
    const validNotificationPayload: NotificationFormPendingState["notificationPayload"] = {};

    if ((notificationPayload?.url?.length ?? 0) > 0) {
      // @ts-expect-error
      validNotificationPayload.url = notificationPayload.url;
    }
    if (notificationPayload?.textPopup != null && (notificationPayload.textPopup.title?.length ?? 0) > 0 && (notificationPayload.textPopup.message?.length ?? 0) > 0) {
      validNotificationPayload.textPopup = notificationPayload.textPopup;
    }
    // @ts-expect-error
    if ((notificationPayload?.webviewSource?.uri?.length ?? 0) > 0) {
      // @ts-expect-error
      validNotificationPayload.webviewSource = notificationPayload.webviewSource;
    }

    handlePageUpdated({
      notificationTitle,
      notificationBody,
      notificationPayload: validNotificationPayload,
      dryRun,
    });
  }, [
    handlePageUpdated, notificationTitle, notificationBody, notificationPayload, dryRun
  ]);

  // TODO validate length of title and body

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <TextField
        sx={{ width: "90%", mt: "1rem" }}
        label="Notification Title"
        value={notificationTitle}
        onChange={(event) => {
          setNotificationTitle(event.target.value);
        }}
        required
      />
      <TextField
        sx={{ width: "90%", mt: "1rem" }}
        label="Notification Body"
        value={notificationBody}
        onChange={(event) => {
          setNotificationBody(event.target.value);
        }}
        required
      />
      <Paper
        sx={{
          width: "90%",
          mt: "1rem",
          p: "1rem",
          borderRadius: "0.5rem",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="body2">
          Notification Payload (stuff that happens when you click it)
          <br/>
          <i>All Optional</i>
        </Typography> {/* An editor that allows entering a url (to launch the app to), a message object (as defined in notificationPayload's type) and a webviewSource object (also in notificationPayload's type) */}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Paper
            sx={{
              width: "100%",
              mt: "1rem",
              p: "1rem",
              borderRadius: "0.5rem",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <TextField
              sx={{ width: "100%" }}
              label="Link to open on click"
              value={notificationPayload?.url ?? ""}
              onChange={(event) => {
                setNotificationPayload({ ...notificationPayload, url: event.target.value });
              }
              }
            />
          </Paper>
          <Paper
            sx={{
              width: "100%",
              mt: "1rem",
              p: "1rem",
              borderRadius: "0.5rem",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography variant="body2">
              Message
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <TextField
                sx={{ width: "100%", mt: "1rem" }}
                label="Title"
                value={notificationPayload?.textPopup?.title ?? ""}
                onChange={(event) => {
                  setNotificationPayload({
                    ...notificationPayload,
                    textPopup: {
                      ...notificationPayload?.textPopup,
                      title: event.target.value,
                    },
                  });
                }}
              />
              <TextField
                sx={{ width: "100%", mt: "1rem" }}
                label="Body"
                value={notificationPayload?.textPopup?.message ?? ""}
                onChange={(event) => {
                  setNotificationPayload({
                    ...notificationPayload,
                    textPopup: {
                      ...notificationPayload?.textPopup,
                      message: event.target.value,
                    },
                  });
                }}
              />
            </Box>
          </Paper>
          <Paper
            sx={{
              width: "100%",
              mt: "1rem",
              p: "1rem",
              borderRadius: "0.5rem",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography variant="body2">
                Webview Source
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <TextField
                sx={{ width: "100%", mt: "1rem" }}
                label="Url"
                value={(notificationPayload?.webviewPopup as any)?.uri ?? ""} // THIS COULD CAUSE TYPE ERRORS
                onChange={(event) => {
                  setNotificationPayload({
                    ...notificationPayload,
                    webviewPopup: { uri: event.target.value },
                  });
                }}
              />
            </Box>
          </Paper>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={dryRun ?? false}
                  onChange={(event) => {
                    setDryRun(event.target.checked);
                  }}
                  name="dryRun"
                />
              }
              label="Dry Run"
            />
          </FormGroup>
        </Box>
      </Paper>
    </Box>
  );
};

export default ComposePage;
