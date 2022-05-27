export type Notification = {
  notificationTitle: string;
  notificationBody: string;
  notificationPayload?: unknown;
  // If this is going to specific users we send *notificationRecipients*, if many we get *notificationAudiences*.
  notificationAudiences?: { [key: string]: string[] };
  notificationRecipients?: string[];
};
