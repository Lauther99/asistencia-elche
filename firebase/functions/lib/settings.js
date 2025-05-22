"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GOOGLE_SCRIPTS_ENDPOINT = exports.ALLOWED_ORIGINS = exports.JWT_ALGORITHM = exports.JWT_SECRET_KEY = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const configMap = {
    JWT_SECRET_KEY_: (_a = process.env.JWT_SECRET_KEY) !== null && _a !== void 0 ? _a : "unasecretkeyfantabulosa",
    JWT_ALGORITHM_: (_b = process.env.JWT_ALGORITHM) !== null && _b !== void 0 ? _b : "HS256",
    ALLOWED_ORIGINS_: (_c = process.env.ALLOWED_ORIGINS) !== null && _c !== void 0 ? _c : "*",
    GOOGLE_SCRIPTS_ENDPOINT_: (_d = process.env.GOOGLE_SCRIPTS_ENDPOINT) !== null && _d !== void 0 ? _d : "",
};
exports.JWT_SECRET_KEY = configMap.JWT_SECRET_KEY_;
exports.JWT_ALGORITHM = configMap.JWT_ALGORITHM_;
exports.ALLOWED_ORIGINS = configMap.ALLOWED_ORIGINS_;
exports.GOOGLE_SCRIPTS_ENDPOINT = configMap.GOOGLE_SCRIPTS_ENDPOINT_;
//# sourceMappingURL=settings.js.map