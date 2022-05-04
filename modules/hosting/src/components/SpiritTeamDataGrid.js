"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var firestore_1 = require("firebase/firestore");
var firestore_2 = require("react-firebase-hooks/firestore");
var x_data_grid_1 = require("@mui/x-data-grid");
var firebaseApp_1 = require("../firebase/firebaseApp");
var material_1 = require("@mui/material");
var prop_types_1 = require("prop-types");
var react_1 = require("react");
var deep_is_1 = require("deep-is");
// TODO convert this to a generic interface for editing a firestore collection
var spiritTeamsCollectionRef = (0, firestore_1.collection)(firebaseApp_1.firestore, "teams");
var DataGridFirebaseErrorOverlay = function (_a) {
    var code = _a.code, message = _a.message;
    return (<div>
      <material_1.Typography variant="h4" component="h4">
        An error has occurred
      </material_1.Typography>
      <p>Error code &apos;{code}&apos;</p>
      {message && <p>{message}</p>}
    </div>);
};
DataGridFirebaseErrorOverlay.propTypes = {
    code: prop_types_1["default"].string.isRequired,
    message: prop_types_1["default"].string
};
var SpiritTeamDataGrid = function (props) {
    var _a = (0, react_1.useState)(false), membersDialogOpen = _a[0], setMembersDialogOpen = _a[1];
    var _b = (0, react_1.useState)({}), membersDialogContent = _b[0], setMembersDialogContent = _b[1];
    var membersDialogDescriptionElementRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        if (membersDialogOpen) {
            var descriptionElement = membersDialogDescriptionElementRef.current;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [membersDialogOpen]);
    var _c = (0, react_1.useState)(null), snackbar = _c[0], setSnackbar = _c[1];
    var _d = (0, firestore_2.useCollection)(spiritTeamsCollectionRef), spiritTeams = _d[0], loading = _d[1], error = _d[2];
    var handleProcessRowUpdateError = (0, react_1.useCallback)(function (error) {
        setSnackbar({ children: error.message, severity: "error" });
    }, []);
    var showTeamMembersDialog = (0, react_1.useCallback)(function (teamMembers) {
        setMembersDialogContent(teamMembers);
        setMembersDialogOpen(true);
    }, []);
    var processRowUpdate = (0, react_1.useCallback)(function (newRow, oldRow) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ((0, deep_is_1["default"])(newRow, oldRow)) {
                return [2 /*return*/, oldRow];
            }
            else {
                if (newRow.id !== oldRow.id) {
                    throw new Error("Row ID changed, database update aborted");
                }
                else {
                    return [2 /*return*/, (0, firestore_1.setDoc)((0, firestore_1.doc)(spiritTeamsCollectionRef, newRow.id), newRow).then(function () { return newRow; })];
                }
            }
            return [2 /*return*/];
        });
    }); }, []);
    return (<>
      <x_data_grid_1.DataGrid {...props} experimentalFeatures={{ newEditingApi: true }} rows={spiritTeams
            ? spiritTeams.docs.map(function (doc) { return (__assign({ id: doc.id }, doc.data())); })
            : []} columns={[
            {
                field: "id",
                headerName: "Team ID",
                width: 200
            },
            {
                field: "name",
                headerName: "Name",
                width: 300,
                editable: true
            },
            {
                field: "networkForGoodId",
                headerName: "Network For Good ID",
                width: 200,
                editable: true
            },
            {
                field: "totalSpiritPoints",
                headerName: "Total Spirit Points",
                width: 200
            },
            {
                field: "members",
                headerName: "Members",
                width: 200,
                selectable: false,
                renderCell: function (_a) {
                    var value = _a.value;
                    return (<div style={{
                            display: "flex",
                            width: "100%",
                            height: "100%"
                        }}>
                  <material_1.Button variant="contained" disabled={!value || Object.keys(value).length === 0} onClick={function () { return showTeamMembersDialog(value); }} sx={{
                            my: "5%",
                            justifyContent: "left"
                        }}>
                    Show
                  </material_1.Button>
                </div>);
                }
            },
        ]} loading={loading} error={error} components={{
            ErrorOverlay: DataGridFirebaseErrorOverlay
        }} processRowUpdate={processRowUpdate} onProcessRowUpdateError={handleProcessRowUpdateError}/>
      {!!snackbar && (<material_1.Snackbar open anchorOrigin={{ vertical: "bottom", horizontal: "center" }} onClose={function () { return setSnackbar(null); }} autoHideDuration={6000}>
          <material_1.Alert {...snackbar} onClose={function () { return setSnackbar(null); }}/>
        </material_1.Snackbar>)}
      <material_1.Dialog open={membersDialogOpen} onClose={function () { return setMembersDialogOpen(false); }} scroll={"paper"} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
        <material_1.DialogTitle id="scroll-dialog-title">Team Members</material_1.DialogTitle>
        <material_1.DialogContent dividers={true}>
          <material_1.List>
            {Object.entries(membersDialogContent).map(function (_a) {
            var key = _a[0], value = _a[1];
            return (<material_1.ListItem key={key}>
                  <material_1.ListItemText primary={value}/>
                </material_1.ListItem>);
        })}
          </material_1.List>
        </material_1.DialogContent>
        <material_1.DialogActions>
          <material_1.Button onClick={function () { return setMembersDialogOpen(false); }}>OK</material_1.Button>
        </material_1.DialogActions>
      </material_1.Dialog>
    </>);
};
exports["default"] = SpiritTeamDataGrid;
