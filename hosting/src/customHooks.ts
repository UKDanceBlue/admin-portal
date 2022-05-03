import { onIdTokenChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useSignInWithMicrosoft } from "react-firebase-hooks/auth";

export const useSignInWithUkMicrosoft = (auth) => {
  const [signInWithMicrosoft, userCredential, loading, error] =
    useSignInWithMicrosoft(auth);

  const signInWithUkMicrosoft = () =>
    signInWithMicrosoft(
      ["profile", "email", "openid", "offline_access", "User.Read"],
      {
        tenant: "2b30530b-69b6-4457-b818-481cb53d42ae",
        domain_hint: "uky.edu",
      }
    );

  return [signInWithUkMicrosoft, userCredential, loading, error];
};

/**
 * A hook that returns the current user's claims.
 * @param {Auth} auth - Firebase Auth instance
 * @returns {?Object.<string,string>} - Returns null if no ID token has yet been checked, otherwise returns the user's auth claims object
 */
export const useAuthClaims = (auth) => {
  const [authClaims, setAuthClaims] = useState(null);

  useEffect(
    () =>
      onIdTokenChanged(
        auth,
        async (user) => {
          if (!user) {
            setAuthClaims({});
          } else {
            const idToken = await user.getIdTokenResult();
            setAuthClaims(idToken.claims);
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
