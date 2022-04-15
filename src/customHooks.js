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
