// TODO replace this with more specific type definitions
export interface GenericFirestoreDocument {
  [key: string]: object | number | string | null | undefined;
}

export interface GenericFirestoreDocumentWithId extends GenericFirestoreDocument {
  id: string;
}
