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
var firestore_1 = require("firebase-admin/firestore");
var functions = require("firebase-functions");
// A list of keys to filter directory entires by (not actually used in the query, but used to determine if a match is found). Ordered by specificity.
var possibleQueryKeys = [
    "lastAssociatedUid",
    "upn",
    "email",
    "firstName",
    "lastName",
    "spiritTeamId",
    "committee",
    "committeeRank",
    "dbRole",
];
/**
 * Looks for a user in the firestore directory using whatever information is available and returns a single match or null, unless returnAll is true, in which case it returns an array of all matches.
 *
 * @param {{lastAssociatedUid: string, upn: string, email:string, firstName: string, lastName: string, spiritTeamId: string, committee: string, committeeRank: ("advisor" | "overall-chair" | "chair" | "coordinator" | "committee-member"), dbRole: ("public" | "team-member" | "committee")}} queryData - An object with any data known about the person being looked up to refine the search.
 * @param {boolean} [returnAll=false] If true, returns an array of all matches instead of just the first.
 * @return {Promise<Object<string, string> | (Object<string, string>)[] | null>} - A promise that resolves to the first match or an array of all matches, or null if no match was found.
 */
function directoryLookup(queryData, returnAll) {
    if (returnAll === void 0) { returnAll = false; }
    return __awaiter(this, void 0, void 0, function () {
        var firebaseFirestore, lastAssociatedUid, upn, email, firstName, lastName, foundDocuments, lookup, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    functions.logger.log("Attempting a firestore directory lookup", queryData);
                    firebaseFirestore = (0, firestore_1.getFirestore)();
                    lastAssociatedUid = queryData.lastAssociatedUid, upn = queryData.upn, email = queryData.email, firstName = queryData.firstName, lastName = queryData.lastName;
                    foundDocuments = null;
                    lookup = { empty: true };
                    if (!lastAssociatedUid) return [3 /*break*/, 2];
                    return [4 /*yield*/, firebaseFirestore
                            .collection("directory")
                            .where("lastAssociatedUid", "==", lastAssociatedUid)
                            .get()];
                case 1:
                    lookup = _a.sent();
                    _a.label = 2;
                case 2:
                    if (!lookup.empty) return [3 /*break*/, 17];
                    if (!upn) return [3 /*break*/, 4];
                    return [4 /*yield*/, firebaseFirestore.collection("directory").where("upn", "==", upn).get()];
                case 3:
                    lookup = _a.sent();
                    _a.label = 4;
                case 4:
                    if (!lookup.empty) return [3 /*break*/, 15];
                    if (!email) return [3 /*break*/, 6];
                    return [4 /*yield*/, firebaseFirestore.collection("directory").where("email", "==", email).get()];
                case 5:
                    lookup = _a.sent();
                    _a.label = 6;
                case 6:
                    if (!lookup.empty) return [3 /*break*/, 13];
                    if (!lastName) return [3 /*break*/, 8];
                    return [4 /*yield*/, firebaseFirestore
                            .collection("directory")
                            .where("lastName", "==", lastName)
                            .get()];
                case 7:
                    lookup = _a.sent();
                    _a.label = 8;
                case 8:
                    if (!lookup.empty) return [3 /*break*/, 11];
                    if (!firstName) return [3 /*break*/, 10];
                    return [4 /*yield*/, firebaseFirestore
                            .collection("directory")
                            .where("firstName", "==", firstName)
                            .get()];
                case 9:
                    lookup = _a.sent();
                    _a.label = 10;
                case 10:
                    if (lookup.empty) {
                        functions.logger.log("No documents found in the directory.");
                        return [2 /*return*/, null];
                    }
                    else {
                        foundDocuments = lookup.docs;
                    }
                    return [3 /*break*/, 12];
                case 11:
                    foundDocuments = lookup.docs;
                    _a.label = 12;
                case 12: return [3 /*break*/, 14];
                case 13:
                    foundDocuments = lookup.docs;
                    _a.label = 14;
                case 14: return [3 /*break*/, 16];
                case 15:
                    foundDocuments = lookup.docs;
                    _a.label = 16;
                case 16: return [3 /*break*/, 18];
                case 17:
                    foundDocuments = lookup.docs;
                    _a.label = 18;
                case 18:
                    functions.logger.log("Found ".concat(foundDocuments.length, " documents in the directory."), foundDocuments);
                    i = 0;
                    while (foundDocuments.length > 1 && i < possibleQueryKeys.length) {
                        foundDocuments = foundDocuments.filter(function (doc) { return doc.get(possibleQueryKeys[i]) === queryData[possibleQueryKeys[i]]; });
                        i++;
                    }
                    if (foundDocuments.length > 0) {
                        if (foundDocuments.length === 1) {
                            functions.logger.log("Successfully found a single directory entry.", foundDocuments[0].data());
                            return [2 /*return*/, __assign({ directoryDocumentId: foundDocuments[0].id }, foundDocuments[0].data())];
                        }
                        else if (returnAll) {
                            functions.logger.log("Successfully found multiple directory entries, returning all.");
                            return [2 /*return*/, foundDocuments.map(function (doc) { return (__assign({ directoryDocumentId: doc.id }, doc[0].data())); })];
                        }
                        else {
                            functions.logger.log("Failed to narrow query to a single directory entry.");
                            return [2 /*return*/, null];
                        }
                    }
                    else {
                        functions.logger.log("No documents found in the directory.");
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports["default"] = directoryLookup;
