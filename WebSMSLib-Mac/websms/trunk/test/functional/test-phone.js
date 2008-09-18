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
 *	test-phone.js
 */

/**
 *	Mock Objects
 */

var NO_CAPTCHA = -1;
var IMG_NULL = "";

var widget = 
{
	preferenceForKey: function(key)
	{
		return this._dictionary[key];
	},
	setPreferenceForKey: function(val, key)
	{
		this._dictionary[key] = val;
	},
	_dictionary: {
		proxyHost: "192.168.1.1",
		proxyPort: 1980,
		proxyType: "proxy",
		proxyUsername: "alice",
		proxyPassword: "wonderland",
		proxyAuth: "ntlm"
	}
};

function Preferences()
{
	this.registerDefaults = function()
	{
	};
	this.load = function()
	{
	};
	this.preferenceForKey = function(key)
	{
		if (key == 'provider')
			return 'tim';
	};
}

function Widget()
{
	this._textField = document.getElementById('widget_textField');
	this._captchaTxt = document.getElementById('widget_captchaTxt');
	this._captchaImg = document.getElementById('widget_captchaImg');
	this.error = null;
	this.init = function()
	{
		__DEBUG('[Widget stub] init()');
	};
	this.setProvider = function(prov)
	{
	};
	this.setFrom = function(from)
	{
	};
	this.from = function()
	{
		return "";
	};
	this.setUsername = function(username)
	{
	};
	this.setPassword = function(pass)
	{
	};
	this.loadSkin = function(skin)
	{
	};
	this.setAvailableChars = function(count)
	{
	};
	this.startSending = function()
	{
	};
	this.endSending = function()
	{
	};
	this.showError = function(err)
	{
		this.error = err;
	};
	this.setCaptcha = function(capt)
	{
	};
	this.hideCaptcha = function()
	{
	};
}

function Message()
{
	this.properties = {};
	this.setPropertyForKey = function(val, key)
	{
		this.properties[key] = val;
	};
	this.propertyForKey = function(key)
	{
		return this.properties[key];
	};
	this.setMaxLength = function(len)
	{
	};
	this.maxLength = function()
	{
	};
	this.isWellFormed = function()
	{
		return true;
	};
}

function WebSMSEngine()
{
	this.replacements = {};
	this.setDelegate = function(delegate)
	{
	};
	this.setPlugin = function(plugin)
	{
	};
	this.setReplacements = function(replacements)
	{
		this.replacements = replacements;
	};
	this.send = function()
	{
		__DEBUG('[WebSMSEngine stub] send()');
	};
}

var SkinChooser = {
	updateWithSkin: function(skin)
	{
	}
}

var Plugins = {
	tim: {
		max_message_length: 999
	}
};

var PluginManager = {
	populatePluginParametersPane: function(provider)
	{
	}
};

function VersionChecker()
{
	this.checkUpdate = function()
	{
	};
}

/**
 *	TestCase
 */

function PhoneTest()
{
	return this;
}

PhoneTest.prototype = new UnitTest();

/**
 *	Test cases
 */

var phone;

PhoneTest.prototype.setUp = function()
{
	// All code that should run *before* the tests must go her
	phone = new Phone();
	phone.init();
};

PhoneTest.prototype.tearDown = function()
{
	// All code that should run *after* the tests must go her
	delete phone;
	
};

PhoneTest.prototype.testEngineReplacements = function()
{
	// Set recipient
	phone._message.setPropertyForKey('+12345678901', 'to');
	// Send message causes the phone to compute replacements
	phone.sendMessage();

	var dict = phone._engine.replacements;

	// General replacements
	assertEqual(dict["%TO_CCODE%"], 1, "Bad country code");
	assertEqual(dict["%TO%"], 2345678901, "Bad number");
	assertEqual(dict["%TO_PREFIX%"], 234, "Bad prefix");
	assertEqual(dict["%TO_NUMBER%"], 5678901, "Bad number");

	// US specific replacements
	assertEqual(dict["%TO_US_AREACODE%"], 234, "Bad US area code");
	assertEqual(dict["%TO_US_PREFIX%"], 567, "Bad US prefix");
	assertEqual(dict["%TO_US_NUMBER%"], 8901, "Bad US number");
	
};

PhoneTest.prototype.testSendingError = function()
{
	phone.sendingError('Something went wrong');

	var err = phone._widget.error;

	// General replacements
	assertEqual(err, 'Something went wrong', "Bad error message");
};

PhoneTest.prototype.testSendingFailed = function()
{
	phone.sendingFailed();

	var err = phone._widget.error;

	// General replacements
	assertEqual(err, 'Invio fallito!', "Bad error message");
};

/**
 *	Autostart machinery
 */

window.addEventListener("load", function(e)
	{
		new PhoneTest().run();
	},
	true);