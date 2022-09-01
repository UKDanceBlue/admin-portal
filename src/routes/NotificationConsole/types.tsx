
// Copied from functions repo
export type Notification = {
  notificationTitle: string;
  notificationBody: string;
  notificationPayload?: unknown;
  // If this is going to specific users we send *notificationRecipients*, if groups we send *notificationAudiences*.
  notificationAudiences?: { [key: string]: string[] };
  notificationRecipients?: string[];
  sendToAll?: boolean;
};

export type NotificationPayload = {
  url?: string;
  message?: {
    title: string;
    message: string;
    image?: {
      uri: `gs://${string}` | `http${"s" | ""}://${string}`;
      width: number;
      height: number;
    };
  };
  webviewSource?: {
    /**
     * The URI to load in the `WebView`. Can be a local or remote file.
     */
    uri: string;
    /**
     * The HTTP Method to use. Defaults to GET if not specified.
     * NOTE: On Android, only GET and POST are supported.
     */
    method?: string;
    /**
     * Additional HTTP headers to send with the request.
     * NOTE: On Android, this can only be used with GET requests.
     */
    headers?: Object;
    /**
     * The HTTP body to send with the request. This must be a valid
     * UTF-8 string, and will be sent exactly as specified, with no
     * additional encoding (e.g. URL-escaping or base64) applied.
     * NOTE: On Android, this can only be used with POST requests.
     */
    body?: string;
  } | {
    /**
     * A static HTML page to display in the WebView.
     */
    html: string;
    /**
     * The base URL to be used for any relative links in the HTML.
     */
    baseUrl?: string;
  };
};
