"use strict";
exports.__esModule = true;
exports.firestore = exports.functions = exports.auth = exports.app = void 0;
var app_1 = require("firebase/app");
var auth_1 = require("firebase/auth");
var firestore_1 = require("firebase/firestore");
var functions_1 = require("firebase/functions");
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDxKegAvCRvnZR-FQxl2EKBQoZr04TfCyc",
    authDomain: "react-danceblue.firebaseapp.com",
    databaseURL: "https://react-danceblue.firebaseio.com",
    projectId: "react-danceblue",
    storageBucket: "react-danceblue.appspot.com",
    messagingSenderId: "480114538491",
    appId: "1:480114538491:web:62aac53817d2c43ba2bd5e"
};
// Initialize Firebase
exports.app = (0, app_1.initializeApp)(firebaseConfig);
exports.auth = (0, auth_1.getAuth)();
exports.functions = (0, functions_1.getFunctions)();
exports.firestore = (0, firestore_1.getFirestore)();
