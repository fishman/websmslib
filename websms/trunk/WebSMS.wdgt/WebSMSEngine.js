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
 *	Changelog
 *	---------
 *	2008-03-08	Call to _startTimeoutTimer preponed to _transportClient.exec to cope with
 *				synchronous transport handlers (SMBClient).
 *	2008-02-05	Created.
 *
 */

// Sending timeout interval (milliseconds)
// 30 seconds should be enough for anything
var WEBSMSENGINE_SENDING_TIMEOUT = 30000;

/**
 *	WebSMSEngine Class
 */

function WebSMSEngine()
{
	// A delegate to manage user interactive input
	this._delegate = null;
	// Plugin with configuration settings
	this._plugin = null;
	// Current provider
	this._provider = null;
	// Current step in sending process
	this._step = 0;
	// Timeout timer
	this._timer = null;
	// Replacements for placeholders in URLs
	this._replacements = {};
	// A code for the CAPTCHA image
	this._captchaCode = null;
	// A source for the CAPTCHA image
	this._captchaSrc = null;
	// true if the engine should abort sending
	this._shouldAbortSending = false;
	// Transport Client for HTTP operations
	this._transportClient = null;
	// User agent for HTTP requests
	this._userAgent = window.userAgent();
}

/**
 *	@method abort
 *	@abstract Requests the abortion of the current sending.
 */
WebSMSEngine.prototype.abort = function()
{
	this._shouldAbortSending = true;
};

/**
 *	@method setPlugin
 *	@abstract Configures the engine with the given plugin.
 *	@param plugin The plugin with configuration instructions.
 */
WebSMSEngine.prototype.setPlugin = function(plugin)
{
	this._plugin = plugin;
	if (typeof(Plugins) != "undefined")
	{
		this._provider = Plugins.keyForValue(plugin);
	}
	else
	{
		this._provider = "websmsengine";
	}
	switch (this._plugin.transport)
	{
		case 'smb':
			this._transportClient = new SMBClient();
			break;
		default:
			this._transportClient = new CURLClient();
	}
};

/**
 *	@method setCaptchaCode
 *	@abstract Provides the code for the current captcha image.
 *	@discussion This method should be called when the user has entered
 *	a captcha code, which has been previously requested with a call
 *	to <tt>requestCaptchaCode</tt> to the delegate.
 *	@param code The code for the current captcha.
 */
WebSMSEngine.prototype.setCaptchaCode = function(code)
{
	this._step++;
	this._captchaCode = code;
	this._replacements['%CAPTCHA%'] = code;
};

/**
 *	@method setDelegate
 *	@abstract Sets the delegate of the engine.
 *	@discussion The delegate should respond (but it is not required to)
 *	to the following methods:
 *
 *	sendingSucceeded()
 *	sendingFailed()
 *	sendingError(error)
 *	requestCaptchaCode(captcha_src)
 *	availableMessages(num_msg)
 *
 *	@param delegate The delegate object.
 */
WebSMSEngine.prototype.setDelegate = function(delegate)
{
	this._delegate = delegate;
};

/**
 *	@method setReplacements
 *	@abstract Sets a dictionary of replacements for the placeholders
 *	contained into plugin URLs.
 *	@param dict A dictionary of pairs (placeholder, replacements) to
 *	be replaced in plugin URLs.
 */
WebSMSEngine.prototype.setReplacements = function(dict)
{
	this._replacements = dict;
};

/**
 *	@method replacements
 *	@abstract Returns the dictionary of replacements for the placeholders
 *	contained into plugin URLs.
 *	@result A dictionary of pairs (placeholder, replacements) used to
 *	replace placeholders in plugin URLs.
 */
WebSMSEngine.prototype.replacements = function()
{
	return this._replacements;
};

/**
 *	@method showCaptcha
 *	@abstract Requests the delegate to show a captcha code.
 */
