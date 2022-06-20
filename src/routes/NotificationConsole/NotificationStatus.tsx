import { DataGrid } from "@mui/x-data-grid";
import { HttpsCallableResult, httpsCallable } from "firebase/functions";
import { useEffect, useState } from "react";
import { useFunctions } from "reactfire";

import { SendPushNotificationReturnType } from ".";

type PushReceipt = {
  id?: string;
  status: "ok" | "error";
  infoForUser?: string;
  message?: string;
  details?: {
    error?: "DeviceNotRegistered" | "InvalidCredentials" | "MessageTooBig" | "MessageRateExceeded";
  };
};
type PushReceiptFunctionReturn = {
  status: string;
  receipts: { [key: string]: PushReceipt | null };
};

const NotificationStatus = (
  { notificationTickets }: {
    notificationTickets?: SendPushNotificationReturnType[];
  } = { notificationTickets: [{ id: "3", status: "ok" }] }
) => {
  const functions = useFunctions();

  const [ pushReceiptResponse, setPushReceiptResponse ] = useState<PushReceiptFunctionReturn>();

  const [ resolvedReceipts, setResolvedReceipts ] = useState<PushReceipt[]>([]);
  const [ erroredTickets, setErroredTickets ] = useState<PushReceipt[]>([]);

  useEffect(() => {
    if (notificationTickets !== undefined) {
      // Process the push receipts
      const pushTicketsToCheck: PushReceipt[] = [];
      const erroredPushTickets: PushReceipt[] = [];

      notificationTickets.forEach((ticket) => {
        if (ticket.status === "ok") {
          pushTicketsToCheck.push(ticket);
        } else {
          erroredPushTickets.push(ticket);
        }
      });

      const processPushNotificationReceiptsFunc = httpsCallable(
        functions,
        "processPushNotificationReceipts"
      );
      (
        processPushNotificationReceiptsFunc({ receiptIds: pushTicketsToCheck.map((t) => t.id) }) as Promise<HttpsCallableResult<PushReceiptFunctionReturn>>
      ).then((response) => {
        setPushReceiptResponse(response.data);
      });
    } else {
      setPushReceiptResponse(undefined);
    }
  }, [ functions, notificationTickets ]);

  useEffect(() => {
    if (pushReceiptResponse !== undefined) {
      const resolvedReceipts: PushReceipt[] = [];
      const erroredTickets: PushReceipt[] = [];

      Object.entries(pushReceiptResponse.receipts).forEach(([ id, receipt ]) => {
        if (receipt !== null) {
          if (receipt.status === "ok") {
            resolvedReceipts.push({ id, status: "ok" });
          } else {
            erroredTickets.push({
              id,
              status: "error",
              message: receipt.message,
              details: receipt.details,
            });
          }
        }
      });

      setResolvedReceipts(resolvedReceipts);
      setErroredTickets(erroredTickets);
    }
  }, [pushReceiptResponse]);

  if (!notificationTickets) {
    return null;
  } else {
    return (
      <DataGrid
        sx={{ height: 300 }}
        columns={[
          { field: "id", headerName: "ID", width: 300 },
          { field: "status", headerName: "Status", width: 80 },
          { field: "message", headerName: "Message", width: 150 },
          {
            field: "details",
            headerName: "Details",
            valueParser: (details) => details?.error,
            width: 300,
          },
          { field: "infoForUser", headerName: "Additional Info", width: 300 },
        ]}
        rows={resolvedReceipts.concat(erroredTickets)}
      />
    );
  }
};

export default NotificationStatus;
