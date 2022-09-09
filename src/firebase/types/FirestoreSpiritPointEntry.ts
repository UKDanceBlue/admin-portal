export interface SpiritPointEntry {
  points: number;
  teamId: string;
  opportunityId: string;
  linkblue: string;
  displayName?: string;
}

export function isSpiritPointEntry(
  data: any
): data is SpiritPointEntry {
  if (data == null) {
    return false;
  }

  if (typeof data.points !== "number") {
    return false;
  }

  if (typeof data.teamId !== "string") {
    return false;
  }

  if (typeof data.opportunityId !== "string") {
    return false;
  }

  if (typeof data.linkblue !== "string") {
    return false;
  }

  if (data.displayName != null && typeof data.displayName !== "string") {
    return false;
  }

  return true;
}