WebSMSEngine.prototype.showCaptcha = function()
{
	if (this._delegate.requestCaptchaCode)
		this._delegate.requestCaptchaCode(this._captchaSrc);
};

/**
 *	@method _performCaptchaRequest
 *	@abstract Performs the request for the captcha image.
 */
WebSMSEngine.prototype._performCaptchaRequest = function()
{
	this._prepareCaptchaRequest();
	this._transportClient.setCallback(this.showCaptcha.makeCallbackTarget(this));
	this._transportClient.setAsync(true);
	this._transportClient.exec();
};

/**
 *	@method _checkErrors
 *	@abstract Searches for error markers in the response.
 *	@param response The server response.
 */
WebSMSEngine.prototype._checkErrors = function(response)
{
	if (this._plugin.steps[this._step].check)
	{
		var check = this._plugin.steps[this._step].check;
		for (var j = 0; j < check.length; j++)
		{
			if (check[j].match.test(response))
			{
				if (this._delegate.sendingError)
				{
					this._delegate.sendingError(check[j].reason);
				}
				return false;
			}
		}
	}
	return true;
};

/**
 *	@method _extractVars
 *	@abstract Extracts variable values from the response.
 *	@param response The server response.
 */
WebSMSEngine.prototype._extractVars = function(response)
{
	if (this._plugin.steps[this._step].vars)
	{
		var vars = this._plugin.steps[this._step].vars;
		for (var j = 0; j < vars.length; j++)
		{
			var index = vars[j].index || 1;
			if (vars[j].match.global)
			{
				// Use RegExp.exec() to get all matches
				var matches = [];
				var match = null;
				while ((match = vars[j].match.exec(response)) != null)
				{
					matches.push(match[index]);
				}
				__DEBUG("Set " + vars[j].name + " = '" + matches + "'");

				this._replacements["%" + vars[j].name + "%"] = matches;
			}
			else
			{
				// Use RegExp.test() to get the match
				if (vars[j].match.test(response))
				{
					__DEBUG("Set " + vars[j].name + " = '" + RegExp.$1 + "'");

					this._replacements["%" + vars[j].name + "%"] = vars[j].escape == false ?
						RegExp.$1 :
						URL.encodeWithCharset(RegExp.$1, this._plugin.charset);
				}
			}
		}
	}
};

/**
 *	@method _checkAvailability
 *	@abstract Checks whether the current step allows a check for the
 *	number of available messages, and notify the delegate if found.
 *	@param response The server response.
 */
WebSMSEngine.prototype._checkAvailability = function(response)
{
	if (this._plugin.steps[this._step].availabilityCheck)
	{
		var avail = this._plugin.steps[this._step].availabilityCheck(response);
		if (this._delegate.availableMessages)
		{
			this._delegate.availableMessages(avail);
		}
	}
};

/**
 *	@method _captchaRequired
 *	@abstract Checks whether the current step requires a captcha
 *	confirmation image.
 *	@result <tt>true</tt> if the current step requires a captcha.
 */
WebSMSEngine.prototype._captchaRequired = function()
{
	return (this._plugin.steps[this._step].captcha &&
		!this._captchaCode);
};

/**
 *	@method refreshCaptcha
 *	@abstract Performs a subsequent request for the captcha image.
 *	@discussion Implementors will call this method when the user
 *	request another captcha image because the current image can't
 *	be easily interpreted.
 */
WebSMSEngine.prototype.refreshCaptcha = function()
{
	this._performCaptchaRequest();
};

/**
 *	@method _timeoutExpired
 *	@abstract Called when the sending timeout timer has fired.
 */
WebSMSEngine.prototype._timeoutExpired = function()
{
	if (this._delegate.sendingError)
	{
		this._delegate.sendingError(getLocalizedString("Sending timeout expired"));
	}
	this._timer = null;
	this.reset();
	this._transportClient.cancel();
};

/**
 *	@method _startTimeoutTimer
 *	@abstract Starts the timeout timer.
 */
