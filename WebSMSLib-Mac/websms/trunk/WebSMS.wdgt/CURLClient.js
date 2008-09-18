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
 *
 */
 
/**
 *	Constants
 */

var CURLOPT_POST = "CURLOPT_POST";
var CURLOPT_POSTFIELDS = "CURLOPT_POSTFIELDS";
var CURLOPT_USERAGENT = "CURLOPT_USERAGENT";
var CURLOPT_REFERER = "CURLOPT_REFERER";
var CURLOPT_FOLLOWLOCATION = "CURLOPT_FOLLOWLOCATION";
var CURLOPT_MUTE = "CURLOPT_MUTE";
var CURLOPT_VERBOSE = "CURLOPT_VERBOSE";
var CURLOPT_RETURNTRANSFER = "CURLOPT_RETURNTRANSFER";
var CURLOPT_URL = "CURLOPT_URL";
var CURLOPT_ASYNC = "CURLOPT_ASYNC";
var CURLOPT_RETURNFUNCTION = "CURLOPT_RETURNFUNCTION";
var CURLOPT_FILE = "CURLOPT_FILE";
var CURLOPT_CHARSET = "CURLOPT_CHARSET";

/* Cookies */
var CURLOPT_COOKIE = "CURLOPT_COOKIE";
var CURLOPT_COOKIEFILE = "CURLOPT_COOKIEFILE";
var CURLOPT_COOKIEJAR = "CURLOPT_COOKIEJAR";

/* Proxy */
var CURLOPT_PROXY = "CURLOPT_PROXY";
var CURLOPT_PROXYPORT = "CURLOPT_PROXYPORT";
var CURLOPT_PROXYUSERPWD = "CURLOPT_PROXYUSERPWD";

var CURLOPT_PROXYTYPE = "CURLOPT_PROXYTYPE";
var CURLPROXY_HTTP = "proxy";
var CURLPROXY_SOCKS5 = "socks";

var CURLOPT_PROXYAUTH = "CURLOPT_PROXYAUTH";
var CURLOPT_HTTPAUTH = "CURLOPT_HTTPAUTH";
var CURLOPT_USERPWD = "CURLOPT_USERPWD";
var CURLAUTH_BASIC = "basic";
var CURLAUTH_DIGEST = "digest";
var CURLAUTH_NTLM = "ntlm";

/**
 *	@class CURLClient
 *	@abstract Wrapper object for CURL HTTP requests.
 */
function CURLClient()
{
	this._options = {};
	this._flags = "";
	this._task = null;
}

/**
 *	@method sanitize
 *	@abstract Removes sensible information from a string.
 */
CURLClient.prototype.sanitize = function(text)
{
	if (this._options[CURLOPT_USERPWD])
	{
		var password = this._options[CURLOPT_USERPWD].split(':')[1];
		var reg = new RegExp(password, 'gi');
		text = text.replace(reg, '*'.times(password.length));
	}
	if (this._options[CURLOPT_PROXYUSERPWD])
	{
		var proxy_password = this._options[CURLOPT_PROXYUSERPWD].split(':')[1];
		var reg = new RegExp(proxy_password, 'gi');
		text = text.replace(reg, '*'.times(proxy_password.length));
	}
	return text;
};

/**
 *	@method applyProxySettings
 *	@abstract Applies the desired proxy settings to the CURL requests.
 *	@param proxy The proxy object.
 */
CURLClient.prototype.applyProxySettings = function(proxy)
{
	if (proxy.proxyType != "none")
	{
		this.setOptionForKey(Proxy.proxyType, CURLOPT_PROXYTYPE);
		this.setOptionForKey(Proxy.proxyAuth, CURLOPT_PROXYAUTH);
		this.setOptionForKey(Proxy.proxyHost, CURLOPT_PROXY);
		this.setOptionForKey(Proxy.proxyPort, CURLOPT_PROXYPORT);
		this.setOptionForKey("%s:%s".sprintf(Proxy.proxyUsername, Proxy.proxyPassword), CURLOPT_PROXYUSERPWD);
	}
	else
	{
		this.setOptionForKey(null, CURLOPT_PROXYTYPE);
	}
};

