export interface FirestoreTeamInfo {
  name: string;
  members: string[];
  memberAccounts: Record<string, string | null>;
  fundraisingTotal?: number;
  totalPoints?: number;
  networkForGoodId?: string;
}

export function isFirestoreTeamInfo(
  data: any
): data is FirestoreTeamInfo {
  if (data == null) {
    return false;
  }

  if (typeof data.name !== "string") {
    return false;
  }

  if (!Array.isArray(data.members) || data.members.some((m: any) => typeof m !== "string")) {
    return false;
  }

  if (typeof data.memberAccounts !== "object" || data.memberAccounts == null) {
    return false;
  }

  if (data.fundraisingTotal != null && typeof data.fundraisingTotal !== "number") {
    return false;
  }

  if (data.totalPoints != null && typeof data.totalPoints !== "number") {
    return false;
  }

  if (data.networkForGoodId != null && typeof data.networkForGoodId !== "string") {
    return false;
  }

  return true;
}
