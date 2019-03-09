"use strict";

const base = require("./base.js"),
	performance= require("perf_hooks").performance;

console.log("[%s]", "   \t\n\r \t this is   just a test  \t\t of the  system  \t  \n  \t\t\t ".trim().innerTrim());
console.log("[%s]", " this is   just a test  \t\t of the  system     ".trim("thm ").innerTrim());
console.log("[%s]", " this is   just a test  \t\t of the  system   \t  ".trim(["t", "h", "m", " ", "\t"]).innerTrim());


console.log("These numbers should start come out with 0.5 seconds between each number");
[].pushSequence(1, 100).parallelForEach((v, subcb) => { console.log("%d: %d", performance.now(), v); setTimeout(subcb, Math.randomInt(0, base.SECOND*10)); }, () => {}, 10, base.SECOND/2);


//[].pushSequence(1, 100).serialForEach((v, subcb) => { console.log("%d: %d", performance.now(), v); setTimeout(subcb, base.SECOND/2); }, () => {});