/**
 *	@method cancel
 *	@abstract Cancels the execution of the CURL request.
 */
CURLClient.prototype.cancel = function()
{
	if (this._task)
	{
		//__DEBUG("[CURLClient] Canceling task");
		this._task.cancel();
		this._task = null;
	}
};

/**
 *	@method reset
 *	@abstract Resets the receiver.
 */
CURLClient.prototype.reset = function()
{
	this._options = {};
	this._task = null;
};

/**
 *	@method setFlags
 *	@abstract Sets the commandline CURL flags.
 *	@param flags A string of flags.
 */
CURLClient.prototype.setFlags = function(flags)
{
	this._flags = flags;
};

/**
 *	@method setCharset
 *	@abstract Instructs the receiver to work with the given charset.
 *	@discussion Since all the internal processing is done in UTF-8, responses need
 *	to be converted to UTF-8 if using a different encoding. Conversion is performed
 *	by piping the output of CURL to <tt>iconv</tt>.
 *	@param charset The character encoding of the server response.
 */
CURLClient.prototype.setCharset = function(charset)
{
	this._options[CURLOPT_CHARSET] = charset;
};

/**
 *	@method setOptionForKey
 *	@abstract Sets the CURL option for the given key.
 *	@param value The value of the option.
 *	@param key The key of the option.
 */
CURLClient.prototype.setOptionForKey = function(value, key)
{
	this._options[key] = value;
};

/**
 *	@method optionForKey
 *	@abstract Returns the CURL option for the given key.
 *	@param key The key of the option.
 *	@result The CURL option for the given key.
 */
CURLClient.prototype.optionForKey = function(key)
{
	return this._options[key] || null;
};

/**
 *	@method exec
 *	@abstract Performs a CURL request.
 */
CURLClient.prototype.exec = function()
{
	var command = "/usr/bin/curl";

	if (this._flags)
	{
		command += " %s".sprintf(this._flags);
	}
	if (this._options[CURLOPT_FOLLOWLOCATION])
	{
		command += " -L";
	}
	if (this._options[CURLOPT_MUTE])
	{
		command += " -s";
	}

	if (this._options[CURLOPT_HTTPAUTH])
	{
		command += " --%s".sprintf(this._options[CURLOPT_HTTPAUTH]);
	}
	
	if (this._options[CURLOPT_USERPWD])
	{
		command += " -u %s".sprintf(this._options[CURLOPT_USERPWD]);
	}

	if (this._options[CURLOPT_PROXYTYPE])
	{
		command += " --%s %s:%s".sprintf(this._options[CURLOPT_PROXYTYPE],
			this._options[CURLOPT_PROXY],
			this._options[CURLOPT_PROXYPORT]);
		if (this._options[CURLOPT_PROXYUSERPWD])
		{
			command += " --proxy-%s".sprintf(this._options[CURLOPT_PROXYAUTH]);
			command += " --proxy-user %s".sprintf(this._options[CURLOPT_PROXYUSERPWD]);
		}
	}

	if (this._options[CURLOPT_POST] && 
		this._options[CURLOPT_POSTFIELDS])
	{
		command += ' -d "' + this._options[CURLOPT_POSTFIELDS] + '"';
	}
	if (this._options[CURLOPT_COOKIEFILE])
	{
		command += ' -b "' + this._options[CURLOPT_COOKIEFILE] + '"';
	}
	if (this._options[CURLOPT_COOKIE])
	{
		command += ' -b "' + this._options[CURLOPT_COOKIE].toQueryString(this._options[CURLOPT_CHARSET]) + '"';
	}
	if (this._options[CURLOPT_COOKIEJAR])
	{
		command += ' -c "' + this._options[CURLOPT_COOKIEJAR] + '"';
	}
	if (this._options[CURLOPT_USERAGENT])
	{
		command += ' -A "' + this._options[CURLOPT_USERAGENT] + '"';
	}
	if (this._options[CURLOPT_REFERER])
	{
		command += ' -e "' + this._options[CURLOPT_REFERER] + '"';
	}
	if (this._options[CURLOPT_FILE])
	{
		command += ' -o "' + this._options[CURLOPT_FILE] + '"';
	}
	if (this._options[CURLOPT_URL])
	{
		command += ' "' + this._options[CURLOPT_URL] + '"';
	}
	else
	{
		// A URL must be provided in order to work
		return false;
	}
	if (this._options[CURLOPT_CHARSET])
	{
		command += " | iconv -f %s -t utf-8".sprintf(this._options[CURLOPT_CHARSET]);
	}

	__DEBUG(this.sanitize(command));

	if (this._options[CURLOPT_ASYNC])
	{
		if (this._options[CURLOPT_RETURNFUNCTION])
		{
			var me = this;
			var callback = this._options[CURLOPT_RETURNFUNCTION];
			var response = widget.system(command, function()
			{
				me.cancel();
				__DEBUG(me.sanitize(response.outputString));
				callback(response.outputString);
			});
			this._task = response;
		}
		else
		{
			// I need a callback to perform an
			// asynchronous request
			return false;
		}
	}
	else
	{
		// This implementation simply doesn't work with
		// synchronous requests
		this._task = widget.system(command, null);
		
		__DEBUG(this.sanitize(this._task.outputString));
		
		return this._task.outputString;
	}
};

