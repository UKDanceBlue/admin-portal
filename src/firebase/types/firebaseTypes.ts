import { CollectionReference, DocumentReference } from "firebase/firestore";

import { HourInstructionsType, SpecialComponentType } from "./hourScreenTypes";
export interface FirestoreHour {
  hourNumber: number;
  name: string;
  description?: string;
  contentOrder: (
    | "text-instructions"
    | "gs-image"
    | "http-image"
    | "button"
    | "special"
    | "text-block"
    | "photo-upload"
    | "dad-joke-leaderboard"
  )[];
  textInstructions?: HourInstructionsType; // Text-instructions
  firebaseImageUri?: string | string[]; // Gs-image
  imageUri?: string | string[]; // Http-image
  buttonConfig?: { text: string; url: string } | { text: string; url: string }[]; // Button
  specialComponent?: SpecialComponentType | SpecialComponentType[]; // Special
  textBlock?: string | string[];
}

export interface FirestoreMoraleTeam {
  members: Record<string, string>;
  leaders: string;
  teamNumber: number;
  points: number;
}

export const isCollectionReference = (firestoreReference?: unknown): firestoreReference is CollectionReference => {
  if (typeof firestoreReference !== "object" || firestoreReference == null) {
    return false;
  }
  if (typeof (firestoreReference as CollectionReference).id !== "string") {
    return false;
  }
  if (typeof (firestoreReference as CollectionReference).path !== "string") {
    return false;
  }

  return true;
};

export const isDocumentReference = (firestoreReference?: unknown): firestoreReference is DocumentReference => {
  if (typeof firestoreReference !== "object" || firestoreReference == null) {
    return false;
  }
  if (typeof (firestoreReference as DocumentReference).id !== "string") {
    return false;
  }
  if (typeof (firestoreReference as DocumentReference).path !== "string") {
    return false;
  }
  if (typeof (firestoreReference as DocumentReference).parent !== "object") {
    return false;
  }

  return true;
};
