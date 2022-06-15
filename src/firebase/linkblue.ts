import { Auth, OAuthProvider, signInWithPopup } from "firebase/auth";

export async function signInWithLinkblue(auth: Auth) {
  const linkblueAuthProvider = new OAuthProvider("microsoft.com");

  linkblueAuthProvider.setCustomParameters({
    tenant: "2b30530b-69b6-4457-b818-481cb53d42ae",
    domain_hint: "uky.edu",
  });

  linkblueAuthProvider.addScope("openid");
  linkblueAuthProvider.addScope("profile");
  linkblueAuthProvider.addScope("email");
  linkblueAuthProvider.addScope("offline_access");
  linkblueAuthProvider.addScope("User.Read");

  return await signInWithPopup(auth, linkblueAuthProvider);
}