/**
 *	@method setPostData
 *	@abstract Sets post data.
 *	@discussion This method is a shorthand for <tt>setOptionForKey</tt>.
 *	It sets the value of the CURLOPT_POST option to <tt>true</tt>, and
 *	the value of the CURLOPT_POSTFIELDS option to <tt>data</tt>.
 *	@param data A URL-encoded query string.
 */
CURLClient.prototype.setPostData = function(data)
{
	this._options[CURLOPT_POST] = true;
	this._options[CURLOPT_POSTFIELDS] = data;
};

/**
 *	@method setReferrer
 *	@abstract Sets the Referer request header.
 *	@discussion This method is a shorthand for <tt>setOptionForKey</tt>.
 *	It sets the value of the CURLOPT_REFERER option to <tt>ref</tt>.
 *	@param ref A URL to set as referrer.
 */
CURLClient.prototype.setReferrer = function(ref)
{
	this._options[CURLOPT_REFERER] = ref;
};

/**
 *	@method setCookieJar
 *	@abstract Sets the Cookie Jar.
 *	@discussion This method is a shorthand for <tt>setOptionForKey</tt>.
 *	It sets the value of the CURLOPT_COOKIEJAR option to <tt>jarfile</tt>.
 *	@param jarfile The path to the cookie jar file.
 */
CURLClient.prototype.setCookieJar = function(jarfile)
{
	this._options[CURLOPT_COOKIEJAR] = jarfile;
};

/**
 *	@method setCookies
 *	@abstract Sets the Cookie request header.
 *	@discussion This method is a shorthand for <tt>setOptionForKey</tt>.
 *	It sets the value of the CURLOPT_COOKIE option to <tt>dict</tt>.
 *	@param dict A dictionary of cookies as pairs (name, value).
 */
CURLClient.prototype.setCookies = function(dict)
{
	this._options[CURLOPT_COOKIE] = dict;
};

/**
 *	@method setCookieFile
 *	@abstract Sets the Cookie file.
 *	@discussion This method is a shorthand for <tt>setOptionForKey</tt>.
 *	It sets the value of the CURLOPT_COOKIEFILE option to <tt>cookiefile</tt>.
 *	@param cookiefile The path to the cookie file.
 */
CURLClient.prototype.setCookieFile = function(cookiefile)
{
	this._options[CURLOPT_COOKIEFILE] = cookiefile;
};

/**
 *	@method setUserAgent
 *	@abstract Sets the User-Agent request header.
 *	@discussion This method is a shorthand for <tt>setOptionForKey</tt>.
 *	It sets the value of the CURLOPT_USERAGENT option to <tt>agent</tt>.
 *	@param agent A string to send as User-Agent header.
 */
