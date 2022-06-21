import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { FirebaseAppProvider } from "reactfire";

import App from "./App";
import { LoadingWrapper } from "./components/LoadingWrapper";
import { ReactFireProvider, firebaseConfig } from "./firebase/firebaseApp";
import theme from "./theme";

const container = document.querySelector("#root");

if (container) {
  const root = createRoot(container);

  root.render(
    <StrictMode>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <FirebaseAppProvider firebaseConfig={firebaseConfig}>
            <ReactFireProvider>
              <LoadingWrapper>
                <CssBaseline />
                <App />
              </LoadingWrapper>
            </ReactFireProvider>
          </FirebaseAppProvider>
        </ThemeProvider>
      </BrowserRouter>
    </StrictMode>
  );
} else {
  throw new Error("Root element not found");
}
