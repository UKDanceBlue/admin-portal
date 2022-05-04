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
exports.__esModule = true;
var material_1 = require("@mui/material");
var firestore_1 = require("firebase/firestore");
var firebaseApp_1 = require("../../firebase/firebaseApp");
var CheckBoxOutlineBlank_1 = require("@mui/icons-material/CheckBoxOutlineBlank");
var CheckBox_1 = require("@mui/icons-material/CheckBox");
// import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
var react_1 = require("react");
var uncheckedIcon = <CheckBoxOutlineBlank_1["default"] fontSize="small"/>;
var checkedIcon = <CheckBox_1["default"] fontSize="small"/>;
var NotificationForm = function () {
    var _a = (0, react_1.useState)(false), shouldTeamsLoad = _a[0], setShouldTeamsLoad = _a[1];
    var _b = (0, react_1.useState)([]), teams = _b[0], setTeams = _b[1];
    var _c = (0, react_1.useState)(true), teamsLoading = _c[0], setTeamsLoading = _c[1];
    var _d = (0, react_1.useState)(null), teamsError = _d[0], setTeamsError = _d[1];
    (0, react_1.useEffect)(function () {
        if (shouldTeamsLoad) {
            var teamsCollectionRef = (0, firestore_1.collection)(firebaseApp_1.firestore, "teams").withConverter({
                toFirestore: function (data) {
                    var dataToUpload = __assign({}, data);
                    delete dataToUpload.id;
                    return dataToUpload;
                },
                fromFirestore: function (snapshot, options) {
                    var data = snapshot.data(options);
                    return __assign(__assign({}, data), { id: snapshot.id });
                }
            });
            (0, firestore_1.getDocs)(teamsCollectionRef)
                .then(function (snapshot) {
                setTeams(snapshot.docs.map(function (doc) { return doc.data(); }));
                setTeamsLoading(false);
            })["catch"](function (error) {
                setTeamsError(error);
                setTeamsLoading(false);
            });
        }
    }, [shouldTeamsLoad]);
    return (<>
      <material_1.FormControl variant="outlined" fullWidth>
        {/* TODO: Convert this to a generic firebase dropdown */}
        <material_1.Autocomplete multiple onOpen={function () {
            setShouldTeamsLoad(true);
        }} options={teams !== null && teams !== void 0 ? teams : []} isOptionEqualToValue={function (option, value) { return option.id === value.id; }} noOptionsText="No teams found" getOptionLabel={function (option) { return option.name; }} loading={!!(teamsLoading || teamsError)} disableCloseOnSelect renderOption={function (props, option, _a) {
            var selected = _a.selected;
            return (<li {...props}>
              <material_1.Checkbox icon={uncheckedIcon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected}/>
              {option.name}
            </li>);
        }} style={{ width: 500 }} renderInput={function (params) { return (<material_1.TextField {...params} label="Team Selection" InputProps={__assign(__assign({}, params.InputProps), { endAdornment: (<>
                    {shouldTeamsLoad && (teamsLoading || teamsError) ? (<material_1.CircularProgress color={teamsError ? "error" : "primary"} size={20}/>) : null}
                    {params.InputProps.endAdornment}
                  </>) })} error={!!teamsError} helperText={teamsError === null || teamsError === void 0 ? void 0 : teamsError.message} FormHelperTextProps={{
                error: !!teamsError
            }}/>); }}/>
      </material_1.FormControl>
    </>);
};
exports["default"] = NotificationForm;
