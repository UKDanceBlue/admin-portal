import { Auth, ParsedToken, User, onIdTokenChanged } from "firebase/auth";
import { Dispatch, SetStateAction, useEffect, useReducer, useState } from "react";
import { useRemoteConfigString } from "reactfire";

const updateAuthClaims = async (
  user: User,
  setAuthClaims: Dispatch<SetStateAction<ParsedToken | null>>
) => {
  if (!user) {
    setAuthClaims({});
  } else {
    const idToken = await user.getIdTokenResult();
    setAuthClaims(idToken.claims);
  }
};

/**
 * A hook that returns the current user's claims.
 * @param auth - Firebase Auth instance
 * @return Returns null if no ID token has yet been checked, otherwise returns the user's auth claims object
 */
export const useAuthClaims = (auth: Auth): ParsedToken | null => {
  const [ authClaims, setAuthClaims ] = useState<ParsedToken | null>(null);

  useEffect(
    () => onIdTokenChanged(
      auth,
      (user) => {
        if (user) {
          void updateAuthClaims(user, setAuthClaims);
        } else {
          setAuthClaims(null);
        }
      },
      () => {
        setAuthClaims({});
      }
    ),
    [auth]
  );

  return authClaims;
};

export const useRemoteConfigParsedJson = <T = unknown>(field: string) => {
  const encodedJson = useRemoteConfigString(field);

  let data;
  let { error } = encodedJson;

  try {
    data = JSON.parse(encodedJson.data) as T;
  } catch (e) {
    if (error) {
      console.error(e);
    } else {
      error = e as SyntaxError;
    }
    data = undefined;
  }

  return {
    data,
    error,
    firstValuePromise: encodedJson.firstValuePromise,
    hasEmitted: encodedJson.hasEmitted,
    isComplete: encodedJson.isComplete,
    status: encodedJson.status,
  };
};

export const useFormReducer = <T extends Record<string, unknown>>(initialState: T) => {
  return useReducer(
    (state: T, newState: ["reset"] | ["update", [keyof T, T[keyof T]]] | ["set", T]) => {
      switch (newState[0]) {
      case "reset":
        return initialState;
      case "update":
        return {
          ...state,
          [newState[1][0]]: newState[1][1],
        };
      case "set":
        return newState[1];
      default:
        throw new Error("Invalid action");
      }
    },
    initialState
  );
};