WebSMSEngine.prototype._startTimeoutTimer = function()
{
	// Clear if already set
	if (this._timer != null)
	{
		this._clearTimeoutTimer();
	}
	// Defer invocation of _timeoutExpired
	this._timer = setTimeout(this._timeoutExpired.makeCallbackTarget(this),
		WEBSMSENGINE_SENDING_TIMEOUT);
};

/**
 *	@method _clearTimeoutTimer
 *	@abstract Clears the timeout timer.
 */
WebSMSEngine.prototype._clearTimeoutTimer = function()
{
	if (this._timer != null)
	{
		clearTimeout(this._timer);
		this._timer = null;
	}
};

/**
 *	@method responseDidBecomeAvailable
 *	@abstract Handles the response returned by the network client.
 *	@discussion According to the current plugin settings, the engine
 *	will parse the response, extract variables, detect error situations,
 *	find success markers, get the number of available messages left etc.
 *	Delegate methods <tt>sendingError</tt>, <tt>sendingFailed</tt> and
 *	<tt>sendingSucceeded</tt> are invoked when encountering an error, sending
 *	resulted in a failure or in a success at the end, respectively.
 *	If the number of available messages has been obtained, the delegate
 *	method <tt>availableMessages</tt> will be called.
 *	When a captcha is required to proceed, a call to <tt>showCaptcha</tt>
 *	will be performed.
 *	@param response The response received by the network client.
 */
WebSMSEngine.prototype.responseDidBecomeAvailable = function(response)
{
	// Clear timeout timer
	this._clearTimeoutTimer();

	try
	{
		if (response && typeof (response) != "undefined")
		{
			// Search for error markers in the response
			// If one is found, abort the process.
			if (!this._checkErrors(response)) return;

			// Extract plugin defined variables
			// from the response
			this._extractVars(response);

			// Check for service availability by
			// examining the response
			this._checkAvailability(response);

			// If the current step requires a Captcha to be read,
			// prompt the user and get out of this function.
			// The user will resume the sending by entering the text.
			if (this._captchaRequired())
			{
				this._performCaptchaRequest();
				return;
			}
		}
		else
		{
			// If proxy is in use, it may be incorrect
			if (typeof(Proxy) != "undefined"
				&& Proxy.inUse())
			{
				if (this._delegate.sendingError)
				{
					this._delegate.sendingError(getLocalizedString("Bad proxy"));
				}
				return;
			}
		}
	}
	catch (e)
	{
		// Go on til the end
		alert("[WebSMSEngine] ***Exception***: " + e);
	}

	if (++this._step < this._plugin.steps.length)
	{
		// Proceed to next step
		if (!this._shouldAbortSending)
			this.send();
	}
	else
	{
		// At final step. Checking for success marker
		if (response.match(this._plugin.success_marker))
		{
			if (this._delegate.sendingSucceeded)
			{
				this._delegate.sendingSucceeded();
			}
		}
		else
		{
			if (this._delegate.sendingFailed)
			{
				this._delegate.sendingFailed();
			}
		}
		this.reset();
	}
};

/**
 *	@method reset
 *	@abstract Reset the engine, bringing it to the initial state.
 */
WebSMSEngine.prototype.reset = function()
{
	this._clearTimeoutTimer();
	this.abort();
	this._captchaCode = null;
	this._step = 0;
};

/**
 *	@method send
 *	@abstract Starts the sending process.
 */
WebSMSEngine.prototype.send = function()
{
	// Clear any previous timeout timer
	this._clearTimeoutTimer();
	
	//__DEBUG("send");
	if (!this._plugin)
	{
		__DEBUG("[WebSMSEngine] I can't continue without a plugin");
		return;
	}
	if (!this._delegate)
	{
		__DEBUG("[WebSMSEngine] I can't continue without a delegate");
		return;
	}
	this._shouldAbortSending = false;

	this._prepareRequest();

	this._transportClient.setDelegate(this);
	this._transportClient.setAsync(true);

	// Start timeout timer
	this._startTimeoutTimer();

	this._transportClient.exec();	
};

