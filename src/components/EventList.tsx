import { ApiClient, EventResource } from "@ukdanceblue/db-app-common";
import { Interval, DateTime } from "luxon";
import EventView from "./EventView";

async function getData() {
  const url = new URL("http://localhost:3001/api");
  const client = new ApiClient(
    url,
    (url: string | URL, init?: RequestInit | undefined): Promise<Response> => {
      return fetch(url, { ...init, cache: "no-cache" });
    }
  );
  let error: Error | null = null;
  let events: EventResource[] = [];

  try {
    const res = await client.eventApi.getAllEvents();
    events = res.resource.resources ?? [];
  } catch (e) {
    if (e instanceof Error) error = e;
    else error = new Error("Unknown error");
  }

  return {
    events,
    error,
  };
}

export default async function EventList() {
  const data = await getData();

  if (data.error) {
    return <div>Error: {data.error.message}</div>;
  } else {
    return (
      <div>
        <h1>Events</h1>
        {data.events.map((e) => {
          return <EventView key={e.eventId} e={e} showLink />;
        })}
      </div>
    );
  }
}