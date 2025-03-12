"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.codeGenerate = codeGenerate;
function codeGenerate() {
    const code = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join("");
    return code;
}
