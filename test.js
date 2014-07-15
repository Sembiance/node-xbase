"use strict";

var xbase = require("./base.js");

console.log("[%s]", "   \t\n\r \t this is   just a test  \t\t of the  system  \t  \n  \t\t\t ".trim().innerTrim());
console.log("[%s]", " this is   just a test  \t\t of the  system     ".trim("thm ").innerTrim());
console.log("[%s]", " this is   just a test  \t\t of the  system   \t  ".trim(["t", "h", "m", " ", "\t"]).innerTrim());
