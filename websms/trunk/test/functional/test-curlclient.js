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
 */

/**
 *	test-curlclient.js
 */

/**
 *	Mock Objects
 */

var widget = 
{
	system: function(cmd, callback)
	{
		this._last_cmd = cmd;
		//__DEBUG(cmd);
		var result;
		switch (cmd)
		{
			case '/usr/bin/curl "http://www.google.com" | iconv -f macroman -t utf-8':
				result = "this is google";
				break;
			case '/usr/bin/curl "http://www.google.com"':
				result = "this is google";
				break;
			default:
				result = "ciao";
		}

		this.outputString = result;
		this.status = 0;
		if (callback)
		{
			this._timeout = setTimeout(callback, 100, this);
		}
		return this;
	},
	cancel: function()
	{
		if (this._timeout)
		{
			clearTimeout(this._timeout);
			this._timeout = null;
		}
	},
	_result: null,
	_last_cmd: null
};

var Proxy = {
	proxyType : 'http',
	proxyAuth : 'digest',
	proxyHost : '10.0.0.0',
	proxyPort : '4080',
	proxyUsername : 'bob',
	proxyPassword : 'groomlake'
};

/**
 *	TestCase
 */

function CURLClientTest()
{
	this.client = null;
	return this;
}

CURLClientTest.prototype = new UnitTest();

/**
 *	Test cases
 */

CURLClientTest.prototype.setUp = function()
{
	// All code that should run *before* the tests must go here
	this.client = new CURLClient();
};

CURLClientTest.prototype.testCreation = function()
{
	var client = new CURLClient();
	assertNotNull(client, "Client is null");
};

CURLClientTest.prototype.testSetUserAgent = function()
{
	this.client.setUserAgent("Opera/8.0");
	assertEqual(this.client.optionForKey(CURLOPT_USERAGENT), "Opera/8.0", "Bad option");
	
	this.client.setAsync(false);
	this.client.setURL("http://www.google.com");
	this.client.exec();
	assert(widget._last_cmd.match(/-A "Opera\/8.0"/), "Bad user agent");
};

CURLClientTest.prototype.testSetCharset = function()
{
	this.client.setAsync(false);
	this.client.setCharset("macroman");
	this.client.setURL("http://www.google.com");
	this.client.exec();
	assert(widget._last_cmd.match(/\| iconv -f macroman -t utf-8$/), "Bad cookie");
};

CURLClientTest.prototype.testSetCookies = function()
{
	this.client.setCookies(FIXTURE_ADDITIONS_DICTIONARY);
	assertEqual(this.client.optionForKey(CURLOPT_COOKIE), FIXTURE_ADDITIONS_DICTIONARY, "Bad option");
	
	this.client.setAsync(false);
	this.client.setURL("http://www.google.com");
	this.client.exec();
	assert(widget._last_cmd.match(/-b "foo=bar&baz=1"/), "Bad cookie");
};

CURLClientTest.prototype.testSetCallback = function()
{
	var mycallback = function(response)
	{
		assert(true, "Callback will be called");
		assertEqual(response, "this is google", "Bad response");
		testRunner.resume();
	};
	
	this.pause();
	this.client.setCallback(mycallback);
	this.client.setURL("http://www.google.com");
	this.client.setAsync(true);
	
	assertEqual(this.client.optionForKey(CURLOPT_RETURNFUNCTION), mycallback, "Bad option");
	
	this.client.exec();
};

CURLClientTest.prototype.testSynchronousRequest = function()
{
	this.client.setURL("http://www.google.com");
	this.client.setAsync(false);
	var response = this.client.exec();
	
	assertEqual(response, "this is google", "Bad response");
};

CURLClientTest.prototype.testAsynchronousRequest = function()
{
	this.pause();
	this.client.setURL("http://www.google.com");
	this.client.setAsync(true);
	this.client.setCallback(function(response)
	{
		assert(true, "This must be called");
		assertEqual(response, "this is google", "Bad response");
		
		testRunner.resume();
	});
	var response = this.client.exec();
};

CURLClientTest.prototype.testSetDelegate = function()
{
	var delegate =
	{
		responseDidBecomeAvailable: function(response)
		{
			assert(true, "Callback will be called");
			assertEqual(response, "this is google", "Bad response");
			testRunner.resume();
		}
	};
	
	this.pause();
	this.client.setDelegate(delegate);
	this.client.setURL("http://www.google.com");
	this.client.setAsync(true);
	
	//assertEqual(this.client.optionForKey(CURLOPT_RETURNFUNCTION), delegate.responseDidBecomeAvailable.makeCallbackTarget(delegate), "Bad option");
	
	this.client.exec();
};

CURLClientTest.prototype.testSetCookieFile = function()
{
	this.client.setCookieFile("cookie.txt");
	assertEqual(this.client.optionForKey(CURLOPT_COOKIEFILE), "cookie.txt", "Cookie file not set");
	
	this.client.setAsync(false);
	this.client.setURL("http://www.google.com");
	this.client.exec();
	assert(widget._last_cmd.match(/-b "cookie.txt"/), "No cookie file");
};

CURLClientTest.prototype.testSetCookieJar = function()
{
	this.client.setCookieJar("cookiejar.txt");
	assertEqual(this.client.optionForKey(CURLOPT_COOKIEJAR), "cookiejar.txt", "Cookie jar not set");
	
	this.client.setAsync(false);
	this.client.setURL("http://www.google.com");
	this.client.exec();
	assert(widget._last_cmd.match(/-c "cookiejar.txt"/), "No cookie jar");
};

CURLClientTest.prototype.testSetFlags = function()
{
	this.client.setFlags("-L -s");
	assertEqual(this.client._flags, "-L -s", "Flags were not set");
	
	this.client.setAsync(false);
	this.client.setURL("http://www.google.com");
	this.client.exec();
	assert(widget._last_cmd.match(/-L -s/), "There were no flags");
};

CURLClientTest.prototype.testSanitize = function()
{
	this.client.setUsernameAndPassword('alice', 'wonderland');
	this.client.applyProxySettings(Proxy);
	var sanitized = this.client.sanitize(' -u alice:wonderland --proxy-user bob:groomlake');
	assertEqual(sanitized, ' -u alice:********** --proxy-user bob:*********', "String was not sanitized correctly");
};

/**
 *	Autostart machinery
 */

window.addEventListener("load", function(e)
	{
		new CURLClientTest().run();
	},
	true);