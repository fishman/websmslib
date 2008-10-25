/**
 *	WebSMS widget
 *
 *	© Claudio Procida 2006-2008
 *
 *	Disclaimer
 *
 *	The WebSMS Widget software (from now, the "Software") and the accompanying materials
 *	are provided “AS IS” without warranty of any kind. IN NO EVENT SHALL THE AUTHOR(S) BE
 *	LIABLE TO ANY PARTY FOR DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES,
 *	INCLUDING LOST PROFITS, ARISING OUT OF THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN
 *	IF THE AUTHOR(S) HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. The entire risk as to
 *	the results and performance of this software is assumed by you. If the software is
 *	defective, you, and not its author(s), assume the entire cost of all necessary servicing,
 *	repairs and corrections. If you do not agree to these terms and conditions, you may not
 *	install or use this software.
 *
 */

/*
Object.prototype.serialize = function()
{
	var s = "{";
	var p = [];
	for (var i in this)
	{
		if ((typeof this[i]) != "function")
			p[p.length] = i + ":" + this[i];
	}
	s += p.join(",") + "}";
	return s;
};
*/

/**
 *	@class Iterator
 *	@abstract An iterator model class.
 *	@discussion Objects of class Iterator will enumerate a set of values.
 *	Subsequent calls to the <tt>next</tt> method will return each time
 *	a different value. When the iterator has returned all the values, calls
 *	to <tt>next</tt> will return <tt>null</tt>.
 */
function Iterator()
{
	this._values = [];
	this._index = 0;
}

/**
 *	@method next
 *	@abstract Returns the next object in the set.
 */
Iterator.prototype.next = function()
{
	return this._values[this._index++];
};

/**
 *	@method hasNext
 *	@abstract Checks whether this iterator has more items to return.
 *	@result <tt>true</tt> if there are more items to return.
 */
Iterator.prototype.hasNext = function()
{
	return this._index < this._values.length;
};

/**
 *	@method withValues
 *	@abstract Fills the receiver with the given values.
 *	@discussion This method will return the iterator, so it will be useful
 *	to chain subsequent method calls (à la Ruby).
 *	@param values The values that the iterator will contain.
 */
Iterator.prototype.withValues = function(values)
{
	this._values = values;
	this._index = 0;

	return this;
};

/**
 *	@method setValues
 *	@abstract Sets the values contained by the receiver.
 *	@param values The values that this iterator will contain.
 */
Iterator.prototype.setValues = function(values)
{
	this._values = values;
	this._index = 0;
};

/**
 *	@method _all
 *	@abstract Internal method to generate an array of keys or values.
 *	@result An array of values if <tt>values</tt> is <tt>true</tt>,
 *	keys otherwise.
 */
Object.prototype._all = function(values)
{
	var all = [];
	for (var i in this)
	{
		if (typeof(this[i]) != 'function')
		{
			all.push(values ? this[i] : i);
		}
	}
	return all;
};

/**
 *	@method allValues
 *	@abstract Returns an array of all the values of the receiver
 *	considered as a dictionary.
 *	@result The array of all the values.
 */
Object.prototype.allValues = function()
{
	return this._all(true);
};

/**
 *	@method allKeys
 *	@abstract Returns an array of all the keys of the receiver
 *	considered as a dictionary.
 *	@result The array of all the keys.
 */
Object.prototype.allKeys = function()
{
	return this._all(false);
};

/**
 *	@method keyIterator
 *	@abstract Returns an iterator for the keys of the receiver.
 *	@result The iterator for the keys.
 */
Object.prototype.keyIterator = function()
{
	return new Iterator().withValues(this.allKeys());
};

/**
 *	@method valueIterator
 *	@abstract Returns an iterator for the values of the receiver.
 *	@result The iterator for the values.
 */
Object.prototype.valueIterator = function()
{
	return new Iterator().withValues(this.allValues());
};

