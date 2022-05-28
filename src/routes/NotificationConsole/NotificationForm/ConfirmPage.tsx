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
      <h1>Confirm Page</h1>
      <pre>{JSON.stringify(notification, undefined, 2)}</pre>
    </div>
  );
};

export default ConfirmPage;