CURLClient.prototype.setUserAgent = function(agent)
{
	this._options[CURLOPT_USERAGENT] = agent;
};

/**
 *	@method setURL
 *	@abstract Sets the URL of the request.
 *	@discussion This method is a shorthand for <tt>setOptionForKey</tt>.
 *	It sets the value of the CURLOPT_URL option to <tt>URL</tt>.
 *	@param URL The URL to fetch.
 */
CURLClient.prototype.setURL = function(URL)
{
	this._options[CURLOPT_URL] = URL;
};

/**
 *	@method setAsync
 *	@abstract Sets the working mode to asynchronous or synchronous.
 *	@discussion This method is a shorthand for <tt>setOptionForKey</tt>.
 *	It sets the value of the CURLOPT_ASYNC option to <tt>yorn</tt>.
 *	@param yorn <tt>true</tt> if the CURL request should be done asynchronously.
 */
CURLClient.prototype.setAsync = function(yorn)
{
	this._options[CURLOPT_ASYNC] = yorn;
};

/**
 *	@method setOutfile
 *	@abstract Sets the output file.
 *	@discussion This method is a shorthand for <tt>setOptionForKey</tt>.
 *	It sets the value of the CURLOPT_FILE option to <tt>file</tt>.
 *	By default, CURL returns the response to the caller.
 *	You can explicitly request CURL to flush the response to a file (e.g
 *	when fetching a binary file, like an image) by setting this option.
 *	@param file The path to the output file.
 */
CURLClient.prototype.setOutfile = function(file)
{
	this._options[CURLOPT_FILE] = file;
};

/**
 *	@method setAuthentication
 *	@abstract Sets the authentication scheme used in the request.
 *	@discussion This method is a shorthand for <tt>setOptionForKey</tt>.
 *	It sets the value of the CURLOPT_HTTPAUTH option to <tt>auth</tt>.
 *	By default, CURL uses the <tt>basic</tt> authentication scheme.
 *	@param auth The desired authentication scheme.
 */
CURLClient.prototype.setAuthentication = function(auth)
{
	this._options[CURLOPT_HTTPAUTH] = auth;
};

/**
 *	@method setUsernameAndPassword
 *	@abstract Sets the username and password for the authentication.
 *	@discussion This method is a shorthand for <tt>setOptionForKey</tt>.
 *	It sets the value of the CURLOPT_USERPWD option to <tt>username:password</tt>.
 *	@param username The username for authentication.
 *	@param password The password for authentication.
 */
CURLClient.prototype.setUsernameAndPassword = function(username, password)
{
	this.setOptionForKey("%s:%s".sprintf(username, password), CURLOPT_USERPWD);
};

/**
 *	Callbacks
 */

/**
 *	@method setCallback
 *	@abstract Sets the callback function.
 *	@discussion This method is a shorthand for <tt>setOptionForKey</tt>.
 *	It sets the value of the CURLOPT_RETURNFUNCTION option to <tt>callback</tt>.
 *	The callback function should accept a single parameter, which
 *	will contain the server response.
 *	@param callback A function to call when the response is available.
 */
CURLClient.prototype.setCallback = function(callback)
{
	//__DEBUG("CURLClient setCallback");
	this._options[CURLOPT_RETURNFUNCTION] = callback;
};

/**
 *	@method setDelegate
 *	@abstract Sets the client's delegate.
 *	@discussion This implementation actually sets the delegate's method
 *	<tt>responseDidBecomeAvailable</tt> as callback by calling <tt>setCallback</tt>.
 *	The delegate function should accept a single parameter, which
 *	will contain the server response.
 *	@param delegate A delegate which responds to <tt>responseDidBecomeAvailable</tt>.
 */
CURLClient.prototype.setDelegate = function(delegate)
{
	//__DEBUG("CURLClient setDelegate");
	this.setCallback(delegate.responseDidBecomeAvailable.makeCallbackTarget(delegate));
};
