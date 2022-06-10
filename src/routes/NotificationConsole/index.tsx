import NotificationConsole from "./NotificationConsole";
export default NotificationConsole;

export type SendPushNotificationReturnType =
  | { status: "ok"; id: string }
  | {
      status: "error";
      message: string;
      details?:
        | {
            error?:
              | "DeviceNotRegistered"
              | "InvalidCredentials"
              | "MessageTooBig"
              | "MessageRateExceeded"
              | undefined;
          }
        | undefined;
    };
