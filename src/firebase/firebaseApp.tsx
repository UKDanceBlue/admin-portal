import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { getRemoteConfig } from "firebase/remote-config";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { ReactNode } from "react";
import {
  AuthProvider,
  FirebaseAppProvider,
  FirestoreProvider,
  FunctionsProvider,
  RemoteConfigProvider,
  StorageProvider,
  useFirebaseApp,
} from "reactfire";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDxKegAvCRvnZR-FQxl2EKBQoZr04TfCyc",
  authDomain: "react-danceblue.firebaseapp.com",
  databaseURL: "https://react-danceblue.firebaseio.com",
  projectId: "react-danceblue",
  storageBucket: "react-danceblue.appspot.com",
  messagingSenderId: "480114538491",
  appId: "1:480114538491:web:62aac53817d2c43ba2bd5e",
};

// Initialize Firebase
export const ReactFireProvider = ({ children }: { children: ReactNode }) => {
  const app = useFirebaseApp();

  const firestore = getFirestore(app);
  const functions = getFunctions(app);
  const remoteConfig = getRemoteConfig(app);
  const storage = getStorage(app);
  const auth = getAuth(app);

  if (process.env.NODE_ENV === "development") {
    const enabledEmulators = {
      firestoreEmulator: false,
      authEmulator: false,
      functionsEmulator: false,
      storageEmulator: false,
      configEmulator: false,
    };
    if (enabledEmulators.firestoreEmulator) {
      connectFirestoreEmulator(firestore, "localhost", 8080);
    }

    if (enabledEmulators.authEmulator) {
      connectAuthEmulator(auth, "http://localhost:9099");
    }

    if (enabledEmulators.functionsEmulator) {
      connectFunctionsEmulator(functions, "localhost", 5001);
    }

    if (enabledEmulators.storageEmulator) {
      connectStorageEmulator(storage, "localhost", 9199);
    }
  }

  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <FirestoreProvider sdk={firestore}>
        <FunctionsProvider sdk={functions}>
          <RemoteConfigProvider sdk={remoteConfig}>
            <StorageProvider sdk={storage}>
              <AuthProvider sdk={auth}>{children}</AuthProvider>
            </StorageProvider>
          </RemoteConfigProvider>
        </FunctionsProvider>
      </FirestoreProvider>
    </FirebaseAppProvider>
  );
};
