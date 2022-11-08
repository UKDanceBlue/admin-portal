import { Timestamp } from "firebase/firestore";

/** @deprecated Use types from @ukdanceblue/db-app-common instead */
export interface FirestoreOpportunityInfo {
  name: string;
  date: Timestamp;
  totalPoints: number;
}

/** @deprecated Use types from @ukdanceblue/db-app-common instead */
export function isFirestoreOpportunityInfo(
  data: unknown
): data is FirestoreOpportunityInfo {
  if (data == null) {
    return false;
  }

  if (typeof (data as FirestoreOpportunityInfo).name !== "string") {
    return false;
  }

  if (!((data as FirestoreOpportunityInfo).date instanceof Timestamp)) {
    return false;
  }

  if (typeof (data as FirestoreOpportunityInfo).totalPoints !== "number") {
    return false;
  }

  return true;
}
