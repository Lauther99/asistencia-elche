"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setKeypass = exports.setPhotoEmbedding = exports.getUserData = exports.updateAssistance = exports.registerWorkers = void 0;
const settings_1 = require("../../settings");
async function registerWorkers(userData) {
    const url = settings_1.GOOGLE_SCRIPTS_ENDPOINT;
    const headers = {
        "Content-Type": "application/json",
    };
    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(userData),
    });
    const responseData = await response.json();
    const res = {
        status: responseData["status"],
        message: responseData["message"],
    };
    return res;
}
exports.registerWorkers = registerWorkers;
async function updateAssistance(userData) {
    const url = `${settings_1.GOOGLE_SCRIPTS_ENDPOINT}?accion=actualizar_asistencias`;
    const headers = {
        "Content-Type": "application/json",
    };
    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(userData),
    });
    const responseData = await response.json();
    const res = {
        status: responseData["status"],
        message: responseData["message"],
    };
    return res;
}
exports.updateAssistance = updateAssistance;
async function getUserData(userData) {
    const url = `${settings_1.GOOGLE_SCRIPTS_ENDPOINT}?accion=get_user_data`;
    const headers = {
        "Content-Type": "application/json",
    };
    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(userData),
    });
    const responseData = await response.json();
    return responseData;
}
exports.getUserData = getUserData;
async function setPhotoEmbedding(userData) {
    const url = `${settings_1.GOOGLE_SCRIPTS_ENDPOINT}?accion=set_photo_embedding`;
    const headers = {
        "Content-Type": "application/json",
    };
    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(userData),
    });
    const responseData = await response.json();
    const res = {
        status: responseData["status"],
        message: responseData["message"],
    };
    return res;
}
exports.setPhotoEmbedding = setPhotoEmbedding;
async function setKeypass(userData) {
    const url = `${settings_1.GOOGLE_SCRIPTS_ENDPOINT}?accion=set_keypass`;
    const headers = {
        "Content-Type": "application/json",
    };
    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(userData),
    });
    const responseData = await response.json();
    const res = {
        status: responseData["status"],
        message: responseData["message"],
    };
    return res;
}
exports.setKeypass = setKeypass;
//# sourceMappingURL=scripts.js.map