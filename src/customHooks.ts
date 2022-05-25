import { Auth, ParsedToken, User, onIdTokenChanged } from "firebase/auth";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

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
  const [authClaims, setAuthClaims] = useState<ParsedToken | null>(null);

  useEffect(
    () =>
      onIdTokenChanged(
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
