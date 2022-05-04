"use strict";
exports.__esModule = true;
var react_1 = require("react");
var client_1 = require("react-dom/client");
var CssBaseline_1 = require("@mui/material/CssBaseline");
var styles_1 = require("@mui/material/styles");
var App_1 = require("./App");
var theme_1 = require("./theme");
var react_router_dom_1 = require("react-router-dom");
var container = document.querySelector("#root");
var root = (0, client_1.createRoot)(container);
root.render(<react_1.StrictMode>
    <react_router_dom_1.BrowserRouter>
      <styles_1.ThemeProvider theme={theme_1["default"]}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline_1["default"] />
        <App_1["default"] />
      </styles_1.ThemeProvider>
    </react_router_dom_1.BrowserRouter>
  </react_1.StrictMode>);
