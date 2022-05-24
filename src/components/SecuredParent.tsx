import ErrorIcon from "@mui/icons-material/Error";
import { Box } from "@mui/material";
import PropTypes from "prop-types";
import { ReactNode } from "react";
import { AuthClaim } from "../routes";

import { useAuthClaims } from "../customHooks";
import { auth } from "../firebase/firebaseApp";

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
  requiredClaims?: AuthClaim[];
}) => {
  const authClaims = useAuthClaims(auth);

  if (authClaims) {
    // Make sure that the user supplied requiredClaims, if not then just return the component
    if (requiredClaims && Array.isArray(requiredClaims)) {
      // Iterate over the requiredClaims and make sure that the user has the required claim
      if (
        requiredClaims.every((claim) => {
          const authClaim = authClaims[claim.claimKey];
          if (typeof authClaim !== "string") {
            console.warn("Auth claim is not a string");
            return false;
          }
          return claim.claimValues.includes(authClaim);
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
                You do not have access to this component. If you believe this is an error, please
                contact the DanceBlue technology committee.
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
