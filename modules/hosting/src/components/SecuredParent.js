"use strict";
exports.__esModule = true;
var material_1 = require("@mui/material");
var Error_1 = require("@mui/icons-material/Error");
var firebaseApp_1 = require("../firebase/firebaseApp");
var customHooks_1 = require("../customHooks");
var prop_types_1 = require("prop-types");
/**
 * Only shows a component if the user meets the required claims. If
 *
 * DO NOT RELY ON THIS FOR SECURITY, this HOC can be circumvented. Sensitive data/actions should be protected on the server-side.
 * @param {Component} Component The component to secure
 * @param {Object.<string, string>} userClaims The user's claims object
 * @param {{claimKey: string, claimValues: string[]}[]} requiredClaims - The claims that the user must have to access the component
 * @return {Component} The now secured component
 */
var SecuredParent = function (_a) {
    var children = _a.children, requiredClaims = _a.requiredClaims;
    var authClaims = (0, customHooks_1.useAuthClaims)(firebaseApp_1.auth);
    if (authClaims) {
        // Make sure that the user supplied requiredClaims, if not then just return the component
        if (requiredClaims && Array.isArray(requiredClaims)) {
            // Iterate over the requiredClaims and make sure that the user has the required claim
            if (requiredClaims.every(function (claim) {
                return claim.claimValues.includes(authClaims[claim.claimKey]);
            })) {
                return <>{children}</>;
            }
            else {
                return (<material_1.Box sx={{ display: "flex", justifyContent: "center" }}>
            <material_1.Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center"
                    }}>
              <Error_1["default"] fontSize="large" color="error"/>
              <p>
                You do not have access to this component. If you believe this is
                an error, please contact the DanceBlue technology committee.
              </p>
              <Error_1["default"] fontSize="large" color="error"/>
            </material_1.Box>
          </material_1.Box>);
            }
        }
        else {
            return <>{children}</>;
        }
    }
    else {
        return <div>Authenticating...</div>;
    }
};
SecuredParent.propTypes = {
    children: prop_types_1["default"].element.isRequired,
    requiredClaims: prop_types_1["default"].arrayOf(prop_types_1["default"].shape({
        claimKey: prop_types_1["default"].string.isRequired,
        claimValues: prop_types_1["default"].arrayOf(prop_types_1["default"].string).isRequired
    }))
};
exports["default"] = SecuredParent;
