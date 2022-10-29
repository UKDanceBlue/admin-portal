import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";

import { routeDefinitions } from "..";

import EventsDataGrid from "./EventsDataGrid";

const EventConsole = () => {
  const navigate = useNavigate();
  return (
    <Box>
      <Typography variant="h4" component="h4">
        Events
      </Typography>
      <Typography variant="subtitle1" component="p">
        Modify the events shown in the &ldquo;Events&rdquo; page on the app
      </Typography>
      <EventsDataGrid />
      <Button variant="contained" onClick={() => navigate({ pathname: routeDefinitions["new-event"].path })}>
        Add New Event
      </Button>
      <p style={{ marginTop: "1em" }}>
        If you need to edit something you cannot change here, send an email to <a href="mailto:app@danceblue.org">the App Coordinator</a>
      </p>
    </Box>
  );
};

export default EventConsole;
