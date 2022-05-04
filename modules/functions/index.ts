import * as functions from "firebase-functions";
import { initializeApp } from "firebase-admin/app";

import sendPushNotificationFunction from "./src/sendPushNotification";
import processPushNotificationReceiptsFunction from "./src/processPushNotificationReceipts";
import sweepOldAccountsFunction from "./src/sweepOldAccounts";
import syncDBFundsFunction from "./src/syncDBFunds";
import importSpiritPointsFunction from "./src/importSpiritPoints";
import writeLogFunction from "./src/writeLog";
import updateTeamFunction from "./src/updateTeam";
import updateUserClaimsFunction from "./src/updateUserClaims";
import handleDeviceDocumentWriteFunction from "./src/handleDeviceDocumentWrite";

initializeApp({ projectId: "react-danceblue" });

export const sendPushNotification = functions
  .runWith({ secrets: ["EXPO_ACCESS_TOKEN"] })
  .https.onCall(sendPushNotificationFunction);

export const processPushNotificationReceipts = processPushNotificationReceiptsFunction;

export const sweepOldAccounts = functions.https.onRequest(sweepOldAccountsFunction);

export const syncDBFunds = functions.pubsub.schedule("every 24 hours").onRun(syncDBFundsFunction);

export const importSpiritPoints = functions.https.onRequest(importSpiritPointsFunction);

export const writeLog = functions.https.onRequest(writeLogFunction);

export const updateTeam = functions.https.onCall(updateTeamFunction);

export const updateUserClaims = functions.https.onCall(updateUserClaimsFunction);

export const handleDeviceDocumentWrite = handleDeviceDocumentWriteFunction;
