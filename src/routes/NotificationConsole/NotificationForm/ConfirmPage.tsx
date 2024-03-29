import { Paper, Typography } from "@mui/material";
import { useEffect } from "react";

import { Notification, NotificationPayload } from "../types";

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
    // Check the pending state and parse it correctly
    const {
      url, textPopup, webviewPopup
    } = pendingState.notificationPayload ?? {};

    let encodedUrl;
    if (url != null) {
      encodedUrl = encodeURI(url);
    }

    let parsedTextPopup: NotificationPayload["textPopup"];
    if (textPopup != null) {
      const {
        title: textPopupTitle, message: textPopupMessage
      } = textPopup;
      if (textPopupTitle != null && textPopupMessage != null) {
        if (textPopup.image != null && (typeof textPopup.image.uri !== "string" || typeof textPopup.image.height !== "number" || typeof textPopup.image.width !== "number")) {
          parsedTextPopup = {
            title: textPopupTitle,
            message: textPopupMessage
          };
        } else {
          parsedTextPopup = {
            title: textPopupTitle,
            message: textPopupMessage,
            image: textPopup.image
          };
        }
      }
    }

    const createdNotification: Notification = {
      notificationTitle: pendingState.notificationTitle ?? "",
      notificationBody: pendingState.notificationBody ?? "",
      notificationPayload: {
        url: encodedUrl,
        textPopup: parsedTextPopup,
        webviewPopup
      },
      notificationAudiences: (Object.keys(pendingState.notificationAudiences ?? {}).length > 0) ? pendingState.notificationAudiences : undefined,
      dryRun: pendingState.dryRun ?? false,
      // notificationRecipients: pendingState.notificationRecipients ?? null,     TODO
      sendToAll: pendingState.sendToAll ?? false,
    };

    const stringifiedNotification = JSON.stringify({
      notificationTitle: createdNotification.notificationTitle,
      notificationBody: createdNotification.notificationBody,
      notificationPayload: createdNotification.notificationPayload,
    });

    if (stringifiedNotification.length > 2730) {
      alert("Notification is too long! Please shorten the title, body, or payload.");
    } else {
    // If all is well, set the notification
      setNotification(createdNotification);
    }
  }, [
    pendingState.notificationBody, pendingState.notificationPayload, pendingState.notificationTitle, pendingState.notificationAudiences, setNotification, pendingState.dryRun, pendingState.sendToAll
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
      <Typography variant="body2">To be sent to:
        {
          notification.notificationAudiences && Object.keys(notification.notificationAudiences).length > 0
            ? (
              // Show all the audiences that are selected
              Object.entries(notification.notificationAudiences)
                .map(
                  ([ audience, audienceIds ]) => (
                    <Typography key={audience} variant="body2" sx={{ ml: "1em" }}>
                      {` ${audience}: ${audienceIds.join(", ")}\n`}
                    </Typography>
                  ))
            )
            : (
              notification.notificationRecipients && notification.notificationRecipients.length > 0
                ? (
                  // Show all the number of recipients that are selected
                  <Typography variant="body2" sx={{ ml: "1em" }}>
                    {notification.notificationRecipients.length.toString().concat(" recipients")}
                  </Typography>)
                : (
                  notification.sendToAll
                    ? (
                      // Show that all recipients are selected
                      "All users"
                    )
                    : (
                      // Show that no recipients are selected
                      <Typography variant="body2" sx={{ ml: "1em" }}>
                        {"No recipients"}
                      </Typography>
                    )
                )
            )
        }
      </Typography>
    </div>
  );
};

export default ConfirmPage;
