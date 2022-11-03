/** @deprecated Use types from @ukdanceblue/db-app-common instead */
export interface FirestoreTeamInfo {
  name: string;
  teamClass?: "public" | "committee";
  members: string[];
  captains: string[];
  memberNames: Record<string, string | null>;
  memberAccounts: Record<string, string | null>;
  fundraisingTotal?: number;
  totalPoints?: number;
  networkForGoodId?: string;
  individualTotals?: Record<string, number>;
}

/** @deprecated Use types from @ukdanceblue/db-app-common instead */
export function isFirestoreTeamInfo(
  data: unknown
): data is FirestoreTeamInfo {
  if (data == null) {
    return false;
  }

  if (typeof (data as Partial<FirestoreTeamInfo>).name !== "string") {
    return false;
  }

  if ((data as Partial<FirestoreTeamInfo>).teamClass != null && typeof (data as Partial<FirestoreTeamInfo>).teamClass !== "string") {
    return false;
  }

  if (!Array.isArray((data as Partial<FirestoreTeamInfo>).members) || (data as Partial<FirestoreTeamInfo>).members?.some((m: unknown) => typeof m !== "string")) {
    return false;
  }

  if (typeof (data as Partial<FirestoreTeamInfo>).memberAccounts !== "object" || (data as Partial<FirestoreTeamInfo>).memberAccounts == null) {
    return false;
  }

  if (typeof (data as Partial<FirestoreTeamInfo>).memberNames !== "object" || (data as Partial<FirestoreTeamInfo>).memberNames == null) {
    return false;
  }

  if ((data as Partial<FirestoreTeamInfo>).fundraisingTotal != null && typeof (data as Partial<FirestoreTeamInfo>).fundraisingTotal !== "number") {
    return false;
  }

  if ((data as Partial<FirestoreTeamInfo>).totalPoints != null && typeof (data as Partial<FirestoreTeamInfo>).totalPoints !== "number") {
    return false;
  }

  if ((data as Partial<FirestoreTeamInfo>).networkForGoodId != null && typeof (data as Partial<FirestoreTeamInfo>).networkForGoodId !== "string") {
    return false;
  }

  if (typeof (data as Partial<FirestoreTeamInfo>).individualTotals !== "object" || (data as Partial<FirestoreTeamInfo>).individualTotals == null) {
    return false;
  }

  return true;
}
