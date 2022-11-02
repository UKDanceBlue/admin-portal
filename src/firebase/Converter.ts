import { FirestoreDocumentJson, FirestoreDocumentModel, FirestoreDocumentModelInstance, MaybeWithFirestoreMetadata } from "@ukdanceblue/db-app-common/dist/firestore/internal";
import { FieldValue, FirestoreDataConverter, PartialWithFieldValue } from "firebase/firestore";

export function makeConverter<T extends FirestoreDocumentJson, I extends FirestoreDocumentModelInstance<T> = FirestoreDocumentModelInstance<T>>(model: FirestoreDocumentModel<T, I>): FirestoreDataConverter<MaybeWithFirestoreMetadata<T>> {
  return {
    toFirestore: (modelObject: PartialWithFieldValue<MaybeWithFirestoreMetadata<{test: never}>>) => {
      // We can only check types if there is not FieldValue magic going on
      if (Object.values(model).every((v) => !(v instanceof FieldValue))) {
        if (model.isValidJson(modelObject)) {
          return modelObject;
        } else {
          throw new Error("Invalid JSON");
        }
      } else {
        return modelObject;
      }
    },
    fromFirestore: (snapshot, options) => {
      const data = snapshot.data(options);
      if (model.isValidJson(data)) {
        return model.fromJson(data).toJson();
      } else {
        throw new Error("Invalid data");
      }
    }
  };
}
