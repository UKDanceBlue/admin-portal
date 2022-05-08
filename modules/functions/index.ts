import { initializeApp } from "firebase-admin/app";

import sendPushNotificationFunction, {
  SendPushNotificationFunctionArgument,
} from "./src/sendPushNotification";
import processPushNotificationReceiptsFunction from "./src/processPushNotificationReceipts";
import sweepOldAccountsFunction from "./src/sweepOldAccounts";
import syncDBFundsFunction from "./src/syncDBFunds";
import importSpiritPointsFunction from "./src/importSpiritPoints";
import writeLogFunction from "./src/writeLog";
import updateTeamFunction from "./src/updateTeam";
import updateUserClaimsFunction from "./src/updateUserClaims";
import handleDeviceDocumentWriteFunction from "./src/handleDeviceDocumentWrite";
import { Runnable } from "firebase-functions/v1";

// TODO type all of these using CloudFunction and HttpsFunction by creating a with argument types for all of these functions

initializeApp({ projectId: "react-danceblue" });

export const sendPushNotification: Runnable<SendPushNotificationFunctionArgument> =
  sendPushNotificationFunction;

export const processPushNotificationReceipts = processPushNotificationReceiptsFunction;

export const sweepOldAccounts = sweepOldAccountsFunction;

export const syncDBFunds = syncDBFundsFunction;

export const importSpiritPoints = importSpiritPointsFunction;

export const writeLog = writeLogFunction;

export const updateTeam = updateTeamFunction;

export const updateUserClaims = updateUserClaimsFunction;

export const handleDeviceDocumentWrite = handleDeviceDocumentWriteFunction;
