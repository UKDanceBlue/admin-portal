import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import { HttpsCallable, httpsCallable } from "firebase/functions";
import { ReactNode, useCallback, useMemo, useState } from "react";
import { useFunctions } from "reactfire";

import { SendPushNotificationReturnType } from "..";
import { useLoading } from "../../../components/LoadingWrapper";
import { GenericFirestoreDocument } from "../../../firebase/types";
import { Notification, NotificationPayload } from "../types";

import AudiencePage from "./AudiencePage";
import ComposePage from "./ComposePage";
import ConfirmPage from "./ConfirmPage";

export type NotificationFormPendingState = {
  notificationTitle?: string;
  notificationBody?: string;
  notificationPayload?: {
    url?: NotificationPayload["url"];
    textPopup?: Partial<NotificationPayload["textPopup"]>;
    webviewPopup?: NotificationPayload["webviewPopup"];
  };
  selectedTeams?: GenericFirestoreDocument[];
  notificationAudiences?: { [audience: string]: (string | boolean)[] };
  sendToAll?: boolean;
  dryRun?: boolean;
};

const steps: string[] = [
  "Compose", "Audience", "Confirm"
];

const NotificationForm = ({ handlePushSent }: {
  handlePushSent: (tickets: SendPushNotificationReturnType[]) => void;
}) => {
  const [ isLoading, setIsLoading ] = useLoading();

  const [ activeStep, setActiveStep ] = useState(0);
  const [ notification, setNotification ] = useState<Notification>({
    notificationTitle: "",
    notificationBody: "",
  });
  const functions = useFunctions();

  const [ pendingState, setPendingState ] = useState<NotificationFormPendingState>({});

  const handlePageUpdated = useCallback(
    (changedContent: object) => setPendingState((prevState) => ({
      ...prevState,
      ...changedContent,
    })),
    []
  );

  const sendPushNotification = useCallback(async () => {
    setIsLoading(true);
    try {
      const sendPushNotificationCloudFunc = httpsCallable(functions, "sendPushNotification");
      const result = await (sendPushNotificationCloudFunc as HttpsCallable<Notification, SendPushNotificationReturnType[]>)(notification);
      handlePushSent(result.data);
    } catch (e) {
      alert(`Error sending push notification: ${ e}`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [
    functions, handlePushSent, notification, setIsLoading
  ]);

  const getCurrentPage = useCallback(() => {
    switch (activeStep) {
    case 0:
      return <ComposePage pendingState={pendingState} handlePageUpdated={handlePageUpdated} />;
    case 1:
      return <AudiencePage pendingState={pendingState} handlePageUpdated={handlePageUpdated} />;
    case 2:
      return (
        <ConfirmPage
          pendingState={pendingState}
          notification={notification}
          setNotification={setNotification}
        />
      );
    default:
      return null;
    }
  }, [
    activeStep, handlePageUpdated, notification, pendingState
  ]);

  const nextButtonDisabled = useMemo(() => {
    if (activeStep === 0) {
      if (!pendingState.notificationTitle || !pendingState.notificationBody) {
        return true;
      }
    }
    return false;
  }, [
    activeStep, pendingState.notificationBody, pendingState.notificationTitle
  ]);

  const handleNext = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }, []);

  const handleBack = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep - (prevActiveStep > 0 ? 1 : 0));
  }, [setActiveStep]);

  const handleReset = useCallback(() => {
    setActiveStep(0);
  }, [setActiveStep]);

  return (
    <Box component="form" autoComplete="off">
      <Stepper activeStep={activeStep} sx={{ my: "1em" }}>
        {steps.map((label) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: ReactNode;
          } = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <>
          <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </>
      ) : (
        <>
          {getCurrentPage()}
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button
              disabled={nextButtonDisabled || isLoading}
              variant="contained"
              onClick={activeStep === steps.length - 1 ? sendPushNotification : handleNext}
            >
              {activeStep === steps.length - 1 ? "Send" : "Next"}
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default NotificationForm;
