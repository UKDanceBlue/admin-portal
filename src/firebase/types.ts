import type { GeoPoint, Timestamp } from "firebase/firestore";
import { FirebaseStorage, getDownloadURL, ref } from "firebase/storage";

export type GenericFirestoreEntry = {[key: string]: GenericFirestoreEntry} | GenericFirestoreEntry[] | GeoPoint | Timestamp | string | number | boolean | null;

export interface GenericFirestoreDocument {
  [key: string]: GenericFirestoreEntry;
}

export interface GenericFirestoreDocumentWithId extends GenericFirestoreDocument {
  id: string;
}

export interface FirestoreImage {
  uri: `gs://${string}` | `http${"s" | ""}://${string}`;
  width: number;
  height: number;
}

export function isFirestoreImage(image?: object): image is FirestoreImage {
  if (image == null) {
    return false;
  }

  const {
    uri, width, height
  } = image as Partial<FirestoreImage>;
  if (uri == null) {
    return false;
  } else if (typeof uri !== "string") {
    return false;
  } else {
    const [protocol] = uri.split("://");

    if (protocol !== "gs" && protocol !== "http" && protocol !== "https") {
      return false;
    }
  }

  if (width == null) {
    return false;
  } else if (typeof width !== "number") {
    return false;
  } else if (width < 0) {
    return false;
  }

  if (height == null) {
    return false;
  } else if (typeof height !== "number") {
    return false;
  } else if (height < 0) {
    return false;
  }

  return true;
}

export interface DownloadableImage {
  url?: string;
  width: number;
  height: number;
}

export const parseFirestoreImage = async (firestoreImage: FirestoreImage, fbStorage: FirebaseStorage): Promise<DownloadableImage> => ({
  url: firestoreImage.uri.startsWith("gs://") ? await getDownloadURL(ref(fbStorage, firestoreImage.uri)).catch(() => undefined) : firestoreImage.uri,
  width: firestoreImage.width,
  height: firestoreImage.height,
});
