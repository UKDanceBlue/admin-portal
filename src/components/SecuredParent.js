import { Box } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import { Component, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebaseApp";

/**
 * Only shows a component if the user meets the required claims. If
 *
 * DO NOT RELY ON THIS FOR SECURITY, this HOC can be circumvented. Sensitive data/actions should be protected on the server-side.
 * @param {Component} Component The component to secure
 * @param {Object.<string, string>} userClaims The user's claims object
 * @param {{claimKey: string, allowedClaimValues: string[]}[]} requiredClaims - The claims that the user must have to access the component
 */
const SecuredParent = ({ children, requiredClaims }) => {
  const [user] = useAuthState(auth);
  const [userClaims, setUserClaims] = useState(null);

  useEffect(() => {
    (async () => {
      if (user) {
        const idToken = await user.getIdTokenResult();
        setUserClaims(idToken.claims);
      } else {
        setUserClaims({ dbRole: ["public"] });
      }
    })();
  }, [user]);

  if (userClaims) {
    // Make sure that the user supplied requiredClaims, if not then just return the component
    if (requiredClaims && Array.isArray(requiredClaims)) {
      // Iterate over the requiredClaims and make sure that the user has the required claim
      if (
        requiredClaims.every((claim) => {
          return [claim.claimKey]?.includes(claim.claimValues);
        })
      ) {
        return <>{children}</>;
      } else {
        return (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <ErrorIcon fontSize="large" color="error" />
              <p>
                You do not have access to this component. If you believe this is
                an error, please contact the DanceBlue technology committee.
              </p>
              <ErrorIcon fontSize="large" color="error" />
            </Box>
          </Box>
        );
      }
    } else {
      return <>{children}</>;
    }
  } else {
    return <div>Authenticating...</div>;
  }
};

export default SecuredParent;
