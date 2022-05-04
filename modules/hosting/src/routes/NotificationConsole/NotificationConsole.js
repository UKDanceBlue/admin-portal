"use strict";
exports.__esModule = true;
var material_1 = require("@mui/material");
var NotificationForm_1 = require("./NotificationForm");
var NotificationStatus_1 = require("./NotificationStatus");
var NotificationConsole = function () {
    return (<material_1.Box>
      <material_1.Typography variant="h4" component="h4">
        Notifications
      </material_1.Typography>
      <material_1.Typography variant="subtitle1" component="p">
        Be responsible here, notifications you send go directly to people&apos;s
        phones. There is no un-send, so be sure you have selected the right
        audience. If you want more info about how to use this form send an email
        to the <a href="mailto:app@danceblue.org">app coordinator</a>.
      </material_1.Typography>
      <NotificationForm_1["default"] />
      <NotificationStatus_1["default"] />
    </material_1.Box>);
};
exports["default"] = NotificationConsole;