/**
 *	@method keyForValue
 *	@abstract Returns the key of the receiver for the given value, or <tt>null</tt>
 *	if the receiver doesn't contain it.
 *	@param val The value to lookup.
 *	@result The key for <tt>val</tt>, or <tt>null</tt> if <tt>val</tt> is not contained.
 */
Object.prototype.keyForValue = function(val)
{
	for (var i in this)
	{
		if (this[i] == val)
		{
			return i;
		}
	}
	return null;
};

/**
 *	@method toQueryString
 *	@abstract Converts the receiver from a dictionary to a query string.
 *	@discussion This method will extract the keys and values from the receiver
 *	considered as a dictionary and build a query string (key1=value1&key2=value2&...)
 *	suitable for HTTP GET or POST requests.
 *	By default, the encoding charset used is UTF-8. You can provide your custom
 *	charset as a parameter.
 *	@param charset The required charset.
 *	@result The query string.
 */
Object.prototype.toQueryString = function(charset)
{
	var qs_parts = [];
	var iterator = this.keyIterator();
	for (var key; key = iterator.next();)
	{
		qs_parts.push(URL.encodeWithCharset(key, charset) + "=" +
			URL.encodeWithCharset(this[key], charset));
	}
	return qs_parts.join("&");
};

/**
 *	@method contains
 *	@abstract Checks whether the receiver contains the given element.
 *	@param element The element to search into the receiver.
 *	@returns <tt>true</tt> if the receiver contains <tt>element</tt>.
 */
Array.prototype.contains = function(element)
{
	return this.indexOf(element) != -1;
};

/**
 *	@method insert_unique
 *	@abstract Inserts <tt>element</tt> into the receiver only if it is
 *	not already contained.
 *	@param element The element to insert into the receiver.
 */
Array.prototype.insert_unique = function(element)
{
	if (!this.contains(element))
		this.push(element);
};

/**
 *	@method map
 *	@abstract Replaces every element of the receiver with the result of applying
 *	<tt>functor</tt> onto it.
 *	@param functor The function to apply to the elements of the receiver.
 *	@result The array resulting of the application of <tt>functor</tt> on the elements
 *	of the receiver.
 */
Array.prototype.map = function(functor)
{
	for (var i = 0; i < this.length; i++)
	{
		this[i] = functor(this[i]);
	}
	return this;
};

/**
 *	@method perform
 *	@abstract Replaces every element of the receiver with the result of calling
 *	<tt>method</tt> onto it.
 *	@param method A method name to invoke onto the elements of the receiver.
 *	@result The array resulting of the invocation of <tt>method</tt> on the elements
 *	of the receiver.
 */
Array.prototype.perform = function(method)
{
	for (var i = 0; i < this.length; i++)
	{
		this[i] = this[i][method]();
	}
	return this;
};

/**
 *	String additions
 */

/**
 *	@method times
 *	@abstract Repeats the receiver the desired number of times.
 *	@param num The number of times the receiver should be repeated.
 *	@result The receiver repeated the desired number of times.
 */
String.prototype.times = function(num)
{
	if (typeof(num) !== 'number')
	{
		num = 0;
	}
	var ret = '';
	for (var i = 0; i < num; i++)
	{
		ret += this;
	}
	return ret;
};

/**
 *	@method preventCached
 *	@abstract Prevents that the receiver, used as URL, is retrieved from the Cache.
 *	@discussion The method adds a unique timestamp as querystring to prevent cache reuse.
 *	@result The receiver with a timestamp appended as querystring.
 */
String.prototype.preventCached = function()
{
	var ts = new Date().getTime();
	var pos = this.indexOf("?");
	if (pos != -1)
	{
		return this + "&" + ts;
	}
	return this + "?" + ts;
};

/**
 *	@method substringFromString
 *	@abstract Extracts a substring starting from <tt>str</tt> inclusive.
 *	@param str The string to start the extraction from.
 *	@result The substring starting from <tt>str</tt> inclusive.
 */
