import { Paper, Typography } from "@mui/material";
import { useEffect } from "react";

import { Notification } from "../types";

import { NotificationFormPendingState } from ".";

const ConfirmPage = ({
  pendingState,
  notification,
  setNotification,
}: {
  pendingState: NotificationFormPendingState;
  notification: Notification;
  setNotification: (notification: Notification) => void;
}) => {
  useEffect(() => {
    setNotification({
      notificationTitle: pendingState.notificationTitle ?? "",
      notificationBody: pendingState.notificationBody ?? "",
      notificationPayload: pendingState.notificationPayload ?? {},
      notificationAudiences: pendingState.notificationAudiences,
    });
  }, [
    pendingState.notificationBody,
    pendingState.notificationPayload,
    pendingState.notificationTitle,
    pendingState.notificationAudiences,
    setNotification,
  ]);

  return (
    <div>
      <Typography variant="body2">Confirm Your message:</Typography>
      <br />
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
        <div style={{ flex: 1 }} />
        <Paper
          elevation={16}
          sx={{
            padding: "1em",
            display: "inline-flex",
            flexDirection: "column",
            flex: 3,
            backgroundColor: "lightblue",
          }}
        >
          <Typography variant="h4">
            <Paper
              elevation={0}
              sx={{
                display: "inline-flex",
                mr: "1rem",
                alignSelf: "end",
                verticalAlign: "top",
              }}
            >
              <img
                src="/db_watermark.svg"
                alt="icon"
                style={{ height: "1.1em" }}
              />
            </Paper>
            {notification.notificationTitle}
          </Typography>
          <Typography variant="body1">{notification.notificationBody}</Typography>
        </Paper>
        <div style={{ flex: 1 }} />
      </div>
      <br />
      <Typography variant="body2">
        With special content: {JSON.stringify(notification.notificationPayload)}
      </Typography>
      <br />
      <Typography variant="body2">To be sent to:</Typography>
      {notification.notificationAudiences &&
      Object.keys(notification.notificationAudiences).length > 0
        ? Object.entries(notification.notificationAudiences).map(([ audience, audienceIds ]) => (
          <Typography key={audience} variant="body2" sx={{ ml: "1em" }}>
            {` ${audience}: ${audienceIds.join(", ")}\n`}
          </Typography>
        ))
        : "NOBODY"}
    </div>
  );
};

export default ConfirmPage;
