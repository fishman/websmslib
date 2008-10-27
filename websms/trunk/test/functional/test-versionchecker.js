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
 *	test-versionchecker.js
 */

var myVersion;
var newestVersion;

/**
 *	Mock Objects
 */

var widget = 
{
	system: function(cmd, callback)
	{
		var result;
		switch (cmd)
		{
			case "/bin/sh -c \"/usr/bin/defaults read '`pwd`/Info'\"":
				result = FIXTURE_INFO_PLIST_DICTIONARY;
				break;
				
			case "/bin/sh -c \"/usr/bin/defaults read '`pwd`/Info' CFBundleVersion\"":
				result = FIXTURE_INFO_PLIST_CFBUNDLEVERSION;
				break;

			case "/bin/sh -c \"/usr/bin/defaults read '`pwd`/Info' CFBundleIdentifier\"":
				result = FIXTURE_INFO_PLIST_CFBUNDLEIDENTIFIER;
				break;
		}
		
		this.outputString = result;
		if (callback)
		{
			callback(this);
		}
		else
		{
			return this;
		}
	},
	_result: null
};

function XMLHttpRequest()
{
	return this;
}
XMLHttpRequest.prototype.open = function()
{
	__DEBUG("XHR call to open() with arguments " + [arguments[0],arguments[1],arguments[2]].join());
};
XMLHttpRequest.prototype.send = function()
{
	__DEBUG("XHR call to send() with argument " + arguments[0]);
	this.status = 200;
	this.readyState = 4;
	this.responseText = FIXTURE_VERSIONCHECK_SERVER_RESPONSE;
	setTimeout(function(obj) { obj.onreadystatechange(); }, 1000, this);
};


/**
 *	TestCase
 */

function VersionCheckerTest()
{
	this.versionchecker = new VersionChecker();
	
	return this;
}

VersionCheckerTest.prototype = new UnitTest();

/**
 *	Test cases
 */

VersionCheckerTest.prototype.setUp = function()
{
	// All code that should run *before* the tests must go here
};

VersionCheckerTest.prototype.testCheckUpdate = function()
{
	testRunner.pause();
	this.versionchecker.didFetchLatestVersion = function(updateAvailable, name, version)
		{
			assert(true, "This method should be called");
			assert(updateAvailable, "There should be an update available");
			assertEqual(version, FIXTURE_VERSIONCHECK_SERVER_RESPONSE, "There should be an update available");
			assertEqual(name, "websms", "Name should be \"websms\"");
			
			testRunner.resume();
		};
	this.versionchecker.checkUpdate();
};

VersionCheckerTest.prototype.testDidFetchLatestVersion = function()
{
	var callback = function(updateAvailable, name, version)
	{
		alert(updateAvailable);
	};
	this.versionchecker.didFetchLatestVersion = callback;
	
	assertEqual(this.versionchecker.didFetchLatestVersion, callback, "didFetchLatestVersion callback was lost");
};

/**
 *	Autostart machinery
 */

window.addEventListener("load", function(e)
	{
		new VersionCheckerTest().run();
	},
	true);