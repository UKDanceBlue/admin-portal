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
      notificationAudiences: {
        team:
          pendingState.selectedTeams?.map((document) =>
            typeof document.id === "string" ? document.id : new String(document.id).toString()
          ) ?? [],
      },
    });
  }, [
    pendingState.notificationBody,
    pendingState.notificationTitle,
    pendingState.selectedTeams,
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
