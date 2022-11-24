import { FirestoreDocumentJson, FirestoreDocumentModel, FirestoreDocumentModelInstance, FirestoreMetadata, MaybeWithFirestoreMetadata, WithFirestoreMetadata, hasFirestoreMetadata } from "@ukdanceblue/db-app-common";
import { BasicTimestamp } from "@ukdanceblue/db-app-common/dist/shims/Firestore";
import { FieldValue, FirestoreDataConverter, serverTimestamp } from "firebase/firestore";

type EntriesType<T, E extends keyof T = keyof T> = [E, T[E]][];

function stripUndefined<T extends Partial<Record<string, unknown>>>(obj: T) {
  const withoutUndefinedEntries = Object.entries(obj).filter(([ , v ]) => v !== undefined) as EntriesType<T>;
  const withoutUndefined = Object.fromEntries(withoutUndefinedEntries);
  return withoutUndefined;
}

// !! IT IS ESSENTIAL TO REMEMBER THAT ANY FIELD MAY CONTAIN A `FieldValue` INSTEAD OF A PRIMITIVE - WE CANNOT USE `WithFieldValue` BECAUSE IT IS RECURSIVE !!
// This file is evil and bad and it will probably break things but oh well ¯\_(ツ)_/¯

function updateMetadata<T extends(WithFirestoreMetadata<FirestoreDocumentJson> | WithFirestoreMetadata<FirestoreDocumentJson>)>(modelObject: T): T {
  const existingMetadata = modelObject.__meta ?? {};
  if (!(existingMetadata instanceof FieldValue)) {
    const newMetadata: FirestoreMetadata = {};
    if (existingMetadata.schemaVersion != null) {
      newMetadata.schemaVersion = existingMetadata.schemaVersion;
    }
    if (existingMetadata.createdAt != null) {
      newMetadata.createdAt = existingMetadata.createdAt;
    }
    newMetadata.modifiedAt = serverTimestamp() as BasicTimestamp;

    const newObj: T = { ...modelObject, __meta: newMetadata };
    return newObj;
  } else {
    return modelObject;
  }
}

function processPureJson<T extends FirestoreDocumentJson, I extends FirestoreDocumentModelInstance<T> = FirestoreDocumentModelInstance<T>>(model: FirestoreDocumentModel<T, I>, modelObject: T) {
  const fromJson = model.fromJson(modelObject);
  const backToJson = fromJson.toJson();
  const withoutUndefined = stripUndefined(backToJson);

  // Update modifiedAt if __meta is present
  if (hasFirestoreMetadata(withoutUndefined)) {
    return updateMetadata(withoutUndefined);
  } else {
    return withoutUndefined;
  }
}

export function makeConverter<T extends FirestoreDocumentJson, I extends FirestoreDocumentModelInstance<T> = FirestoreDocumentModelInstance<T>>(model: FirestoreDocumentModel<T, I>, defaultSchemaVersion?: number): FirestoreDataConverter<MaybeWithFirestoreMetadata<T>> {
  const toFirestore = (modelObject: MaybeWithFirestoreMetadata<T>) => {
    // We can only check types if there is not FieldValue magic going on
    if (Object.values(modelObject).every((v) => !(v instanceof FieldValue))) {
      if (model.isValidJson(modelObject)) {
        return processPureJson<T, I>(model, modelObject);
      } else {
        throw new Error("Invalid JSON");
      }
      // Update modifiedAt if __meta is present
    } else if (hasFirestoreMetadata(modelObject)) {
      return updateMetadata(modelObject as WithFirestoreMetadata<FirestoreDocumentJson>);
    } else {
      return modelObject;
    }
  };

  const fromFirestore: FirestoreDataConverter<MaybeWithFirestoreMetadata<T>>["fromFirestore"] = (snapshot, options) => {
    const data = snapshot.data(options);
    if (model.isValidJson(data)) {
      return model.fromJson(data, defaultSchemaVersion == null ? undefined : { schemaVersion: defaultSchemaVersion }).toJson();
    } else {
      throw new Error("Invalid data");
    }
  };

  return {
    toFirestore,
    fromFirestore
  };
}

