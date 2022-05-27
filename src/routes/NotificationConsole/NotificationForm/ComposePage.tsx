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
  const [notificationTitle, setNotificationTitle] = useState(pendingState.notificationTitle ?? "");
  const [notificationBody, setNotificationBody] = useState(pendingState.notificationBody ?? "");
  // const [notificationPayload, setNotificationPayload] = useState<unknown>();

  useEffect(() => {
    handlePageUpdated({
      notificationTitle,
      notificationBody,
      // notificationPayload,
    });
  }, [handlePageUpdated, notificationTitle, notificationBody]);

  return (
    <Box component="form" autoComplete="off">
      <TextField
        label="Notification Title"
        value={notificationTitle}
        onChange={(event) => {
          setNotificationTitle(event.target.value);
        }}
      />
      <TextField
        label="Notification Body"
        value={notificationBody}
        onChange={(event) => {
          setNotificationBody(event.target.value);
        }}
      />
    </Box>
  );
};

export default ComposePage;
