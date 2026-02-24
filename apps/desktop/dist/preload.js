"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Exponer APIs seguras al renderer si se necesitan en el futuro
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    version: process.versions.electron,
});
