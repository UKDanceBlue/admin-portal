import { Functions, httpsCallable } from "firebase/functions";

export interface SpecifiedEvent {
    id?: number;
    institutionId?: number;
    organizationId?: number;
    submittedByOrganizationId?: number;
    organizationIds?: number[];
    eventSubmissionId?: number;
    imagePath?: string;
    imageUrl?: string;
    name?: string;
    description?: string;
    startsOn?: string;
    endsOn?: string;
    address?: Address;
    theme?: string;
    benefits?: unknown[];
    categories?: Category[];
    state?: State;
    visibility?: string;
    type?: string;
    // originalSubmissionId?: null;
    // sourceSubmissionId?: null;
    // submittedByAccountId?: null;
    submittedById?: SubmittedByID;
    // accessCode?: null;
    rsvpSettings?: RsvpSettings;
    // legacyKey?: null;
    autoSendRatingNotifications?: boolean;
    hasSentRatingNotifications?: boolean;
    // evaluationQuestions?: null;
    allowDisplayOnTranscript?: boolean;
}

export interface Address {
    // locationId?: null;
    name?: string;
    address?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    zip?: string;
    latitude?: number;
    longitude?: number;
    onlineLocation?: string;
    instructions?: string;
    roomReservation?: string;
    provider?: string;
}

export interface Category {
    id?: number;
    name?: string;
    isVisibleOnPublicSite?: boolean;
}

export interface RsvpSettings {
    isInviteOnly?: boolean;
    totalAllowed?: null;
    shouldShowRemainingRsvps?: boolean;
    shouldAllowGuests?: boolean;
    // totalGuestsAllowedPerRsvp?: null;
    shouldGuestsCountTowardsTotalAllowed?: boolean;
    organizationRepresentationEnabled?: boolean;
    organizationRepresentationRequired?: boolean;
    totalRsvps?: number;
    totalGuests?: number;
    // spotsAvailable?: null;
    // questions?: null;
}

export interface State {
    eventId?: number;
    status?: string;
    // comments?: null;
    updatedByAccountId?: string;
}

export interface SubmittedByID {
    communityMemberId?: number;
    accountId?: string;
    username?: string;
    campusEmail?: string;
    swipeCardIdentifier?: string;
}

export async function getEvent({
  id, functions
}: { id: string, functions:Functions }): Promise<SpecifiedEvent> {
  const url = `https://uky.campuslabs.com/engage/api/discovery/event/${id}`;

  const response = await httpsCallable<unknown, SpecifiedEvent | undefined>(functions, "makeRequest")({ url });
  return response.data ?? {};
}
