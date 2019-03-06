"use strict";

const base = require("./base.js");

console.log("[%s]", "   \t\n\r \t this is   just a test  \t\t of the  system  \t  \n  \t\t\t ".trim().innerTrim());
console.log("[%s]", " this is   just a test  \t\t of the  system     ".trim("thm ").innerTrim());
console.log("[%s]", " this is   just a test  \t\t of the  system   \t  ".trim(["t", "h", "m", " ", "\t"]).innerTrim());


console.log("These numbers should start come out in groups of 20, with 0.5 seconds between each number and 3 seconds between each group");
[].pushSequence(1, 100).parallelForEach((v, subcb) => { console.log(v); setTimeout(subcb, 3000); }, () => {}, 20, 500);
