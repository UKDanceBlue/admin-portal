import type { GeoPoint, Timestamp } from "firebase/firestore";

export type GenericFirestoreEntry = {[key: string]: GenericFirestoreEntry} | GenericFirestoreEntry[] | GeoPoint | Timestamp | string | number | boolean | null;

export interface GenericFirestoreDocument {
  [key: string]: GenericFirestoreEntry;
}

export interface GenericFirestoreDocumentWithId extends GenericFirestoreDocument {
  id: string;
}
