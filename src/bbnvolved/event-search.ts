import { Functions, httpsCallable } from "firebase/functions";
import { DateTime } from "luxon";

export interface ListedEvent {
  id?: string;
  institutionId?: number;
  organizationId?: number;
  organizationIds?: any[];
  branchId?: number;
  branchIds?: any[];
  organizationName?: string;
  organizationProfilePicture?: string;
  organizationNames?: any[];
  name?: string;
  description?: string;
  location?: string;
  startsOn?: string;
  endsOn?: string;
  imagePath?: string;
  theme?: string;
  categoryIds?: string[];
  categoryNames?: string[];
  benefitNames?: any[];
  visibility?: string;
  status?: string;
  latitude?: string;
  longitude?: string;
  // recScore?: null;
  "@search.score"?: number;
}

export async function listEvents({
  endsAfter, organizationId, functions
}: {
  endsAfter?: DateTime;
  organizationId?: number;
  functions: Functions
}): Promise<ListedEvent[]> {
  let url = "https://uky.campuslabs.com/engage/api/discovery/event/search?query&take=8";
  if (endsAfter) {
    url += `&endsAfter=${endsAfter.toISO()}`;
  }
  if (organizationId) {
    url += `&organizationIds%5B0%5D=${organizationId}`;
  }

  const response = await httpsCallable<unknown, {value: ListedEvent[]} | undefined>(functions, "makeRequest")({ url });
  const json = response.data?.value ?? [];
  return json;
}
