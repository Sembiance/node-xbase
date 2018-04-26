"use strict";

// Returns true if this is a number (even if in string format)
if(!Number.isNumber)
{
	Number.isNumber = function isNumber(n)
	{
		return !isNaN(parseFloat(n)) && isFinite(n);
	};
}

// Returns a string version of the number. Hopefully this version is never used since it's built into most javascript implementations
if(!Number.prototype.toLocaleString)
{
	Number.prototype.toLocaleString = function toLocaleString()
	{
		return this.toString();
	};
}

// Converts a given number of seconds into a clock such as 4:50
if(!Number.prototype.toClock)
{
	Number.prototype.toClock = function toClock(omitMinutes)
	{
		let clockText = "";
		let secondsElapsed = this;	// eslint-disable-line consistent-this
		if(secondsElapsed>=(60*60))
		{
			const hourText = "" + parseInt((secondsElapsed / (60*60)), 10);
			clockText += hourText + ":";
			secondsElapsed %= (60*60);
			secondsElapsed = parseInt(secondsElapsed, 10);
		}

		if(secondsElapsed>=(60))
		{
			const minuteText = "" + parseInt((secondsElapsed / 60), 10);
			clockText += (minuteText.length===0 ? "00" : (minuteText.length===1) ? "0" : "") + minuteText + ":";
			secondsElapsed %= 60;
			secondsElapsed = parseInt(secondsElapsed, 10);
		}
		else if(typeof omitMinutes==="undefined" || !omitMinutes)
		{
			clockText += "00:";
		}

		const secondText = "" + Math.floor(secondsElapsed);
		clockText += (secondText.length===0 ? "00" : (secondText.length===1) ? "0" : "") + secondText;

		return clockText;
	};
}

// Converts a given number of seconds into a human readable value such as 3 days, 45 minutes, 10 seconds or 3d45m10s if short is set to true
if(!Number.prototype.secondsAsHumanReadable)
{
	Number.prototype.secondsAsHumanReadable = function secondsAsHumanReadable(lang="en", short=false)
	{
		const secondsElapsed = this;	// eslint-disable-line consistent-this
		const clock = secondsElapsed.toClock(secondsElapsed<60);
		const clockParts = clock.split(":");
		let humanText = "";
		let part = undefined;
			
		if(clockParts.length===3)
		{
			part = parseInt(clockParts[0], 10);
			if(isNaN(part))
				part = 0;
			if(part>8760)
			{
				part /= 8760;
				part = Math.floor(part);
				if(isNaN(part))
					part = 0;
				humanText += part.toLocaleString(lang) + (short ? "y" : (" year" + (part>1 || part===0 ? "s, " : ", ")));
				
				part = parseInt(clockParts[0], 10);
				if(isNaN(part))
					part = 0;
				part %= 8760;
				part /= 24;
				part = Math.floor(part);
				if(isNaN(part))
					part = 0;
				humanText += part.toLocaleString(lang) + (short ? "d" : (" day" + (part>1 || part===0 ? "s" : "")));
			}
			else if(part>24)
			{
				part /= 24;
				part = Math.floor(part);
				if(isNaN(part))
					part = 0;
				humanText += part.toLocaleString(lang) + (short ? "d" : (" day" + (part>1 || part===0 ? "s, " : ", ")));
				
				part = parseInt(clockParts[0], 10);
				if(isNaN(part))
					part = 0;
				part %= 24;
				part = Math.floor(part);
				if(isNaN(part))
					part = 0;
				humanText += part.toLocaleString(lang) + (short ? "h" : (" hour" + (part>1 || part===0 ? "s" : "")));
			}
			else
			{
				humanText += part.toLocaleString(lang) + (short ? "h" : (" hour" + (part>1 || part===0 ? "s, " : ", ")));
				
				part = parseInt(clockParts[1], 10);
				if(isNaN(part))
					part = 0;
				humanText += part.toLocaleString(lang) + (short ? "m" : (" minute" + (part>1 || part===0 ? "s" : "")));
			}
		}
		else if(clockParts.length===2)
		{
			part = parseInt(clockParts[0], 10);
			if(isNaN(part))
				part = 0;
			humanText += part.toLocaleString(lang) + (short ? "m" : (" minute" + (part>1 || part===0 ? "s, " : ", ")));
			
			part = parseInt(clockParts[1], 10);
			if(isNaN(part))
				part = 0;
			humanText += part.toLocaleString(lang) + (short ? "s" : (" second" + (part>1 || part===0 ? "s" : "")));
		}
		else if(clockParts.length===1)
		{
			part = parseInt(clockParts[0], 10);
			if(isNaN(part))
				part = 0;
			humanText += part.toLocaleString(lang) + (short ? "s" : (" second" + (part>1 || part===0 ? "s" : "")));
		}

		return humanText;
	};
}

// Returns an array of bits that represent the given number
if(!Number.prototype.getBits)
{
	Number.prototype.getBits = function getBits()
	{
		const bits = [];
		for(let i=31;i>=0;i--)
			bits.push(this.getBit(i));

		return bits.reverse();
	};
}

// Returns the given bit (0 or 1)
if(!Number.prototype.getBit)
{
	Number.prototype.getBit = function getBit(loc)
	{
		return ((this >> loc) %2 !== 0) ? 1 : 0;	// eslint-disable-line no-bitwise
	};
}

// Sets the given bit in a number to 1
if(!Number.prototype.setBit)
{
	Number.prototype.setBit = function setBit(loc)
	{
		return this | (1 << loc);	// eslint-disable-line no-bitwise
	};
}

// Clears the given bit in a number to 0
if(!Number.prototype.clearBit)
{
	Number.prototype.clearBit = function clearBit(loc)
	{
		return this & ~(1 << loc);	// eslint-disable-line no-bitwise
	};
}

// Flips the given bit in the number
if(!Number.prototype.flipBit)
{
	Number.prototype.flipBit = function flipBit(loc)
	{
		return (this.getBit(loc)===1 ? this.clearBit(loc) : this.setBit(loc));
	};
}

// Returns a string at least width long, padding the front with zeros as needed
if(!Number.prototype.zeroPad)
{
	Number.prototype.zeroPad = function zeroPad(_width)
	{
		const n = +this;

		const width = _width - n.toString().length;
		if(width>0)
			return new Array( width + (/\./.test(n) ? 2 : 1) ).join("0") + n;

		return n + "";
	};
}

// Truncates a number, ceiling it if it's less than zero and flooring it if greater than 0
if(!Number.prototype.truncate)
{
	Number.prototype.truncate = function truncate()
	{
		if(this<0)
			return Math.ceil(this);

		return Math.floor(this);
	};
}
