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
    </Box>
  );
};

export default EventConsole;
