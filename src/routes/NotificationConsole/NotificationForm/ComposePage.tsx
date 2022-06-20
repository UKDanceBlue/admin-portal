import { Box, TextField } from "@mui/material";
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
  const [ notificationPayload, setNotificationPayload ] = useState<unknown>(
    pendingState.notificationPayload ?? {}
  );

  useEffect(() => {
    handlePageUpdated({
      notificationTitle,
      notificationBody,
      notificationPayload,
    });
  }, [
    handlePageUpdated, notificationTitle, notificationBody, notificationPayload
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
      <TextField
        sx={{ width: "90%", mt: "1rem" }}
        label="Additional Payload"
        value={notificationPayload}
        onChange={(event) => {
          setNotificationPayload(event.target.value);
        }}
        disabled
      />
    </Box>
  );
};

export default ComposePage;