String.prototype.substringFromString = function(str)
{
	var pos = this.indexOf(str);
	if (pos != -1)
	{
		return this.substr(pos);
	}
	return this;
};

/**
 *	@method substringToString
 *	@abstract Extracts a substring up to <tt>str</tt> not inclusive.
 *	@param str The string to end the extraction to.
 *	@result The substring up to <tt>str</tt> not inclusive.
 */
String.prototype.substringToString = function(str)
{
	var pos = this.indexOf(str);
	if (pos != -1)
	{
		return this.substr(0, pos);
	}
	return this;
};

/**
 *	@method substringAfterString
 *	@abstract Extracts a substring starting from <tt>str</tt> not inclusive.
 *	@param str The string to start the extraction after.
 *	@result The substring starting from <tt>str</tt> not inclusive.
 */
String.prototype.substringAfterString = function(str)
{
	var pos = this.indexOf(str);
	if (pos != -1)
	{
		return this.substr(pos + str.length);
	}
	return this;
};

/**
 *	@method repeat
 *	@abstract Repeats the receiver <tt>times</tt> times.
 *	@param times The number of times the receiver should be repeated.
 *	@result A string created by repeating the receiver <tt>times</tt> times.
 */
String.prototype.repeat = function(times)
{
	var buf = [];
	if (times > 0)
	{
		for (var i = 0; i < times; i++)
		{
			buf.push(this);
		}		
	}
	return buf.join("");
};

/**
 *	@method startsWith
 *	@abstract Checks whether the receiver starts with <tt>prefix</tt>.
 *	@param prefix The string to check as a prefix.
 *	@result <tt>true</tt> if the receiver starts with <tt>prefix</tt>, <tt>false</tt> otherwise.
 */
String.prototype.startsWith = function(prefix)
{
	return this.indexOf(prefix) == 0;
};

/**
 *	@method endsWith
 *	@abstract Checks whether the receiver ends with <tt>suffix</tt>.
 *	@param suffix The string to check as a suffix.
 *	@result <tt>true</tt> if the receiver ends with <tt>suffix</tt>, <tt>false</tt> otherwise.
 */
String.prototype.endsWith = function(suffix)
{
	return this.indexOf(suffix) == this.length - suffix.length;
};

/**
 *	@method sprintf
 *	@abstract Returns a formatted string by replacing the placeholders in the receivers
 *	with the arguments.
 *	@discussion This method will replace every occurrence of <tt>%s</tt> with its arguments.
 *	@param ... Variable length list of replacements.
 *	@result The formatted string.
 */
String.prototype.sprintf = function()
{
	var str = this;
	for (var i = 0; i < arguments.length; i++)
	{
		str = str.replace("%s", arguments[i]);
	}
	return str;
};

/**
 *	@method batchReplace
 *	@abstract Replaces the placeholders in the receiver with the arguments.
 *	@discussion This method will search all the occurrences of the keys of
 *	<tt>replacements</tt> contained into the receiver and replace them with
 *	the corresponding value.
 *	@param replacements A dictionary of replacements.
 *	@result The formatted string.
 */
String.prototype.batchReplace = function(replacements)
{
	var str = this;
	var iterator = replacements.keyIterator();
	// Substitute given placeholders with replacements
	for (var key; key = iterator.next();)
	{
		str = str.replace(new RegExp(key, "g"), replacements[key]);
	}
	return str;
};

/**
 *	@method nl2br
 *	@abstract Converts newlines in the receiver to XHTML's &lt;br /&gt; tags.
 *	@result The receiver with newlines converted to &lt;br /&gt; tags.
 */
String.prototype.nl2br = function()
{
	return this.replace(/\n/g, "<br />");
};

/**
 *	@method shellEscape
 *	@abstract Escapes characters that shells won't like.
 *	@result The receiver with reserved shell characters escaped.
 */
