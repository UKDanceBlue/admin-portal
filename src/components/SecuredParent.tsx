import ErrorIcon from "@mui/icons-material/Error";
import { Box, CircularProgress } from "@mui/material";
import PropTypes from "prop-types";
import { ReactNode } from "react";
import { useSigninCheck } from "reactfire";

import { AuthClaim } from "../routes";

/**
 * Only shows a component if the user meets the required claims. If
 *
 * DO NOT RELY ON THIS FOR SECURITY, this HOC can be circumvented. Sensitive data/actions should be protected on the server-side.
 */
const SecuredParent = ({
  children,
  requiredClaims,
}: {
  children: ReactNode;
  requiredClaims?: readonly AuthClaim[];
}) => {
  const {
    status, data: signInCheckResult
  } = useSigninCheck({
    validateCustomClaims: (userClaims) => {
      // Make sure that the user supplied requiredClaims, if not then just return the component
      if (requiredClaims && Array.isArray(requiredClaims)) {
        // Iterate over the requiredClaims and make sure that the user has the required claim
        if (
          requiredClaims.every((claim) => {
            const authClaim = userClaims[claim.claimKey];
            if (typeof authClaim !== "string") {
              console.warn("Auth claim is not a string");
              return false;
            }
            return claim.claimValues.includes(authClaim);
          })
        ) {
          return { hasRequiredClaims: true, errors: {} };
        } else {
          return { hasRequiredClaims: false, errors: {} };
        }
      } else {
        return { hasRequiredClaims: true, errors: {} };
      }
    },
  });

  if (status === "loading") {
    return (
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <CircularProgress size="3em" color="info" />
        <p>Authenticating...</p>
        <CircularProgress size="3em" color="info" />
      </Box>
    );
  } else if (status === "error") {
    return (
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <ErrorIcon sx={{ fontSize: "3em" }} color="error" />
        <p>Authentication failed.</p>
        <ErrorIcon sx={{ fontSize: "3em" }} color="error" />
      </Box>
    );
  } else if (status === "success") {
    if (signInCheckResult?.hasRequiredClaims) {
      return <>{children}</>;
    } else {
      return (
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <ErrorIcon sx={{ fontSize: "3em", justifySelf: "flex-start" }} color="error" />
          <p>
            You do not have access to this component. If you believe this is an error, please
            contact the DanceBlue technology committee.
          </p>
          <ErrorIcon sx={{ fontSize: "3em", justifySelf: "flex-end" }} color="error" />
        </Box>
      );
    }
  } else {
    throw new Error("Unexpected status code from 'useSigninCheck'");
  }
};

SecuredParent.propTypes = {
  children: PropTypes.element.isRequired,
  requiredClaims: PropTypes.arrayOf(
    PropTypes.shape({
      claimKey: PropTypes.string.isRequired,
      claimValues: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ),
};

export default SecuredParent;
