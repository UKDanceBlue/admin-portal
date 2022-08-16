import { Typography } from "@mui/material";
import { Box } from "@mui/system";

import EventsDataGrid from "./EventsDataGrid";
import NewEventForm from "./NewEventForm";

const EventConsole = () => {
  return (
    <Box>
      <Typography variant="h4" component="h4">
        Events
      </Typography>
      <Typography variant="subtitle1" component="p">
        Modify the events shown in the &ldquo;Events&rdquo; page on the app
      </Typography>
      <NewEventForm />
      <EventsDataGrid />
      <p style={{ marginTop: "1em" }}>
        If you need to edit something you cannot change here, send an email to <a href="mailto:app@danceblue.org">the App Coordinator</a>
      </p>
    </Box>
  );
};

export default EventConsole;
