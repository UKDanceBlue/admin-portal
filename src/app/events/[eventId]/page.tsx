import EventList from "@/components/EventList";
import EventView from "@/components/EventView";
import { ApiClient, EventResource } from "@ukdanceblue/db-app-common";

async function getData(eventId: string): Promise<
  | {
      event: EventResource;
      error: Error | null;
    }
  | {
      event: undefined;
      error: Error;
    }
> {
  const url = new URL("http://localhost:3001/api");
  const client = new ApiClient(
    url,
    (url: string | URL, init?: RequestInit | undefined): Promise<Response> => {
      return fetch(url, { ...init, cache: "no-cache" });
    }
  );
  let error: Error | null = null;

  let event: EventResource | undefined = undefined;
  try {
    const res = await client.eventApi.getEvent(eventId);
    const resource = res.resource.resource;
    event = resource;
  } catch (e) {
    if (e instanceof Error) error = e;
    else error = new Error("Unknown error");
  }

  if (!event) {
    return {
      event: undefined,
      error: error ?? new Error("Unknown error"),
    };
  } else {
    return {
      event,
      error,
    };
  }
}

export default async function EventPage({
  params,
}: {
  params: {
    eventId: string;
  };
}) {
  const data = await getData(params.eventId);

  return (
    <main className="flex min-h-screen flex-col p-24">
      {data.error ? <div>Error: {data.error.message}</div> : null}
      {data.event ? <EventView e={data.event} showDetails /> : null}
    </main>
  );
}
