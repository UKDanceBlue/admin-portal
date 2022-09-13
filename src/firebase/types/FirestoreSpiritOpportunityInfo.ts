import { Timestamp } from "firebase/firestore";

export interface FirestoreOpportunityInfo {
  name: string;
  date: Timestamp;
  totalPoints: number;
}

export function isFirestoreOpportunityInfo(
  data: any
): data is FirestoreOpportunityInfo {
  if (data == null) {
    return false;
  }

  if (typeof data.name !== "string") {
    return false;
  }

  if (!(data.date instanceof Timestamp)) {
    return false;
  }

  if (typeof data.totalPoints !== "number") {
    return false;
  }

  return true;
}
