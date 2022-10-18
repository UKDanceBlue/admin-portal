import AdapterLuxon from "@date-io/luxon";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { FirebaseAppProvider } from "reactfire";

import App from "./App";
import { SpecifiedEvent } from "./bbnvolved/event-get";
import { ListedEvent } from "./bbnvolved/event-search";
import { LoadingWrapper } from "./components/LoadingWrapper";
import { ReactFireProvider, firebaseConfig } from "./firebase/firebaseApp";
import theme from "./theme";

const container = document.querySelector("#root");

// This is evil, but is needed because we use JSONP to get the events from BBNvolved
// and it doesn't support CORS. This is a temporary solution until we can get a
// proper API endpoint from BBNvolved (probably never).
declare global {
  function jsonpEventsSearchCallback(data: any): void;
  function jsonpEventGetCallback(data: any): void;
  // eslint-disable-next-line no-var
  var jsonpSearchEvents: ListedEvent[];
  // eslint-disable-next-line no-var
  var jsonpGetEvent: SpecifiedEvent;
}

globalThis.jsonpEventGetCallback = (data) => {
  globalThis.jsonpGetEvent = data;
};

globalThis.jsonpEventsSearchCallback = (data) => {
  globalThis.jsonpSearchEvents = data.value;
};


if (container) {
  const root = createRoot(container);

  root.render(
    <StrictMode>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <FirebaseAppProvider firebaseConfig={firebaseConfig}>
            <LocalizationProvider dateAdapter={AdapterLuxon} >
              <ReactFireProvider>
                <LoadingWrapper>
                  <CssBaseline />
                  <App />
                </LoadingWrapper>
              </ReactFireProvider>
            </LocalizationProvider>
          </FirebaseAppProvider>
        </ThemeProvider>
      </BrowserRouter>
    </StrictMode>
  );
} else {
  throw new Error("Root element not found");
}