/**
 *	@method _prepareCaptchaRequest
 *	@abstract Prepares the request for a captcha image.
 */
WebSMSEngine.prototype._prepareCaptchaRequest = function()
{
	var current_step = this._plugin.steps[this._step];
	this._transportClient.reset();
	if (this._plugin.charset)
	{
		this._transportClient.setCharset(this._plugin.charset);
	}
	this._transportClient.setURL(current_step.captcha.batchReplace(this._replacements));
	this._transportClient.setReferrer(current_step.action.batchReplace(this._replacements));
	if (this._step > 0)
	{
		this._transportClient.setCookieFile("/var/tmp/websms.%s.cookie.%s.txt".sprintf(this._provider, (this._step + 1)));
	}
	this._transportClient.setCookieJar("/var/tmp/websms.%s.cookie.%s.txt".sprintf(this._provider, (this._step + 1)));
	this._transportClient.setUserAgent(this._userAgent);
	if (current_step.flags)
	{
		this._transportClient.setFlags(current_step.flags);
	}
	this._captchaSrc = "/var/tmp/websms.%s.captcha.%s".sprintf(this._provider, new Date().getTime());
	this._transportClient.setOutfile(this._captchaSrc);
	/* Proxy section */
	if (typeof(Proxy) != "undefined"
		&& Proxy.inUse())
	{
		this._transportClient.applyProxySettings(Proxy);
	}
	if (current_step.cookies)
	{
		var cookies = current_step.cookies;
		var dict = {};
		for (var i = 0; i < cookies.length; i++)
		{
			dict[cookies[i].name] = cookies[i].value;
		}
		this._transportClient.setCookies(dict);
	}
};

/**
 *	@method _prepareRequest
 *	@abstract Prepares the request for the current sending step.
 */
WebSMSEngine.prototype._prepareRequest = function()
{
	var current_step = this._plugin.steps[this._step];
	this._transportClient.reset();
	if (this._plugin.authentication)
	{
		this._transportClient.setAuthentication(this._plugin.authentication);
		this._transportClient.setUsernameAndPassword(this._plugin.username.batchReplace(this._replacements),
			this._plugin.password.batchReplace(this._replacements));
	}
	if (this._plugin.charset)
	{
		this._transportClient.setCharset(this._plugin.charset);
	}
	this._transportClient.setURL(current_step.action.batchReplace(this._replacements));
	if (current_step.data)
	{
		this._transportClient.setPostData(current_step.data.batchReplace(this._replacements));
	}
	if (current_step.referrer)
	{
		this._transportClient.setReferrer(current_step.referrer.batchReplace(this._replacements));
	}
	if (this._step > 0)
	{
		this._transportClient.setCookieFile("/var/tmp/websms.%s.cookie.%s.txt".sprintf(this._provider, this._step));
	}
	this._transportClient.setCookieJar("/var/tmp/websms.%s.cookie.%s.txt".sprintf(this._provider, (this._step + 1)));
	this._transportClient.setUserAgent(this._userAgent);
	if (current_step.flags)
	{
		this._transportClient.setFlags(current_step.flags);
	}
	/* Proxy section */
	if (typeof(Proxy) != "undefined"
		&& Proxy.inUse())
	{
		this._transportClient.applyProxySettings(Proxy);
	}
	if (current_step.cookies)
	{
		var cookies = current_step.cookies;
		var dict = {};
		for (var i = 0; i < cookies.length; i++)
		{
			dict[cookies[i].name] = cookies[i].value;
		}
		this._transportClient.setCookies(dict);
	}
};

if (typeof (window.userAgent) == "undefined")
{
	var WEBSMSENGINE_USERAGENT = "Mozilla/5.0 (WebSMSEngine; Emeraldion)";
	window.userAgent = function()
	{
		return WEBSMSENGINE_USERAGENT;
	};
}
