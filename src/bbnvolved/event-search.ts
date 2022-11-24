import { FirestoreEvent, FirestoreImage } from "@ukdanceblue/db-app-common";
import { Timestamp } from "firebase/firestore";
import { Functions, httpsCallable } from "firebase/functions";
import { FirebaseStorage } from "firebase/storage";
import { DateTime } from "luxon";
import TurndownService from "turndown";

import { normalizeImage } from "../routes/EventConsole/EventEditor/EventEditor";

import { getEvent } from "./event-get";

export interface ListedEvent {
  id?: string;
  institutionId?: number;
  organizationId?: number;
  organizationIds?: unknown[];
  branchId?: number;
  branchIds?: unknown[];
  organizationName?: string;
  organizationProfilePicture?: string;
  organizationNames?: unknown[];
  name?: string;
  description?: string;
  location?: string;
  startsOn?: string;
  endsOn?: string;
  imagePath?: string;
  theme?: string;
  categoryIds?: string[];
  categoryNames?: string[];
  benefitNames?: unknown[];
  visibility?: string;
  status?: string;
  latitude?: string;
  longitude?: string;
  // recScore?: null;
  "@search.score"?: number;
}

export const EVENTS_PER_SEARCH = 8;

export async function listEvents({
  endsAfter, organizationId, functions
}: {
  endsAfter?: DateTime;
  organizationId?: number;
  functions: Functions
}): Promise<ListedEvent[]> {
  let url = `https://uky.campuslabs.com/engage/api/discovery/event/search?query&take=${EVENTS_PER_SEARCH*2}&status=Approved`;
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

function htmlToMarkdown(html: string): string {
  const turndownService = new TurndownService();
  return turndownService.turndown(html);
}

async function specifiedEventToFirestoreEvent(fullEvent: import("/home/tagho/Source/admin-portal/src/bbnvolved/event-get").SpecifiedEvent, storage: FirebaseStorage): Promise<FirestoreEvent> {
  if (!fullEvent.name || !fullEvent.description) {
    alert("Something went wrong. Please try again later.");
    console.error("One of setFilledEvent, fullEvent.name, or fullEvent.description was falsy in BbnvolvedImportDialog");
    throw new Error("One of setFilledEvent, fullEvent.name, or fullEvent.description was falsy in BbnvolvedImportDialog");
  }

  const fakeDomeElement = document.createElement("div");
  fakeDomeElement.innerHTML = fullEvent.description;
  const shortDescription = fakeDomeElement.textContent?.substring(0, 100);

  const createdEvent: FirestoreEvent = new FirestoreEvent(fullEvent.name, shortDescription ?? "", htmlToMarkdown(fullEvent.description));
  if (fullEvent.startsOn && fullEvent.endsOn) {
    createdEvent.interval = {
      start: Timestamp.fromDate(DateTime.fromISO(fullEvent.startsOn).toJSDate()),
      end: Timestamp.fromDate(DateTime.fromISO(fullEvent.endsOn).toJSDate())
    };
    createdEvent.intervals = [createdEvent.interval];
  }

  if (fullEvent.address) {
    createdEvent.address = fullEvent.address.address;
  }
  if (fullEvent.imageUrl) {
    createdEvent.images = [FirestoreImage.fromJson(await normalizeImage(`${fullEvent.imageUrl}?preset=large-w`, storage))];
  }

  const links: {
    url: string;
    text: string;
  }[] = [
    {
      url: `https://uky.campuslabs.com/engage/event/${fullEvent.id}`,
      text: "BBNvolved Page"
    }
  ];

  if (fullEvent.address?.onlineLocation) {
    links.push({
      url: fullEvent.address?.onlineLocation,
      text: fullEvent.address?.provider ?? "Online Event Url"
    });
  }
  createdEvent.highlightedLinks = links;

  return createdEvent;
}

function dedupeEvents(events: FirestoreEvent[]) {
  const deduplicatedEvents: FirestoreEvent[] = [];

  for (const event of events) {
    // First we see if any events match, if so we store it's index so we can replace it later;
    let indexOfMatchingEvent: number | null = null;
    for (let i = 0; i < deduplicatedEvents.length && indexOfMatchingEvent === null; i++) {
      const {
        name, description
      } = deduplicatedEvents[i];
      if (name === event.name && description === event.description) {
        indexOfMatchingEvent = i;
      }
    }

    if (indexOfMatchingEvent === null) {
      // If no event matched, add it since it is a new event
      deduplicatedEvents.push(event);
    } else {
      const existingEvent = deduplicatedEvents[indexOfMatchingEvent];
      if (event.interval) {
        if (existingEvent.interval) {
        // If the existing event has an interval, we need to merge the intervals
          if (event.interval.start.toMillis() < existingEvent.interval.start.toMillis()) {
            existingEvent.interval.start = event.interval.start;
          }
          if (event.interval.end.toMillis() > existingEvent.interval.end.toMillis()) {
            existingEvent.interval.end = event.interval.end;
          }
          existingEvent.intervals.push(event.interval);
        } else {
        // If the existing event doesn't have an interval, we just replace it
          existingEvent.interval = event.interval;
          existingEvent.intervals = [event.interval];
        }
      }

      if (!existingEvent.address && event.address) {
        existingEvent.address = event.address;
      }

      deduplicatedEvents[indexOfMatchingEvent] = existingEvent;
    }
  }
  return deduplicatedEvents;
}

export async function listEventsParsed({
  endsAfter, organizationId, functions, storage
}: {
  endsAfter?: DateTime;
  organizationId?: number;
  functions: Functions;
  storage: FirebaseStorage;
}): Promise<FirestoreEvent[]> {
  // Load the events from BBNvolved
  const json = await Promise.all(await listEvents({ endsAfter, organizationId, functions }).then((events) => events.filter((event) => event.id).map((event) => (getEvent({ id: event.id as NonNullable<typeof event.id>, functions })))));

  const events: FirestoreEvent[] = (await Promise.allSettled(json.map((val) => specifiedEventToFirestoreEvent(val, storage)))).filter((event) => event.status === "fulfilled").map((event) => (event as PromiseFulfilledResult<FirestoreEvent>).value);

  // Now we need to deduplicate events by checking their name, description, and address; if all are equal, they should be combined into one using the interval (first start, last end) and intervals (all intervals) of the events
  const deduplicatedEvents: FirestoreEvent[] = dedupeEvents(events);

  // TODO - If there are fewer than 8 deduped events, we should load more events from BBNvolved

  // Return only EVENTS_PER_SEARCH events
  return deduplicatedEvents.slice(0, EVENTS_PER_SEARCH);
}
