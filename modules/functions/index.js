"use strict";
exports.__esModule = true;
exports.handleDeviceDocumentWrite = exports.updateUserClaims = exports.updateTeam = exports.writeLog = exports.importSpiritPoints = exports.syncDBFunds = exports.sweepOldAccounts = exports.processPushNotificationReceipts = exports.sendPushNotification = void 0;
var functions = require("firebase-functions");
var app_1 = require("firebase-admin/app");
var sendPushNotification_1 = require("./src/sendPushNotification");
var processPushNotificationReceipts_1 = require("./src/processPushNotificationReceipts");
var sweepOldAccounts_1 = require("./src/sweepOldAccounts");
var syncDBFunds_1 = require("./src/syncDBFunds");
var importSpiritPoints_1 = require("./src/importSpiritPoints");
var writeLog_1 = require("./src/writeLog");
var updateTeam_1 = require("./src/updateTeam");
var updateUserClaims_1 = require("./src/updateUserClaims");
var handleDeviceDocumentWrite_1 = require("./src/handleDeviceDocumentWrite");
(0, app_1.initializeApp)({ projectId: "react-danceblue" });
exports.sendPushNotification = functions
    .runWith({ secrets: ["EXPO_ACCESS_TOKEN"] })
    .https.onCall(sendPushNotification_1["default"]);
exports.processPushNotificationReceipts = processPushNotificationReceipts_1["default"];
exports.sweepOldAccounts = functions.https.onRequest(sweepOldAccounts_1["default"]);
exports.syncDBFunds = functions.pubsub.schedule("every 24 hours").onRun(syncDBFunds_1["default"]);
exports.importSpiritPoints = functions.https.onRequest(importSpiritPoints_1["default"]);
exports.writeLog = functions.https.onRequest(writeLog_1["default"]);
exports.updateTeam = functions.https.onCall(updateTeam_1["default"]);
exports.updateUserClaims = functions.https.onCall(updateUserClaims_1["default"]);
exports.handleDeviceDocumentWrite = handleDeviceDocumentWrite_1["default"];
