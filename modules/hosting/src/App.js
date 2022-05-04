"use strict";
exports.__esModule = true;
var Home_1 = require("./routes/Home");
var MarathonConsole_1 = require("./routes/MarathonConsole");
var MoraleConsole_1 = require("./routes/MoraleConsole");
var SpiritConsole_1 = require("./routes/SpiritConsole");
var NotificationConsole_1 = require("./routes/NotificationConsole");
var react_router_dom_1 = require("react-router-dom");
var MenuBar_1 = require("./components/MenuBar");
var material_1 = require("@mui/material");
var SecuredParent_1 = require("./components/SecuredParent");
/**
 * Core application component, mounted by index.tsx to the root div.
 *
 * @return {JSX.Element} The main App component
 */
function App() {
    return (<material_1.Box sx={{ alignContent: "center" }}>
      <MenuBar_1["default"] />
      <material_1.Paper elevation={3} sx={{ px: "0.5em", mx: "auto", maxWidth: "lg" }}>
        <react_router_dom_1.Routes>
          <react_router_dom_1.Route path="/" element={<Home_1["default"] />}/>
          <react_router_dom_1.Route path="marathon-console" element={<SecuredParent_1["default"] requiredClaims={[
                { claimKey: "dbRole", claimValues: ["committee"] },
                {
                    claimKey: "committeeRank",
                    claimValues: ["coordinator", "chair"]
                },
            ]}>
                <MarathonConsole_1["default"] />
              </SecuredParent_1["default"]>}/>
          <react_router_dom_1.Route path="morale-console" element={<SecuredParent_1["default"] requiredClaims={[
                { claimKey: "dbRole", claimValues: ["committee"] },
                {
                    claimKey: "committeeRank",
                    claimValues: ["coordinator", "chair"]
                },
            ]}>
                <MoraleConsole_1["default"] />
              </SecuredParent_1["default"]>}/>
          <react_router_dom_1.Route path="spirit-console" element={<SecuredParent_1["default"] requiredClaims={[
                { claimKey: "dbRole", claimValues: ["committee"] },
                {
                    claimKey: "committeeRank",
                    claimValues: ["coordinator", "chair"]
                },
            ]}>
                <SpiritConsole_1["default"] />
              </SecuredParent_1["default"]>}/>
          <react_router_dom_1.Route path="notification-console" element={<SecuredParent_1["default"] requiredClaims={[
                { claimKey: "dbRole", claimValues: ["committee"] },
                {
                    claimKey: "committeeRank",
                    claimValues: ["coordinator", "chair"]
                },
            ]}>
                <NotificationConsole_1["default"] />
              </SecuredParent_1["default"]>}/>
        </react_router_dom_1.Routes>
      </material_1.Paper>
    </material_1.Box>);
}
exports["default"] = App;
