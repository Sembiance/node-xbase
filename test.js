"use strict";

const XU = require("./XU.js");

console.log("[%s]", "   \t\n\r \t this is   just a test  \t\t of the  system  \t  \n  \t\t\t ".trim().innerTrim());
console.log("[%s]", " this is   just a test  \t\t of the  system     ".trim("thm ").innerTrim());
console.log("[%s]", " this is   just a test  \t\t of the  system   \t  ".trim(["t", "h", "m", " ", "\t"]).innerTrim());

//console.log("These numbers should start come out with 0.5 seconds between each number");
//[].pushSequence(1, 100).parallelForEach((v, subcb) => { console.log("%d: %d", performance.now(), v); setTimeout(subcb, Math.randomInt(0, XU.SECOND*10)); }, () => {}, {atOnce : 10, minInterval : XU.SECOND/2});

console.log("Colors & Modes\n--------------");
const modifiers = ["bold", "underline", "blink", "reverse", "strike", "italic"];
Object.keys(XU.c.fg).forEach(colorName => XU.log`${XU.c.reset + colorName.padStart(7)}: ${XU.c.fg[colorName] + "foreground " + modifiers.map(v => XU.c[v] + XU.c.fg[colorName] + v + XU.c.reset).join(" ")} ${XU.c.reset + XU.c.bg[colorName] + "background"}`);

console.log("Formatting\n----------");
Object.forEach({
	str      : "Hello, World",
	b        : true,
	num      : 78456824,
	floatNum : 829.47,
	obj      : {abc : 2352334, b : false, hello : "World!"},
	arr      : ["abc", 2346712, true]
}, (k, v) => XU.log`${XU.c.reset + k.padStart(10)}: ${v}`);

console.log([].pushSequence(0, 255).map(v => "\x1B[38;5;" + v + "m").join("█"));	// eslint-disable-line unicorn/no-hex-escape
