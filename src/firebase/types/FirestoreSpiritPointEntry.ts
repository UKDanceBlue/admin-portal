/** @deprecated Use types from @ukdanceblue/db-app-common instead */
export interface SpiritPointEntry {
  points: number;
  teamId: string;
  opportunityId: string;
  linkblue: string;
  displayName?: string;
}

/** @deprecated Use types from @ukdanceblue/db-app-common instead */
export function isSpiritPointEntry(
  data: unknown
): data is SpiritPointEntry {
  if (data == null) {
    return false;
  }

  if (typeof (data as SpiritPointEntry).points !== "number") {
    return false;
  }

  if (typeof (data as SpiritPointEntry).teamId !== "string") {
    return false;
  }

  if (typeof (data as SpiritPointEntry).opportunityId !== "string") {
    return false;
  }

  if (typeof (data as SpiritPointEntry).linkblue !== "string") {
    return false;
  }

  if ((data as SpiritPointEntry).displayName != null && typeof (data as SpiritPointEntry).displayName !== "string") {
    return false;
  }

  return true;
}
