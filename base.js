"use strict";
/*global window: true*/

(function(exports)
{
	var base = exports;

	exports.IS_NODE = typeof process!=="undefined" && typeof process.versions!=="undefined" && typeof process.versions.node!=="undefined";
	if(base.IS_NODE)
	{
		require("./Math");
		require("./Array");
		require("./String");
		require("./Object");
		require("./Date");
		require("./Function");
		require("./Number");

		exports.IS_DEV = !process.argv.contains("--staging") && !process.argv.contains("--production");
		exports.IS_STAGING = !!process.argv.contains("--staging");
	}
	else
	{
		exports.IS_DEV = window.location.hostname.startsWith("dev.") || window.location.href.contains("dev=true");
	}

	exports.SECOND = 1000;
	exports.MINUTE = base.SECOND*60;
	exports.HOUR = base.MINUTE*60;
	exports.DAY = base.HOUR*24;
	exports.WEEK = base.DAY*7;
	exports.MONTH = base.DAY*30;
	exports.YEAR = base.DAY*365;
	exports.STARTUP_TIME = Date.now();

	exports.BYTE = 1;
	exports.KB = base.BYTE*1024;
	exports.MB = base.KB*1024;
	exports.GB = base.MB*1024;
	exports.TB = base.GB*1024;
	exports.PB = base.TB*1024;

	function clone(src, deep)
	{
		var result = src;
		if(Array.isArray(src))
		{
			result = [];
			for(var i=0,len=src.length;i<len;i++)
			{
				if(deep)
					result.push(clone(src[i]));
				else
					result.push(src[i]);
			}
		}
		else if(Object.isObject(src))
		{
			result = {};
			Object.forEach(src, function(key, val)
			{
				if(deep)
					result[key] = clone(val, deep);
				else
					result[key] = val;
			});
		}
		
		return result;
	}
	exports.clone = clone;

	function CBRunner(_fun, _val, _i, _finish)
	{
		this.fun = _fun;
		this.val = _val;
		this.i = _i;
		this.finish = _finish;

		CBRunner.prototype.run = function()
		{
			this.fun(this.val, function(err, result) { this.finish(err, result, this.i); }.bind(this), this.i);
		};
	}

	function CBIterator(_a, _fun, _atOnce)
	{
		this.a = clone(_a);
		this.fun = _fun;
		this.atOnce = _atOnce || 1;
		this.results = [];
		this.i=0;
		this.running=[];

		CBIterator.prototype.go = function(cb)
		{
			this.cb = cb || function(){};
			if(this.a.length<1)
				return this.cb(undefined, []);

			this.next();
		};

		CBIterator.prototype.next = function()
		{
			var toRun = [];
			while(this.running.length<this.atOnce && this.a.length>0)
			{
				var _i = this.i++;
				this.running.push(_i);
				toRun.push(new CBRunner(this.fun, this.a.shift(), _i, this.finish.bind(this)));
			}

			while(toRun.length)
			{
				toRun.shift().run();
			}
		};

		CBIterator.prototype.finish = function(err, result, _i)
		{
			if(err)
				return this.cb(err, this.results);

			this.results[_i] = result;
			this.running.remove(_i);

			if(this.running.length===0 && this.a.length===0)
				return this.cb(undefined, this.results);

			this.next();
		};
	}

	if(!Array.prototype.serialForEach)
	{
		Array.prototype.serialForEach = function(fun, cb)
		{
			(new CBIterator(this, fun, 1)).go(cb);
		};
	}

	if(!Array.prototype.parallelForEach)
	{
		Array.prototype.parallelForEach = function(fun, cb, atOnce)
		{
			(new CBIterator(this, fun, atOnce||3)).go(cb);
		};
	}

	if(!Array.prototype.pushMany)
	{
		Array.prototype.pushMany = function(val, count)
		{
			while((count--)>0)
			{
				this.push(clone(val, true));
			}

			return this;
		};
	}

	Object.forEach({log : ["debug", "info", "log"], warn : ["warn"], error : ["error", "critical", "crit"]}, function(consoleKey, synonyms)
	{
		synonyms.forEach(function(synonym) { exports[synonym] = base.IS_NODE ? console[consoleKey].bind(console) : (window.console[consoleKey].bind ? window.console[consoleKey].bind(window.console) : window.console[consoleKey]); });
	});

	if(base.IS_NODE)
	{
		exports.error = function()
		{			
			if(arguments.length===1 && arguments[0] && arguments[0].hasOwnProperty("stack"))
				console.error(arguments[0].stack);
			else
				console.error.apply(console.error, arguments);
		};
	}
})(typeof exports==="undefined" ? window.base={} : exports);
