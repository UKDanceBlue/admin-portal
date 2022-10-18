import { Timestamp } from "firebase/firestore";
import { Interval } from "luxon";

import { DownloadableImage, FirestoreImage, GenericFirestoreDocument } from "./types";

/** @deprecated */
export * from "./types/FirestoreEvent";

/** @deprecated */
export interface RawFirestoreEvent extends GenericFirestoreDocument {
  title: string;
  description: string;
  image?: FirestoreImage | FirestoreImage[];
  address?: string;
  startTime?: Timestamp;
  endTime?: Timestamp;
  link?: {
    text: string;
    url: string;
  } | {
    text: string;
    url: string;
  }[];
}

/** @deprecated */
export interface ParsedFirestoreEvent {
  title: string;
  description: string;
  image?: DownloadableImage | DownloadableImage[];
  address?: string;
  interval?: ReturnType<Interval["toISO"]>;
  link?: {
    text: string;
    url: string;
  } | {
    text: string;
    url: string;
  }[];
}
