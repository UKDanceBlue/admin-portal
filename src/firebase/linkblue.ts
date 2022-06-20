import { AuthenticationResult, InteractionRequiredAuthError, PublicClientApplication } from "@azure/msal-browser";
import { Auth, UserCredential, signInWithCustomToken } from "firebase/auth";
import { Functions, httpsCallable } from "firebase/functions";

export async function signInWithLinkblue(auth: Auth, functions: Functions): Promise<UserCredential> {
  const msalConfig = {
    auth: {
      clientId: "71e79019-a381-4be1-8625-a1978edc8d04",
      authority: "https://login.microsoftonline.com/2b30530b-69b6-4457-b818-481cb53d42ae"
    }
  };

  const msalInstance = new PublicClientApplication(msalConfig);

  const request = {
    scopes: [
      "openid", "profile", "email", "offline_access", "User.read"
    ]
  };

  let tokenResponse: AuthenticationResult;
  try {
    tokenResponse = await msalInstance.acquireTokenSilent(request);
  } catch (e) {
    if (e instanceof InteractionRequiredAuthError) {
      // Fallback to interaction when silent call fails
      tokenResponse = await msalInstance.acquireTokenPopup(request);
    } else {
      throw e;
    }
  }

  if (tokenResponse?.accessToken == null) {
    throw new Error("Linkblue authentication failed: no access token");
  }

  const generateCustomToken = httpsCallable(functions, "generateCustomToken");
  const customToken = await generateCustomToken({ accessToken: tokenResponse.accessToken });

  if (typeof customToken.data === "string") {
    return signInWithCustomToken(auth, customToken.data as string);
  } else {
    throw new Error("Linkblue authentication failed: no custom token");
  }
}
