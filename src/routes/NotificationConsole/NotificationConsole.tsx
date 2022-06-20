import { Box, Typography } from "@mui/material";
import { useState } from "react";

import NotificationForm from "./NotificationForm";
import NotificationStatus from "./NotificationStatus";

import { SendPushNotificationReturnType } from ".";

const NotificationConsole = () => {
  const [ notificationTickets, setNotificationTickets ] = useState<SendPushNotificationReturnType[]>();

  return (
    <Box>
      <Typography variant="h4" component="h4">
        Notifications
      </Typography>
      <Typography variant="subtitle1" component="p">
        Be responsible here, notifications you send go directly to people&apos;s phones. There is no
        un-send, so be sure you have selected the right audience. If you want more info about how to
        use this form send an email to the <a href="mailto:app@danceblue.org">app coordinator</a>.
      </Typography>
      <NotificationForm handlePushSent={setNotificationTickets} />
      <NotificationStatus notificationTickets={notificationTickets} />
    </Box>
  );
};

export default NotificationConsole;