String.prototype.shellEscape = function()
{
	return this.replace(/([ \[\]\(\)\$&%:=\?\!"])/g, "\\$1");
};

/**
 *	@method addSlashes
 *	@abstract Adds slashes before quote characters.
 *	@result The receiver with escaped quotes.
 */
String.prototype.addSlashes = function()
{
	return this.replace(/"/g, "\\\"").replace(/'/g, "\'");
};

/**
 *	@method trim
 *	@abstract Remove preceding and trailing space from the receiver.
 *	@result The receiver after removing preceding and trailing space.
 */
String.prototype.trim = function()
{
	return this.replace(/^\s+/, '').replace(/\s+$/, '');
};

/**
 *	@method capitalize
 *	@abstract Capitalizes the words in the receiver.
 *	@result The receiver after capitalizing the words.
 */
String.prototype.capitalize = function()
{
	var str = this;
	var reg = /(^[a-z])|([^a-zA-Z0-9])([a-z])/g;
	while (reg.exec(str))
	{
		str = RegExp.leftContext + (RegExp.$1 ? RegExp.$1.toUpperCase() : (RegExp.$2 + RegExp.$3.toUpperCase())) + RegExp.rightContext;
	}
	return str;
};

/**
 *	@method clipToLength
 *	@abstract Clips the receiver if longer than <tt>len</tt>, and appends an ellipsis "...".
 *	@param len The maximum length of the desired result.
 *	@result The receiver clipped to <tt>len</tt> characters with an ellipsis "...", or the receiver if shorter than <tt>len</tt>.
 */
String.prototype.clipToLength = function(len)
{
	var str = this;
	if (str.length > len)
	{
		return str.substring(0, len) + "...";
	}
	return str;
};

/**
 *	@method shrinkToLength
 *	@abstract Clips the receiver if longer than <tt>len</tt>, and inserts an ellipsis "..." in the middle.
 *	@param len The maximum length of the desired result.
 *	@result The receiver clipped to <tt>len</tt> characters with an ellipsis "..." inserted in the middle, or the receiver if shorter than <tt>len</tt>.
 */
String.prototype.shrinkToLength = function(len)
{
	var str = this;
	if (str.length > len)
	{
		var demilen = Math.floor(len / 2);
		return str.substring(0, demilen) + "..." +
			str.substring(str.length - demilen);
	}
	return str;
};

/**
 *	@method plistToDictionary
 *	@abstract Converts the receiver from old (not XML) plist format to JS dictionary.
 *	@result A dictionary with keys and values from the receiver.
 */
String.prototype.plistToDictionary = function()
{
	var str = this;
	str = str.replace(/([^" ]+) = /g, " \"$1\" = ").replace(/ = ([^" ]+);/g, " = \"$1\";").replace(/ = /g, " : ").replace(/; \n/g, ", \n").replace(/, \n\}$/, "\n}");
	return eval("__dict = " + str);
};

/**
 *	@method olderThan
 *	@abstract Compares two strings considered as version numbers.
 *	@param other A version number to compare the receiver to.
 *	@result <tt>true</tt> if the receiver is a version number smaller than <tt>other</tt>, <tt>false</tt> otherwise.
 */
String.prototype.olderThan = function(other)
{
	var myVersionNumbers = this.split("."),
		otherVersionNumbers = other.split(".");

	var len = Math.max(myVersionNumbers.length, otherVersionNumbers.length);

	for (var i = 0; i < len; i++)
	{
		if (!myVersionNumbers[i])
			myVersionNumbers[i] = 0;
		if (!otherVersionNumbers[i])
			otherVersionNumbers[i] = 0;
	}

	for (var i = 0; i < len; i++)
	{
		var mine = parseInt(myVersionNumbers[i], 10);
		var other = parseInt(otherVersionNumbers[i], 10);
		
		// Compare corresponding version numbers
		if (mine < other)
			return true;
		else if (mine > other)
			return false;
	}
	return false;
};

/**
 *	@method striptags
 *	@abstract Removes HTML tags from the receiver.
 *	@result The receiver with all HTML tags stripped.
 */
String.prototype.striptags = function()
{
	var text = this;
	// Removes tags from 
	var p = 0, q = 0, r = 0, b = '';
	while (p < text.length)
	{
		p = text.indexOf('<', r);
		if (p != -1)
		{
			b += text.substring(r, p);
			q = text.indexOf('>', p);
			if (q != -1)
			{
				r = q + 1;
			}
		}
		else
		{
			b += text.substring(r);
			break;
		}
	}
	return b;
};

/**
 *	@method rot13
 *	@abstract Encodes the receiver with the ROT13 algorithm.
 *	@discussion The ROT13 algorithm is commonly used in Usenet newsgroups to hide
 *	parts of messages from the majority of users.
 *	It is a weak encoding algorithm therefore it should not be relied upon for sensitive data.
 *	@result A ROT13 encoded string.
 */
String.prototype.rot13 = function()
{
	var str = this;
	var rotted = [];
	if (str)
	{
		var middle = "n".charCodeAt(0);
		var chr, cod;
		for (var i = 0; i < str.length; i++)
		{
			chr = str.charAt(i).toLowerCase();
			cod = str.charCodeAt(i)
			if ('a' <= chr && chr <= 'z')
				cod += (chr < 'n') ? 13 : -13;
			rotted.push(String.fromCharCode(cod));
		}
	}
	return rotted.join("");
};

/**
 *	@method makeCallbackTarget
 *	@abstract Creates a callback which will call the receiver on <tt>target</tt>.
 *	@param target The target of the receiver.
 *	@result A callback function which will call the receiver on <tt>target</tt>.
 */
Function.prototype.makeCallbackTarget = function(target)
{
	var method = this;
	return function()
	{
		return method.apply(target, arguments);
	};
};

function URL(the_url)
{
	this._url = the_url;
}

URL.encodeWithCharset = function(str, charset)
{
	return (charset != "utf-8" ? URL.escape : encodeURIComponent)(str);
};

URL.decodeWithCharset = function(str, charset)
{
	return (charset != "utf-8" ? unescape : decodeURIComponent)(str);
};

URL.escape = function(str)
{
	str = escape(str);
	return str.replace(/\+/g, "%2B");
};

/**
 *	Add functionality to the widget object
 */

window.getInfoDictionary = function() { return {}; };
window.getInfoDictionaryValueForKey = function() { return null; };
if (window.widget)
{
	window.getInfoDictionary = function()
	{
		// retrieves property from Info.plist file
		var command = '/bin/sh -c "/usr/bin/defaults read \'`pwd`/Info\'"';
		//__DEBUG(command);
		var oString = widget.system(command, null).outputString;
		//__DEBUG(oString);
		return oString.plistToDictionary();
	};

	window.getInfoDictionaryValueForKey = function(key)
	{
		// retrieves property from Info.plist file
		var command = '/bin/sh -c "/usr/bin/defaults read \'`pwd`/Info\' ' + key + '"';
		//__DEBUG(command);
		var oString = widget.system(command, null).outputString;
		//__DEBUG(oString);
		return oString;
	};

	window.getSystemLanguage = function()
	{
		var SYSTEM_LANGUAGE_KEY = "language.";
		var SYSTEM_LANGUAGE = widget.preferenceForKey(SYSTEM_LANGUAGE_KEY + widget.identifier);
		if (!SYSTEM_LANGUAGE)
		{
			var command = '/bin/sh -c "/usr/bin/defaults read NSGlobalDomain AppleLanguages"';
			__DEBUG(command);
			var oString = widget.system(command, null).outputString;

			SYSTEM_LANGUAGE = oString.substringAfterString("(").substringToString(")").split(",")[0].trim();
			widget.setPreferenceForKey(SYSTEM_LANGUAGE, SYSTEM_LANGUAGE_KEY + widget.identifier);
		}
		return SYSTEM_LANGUAGE;
	};
}
