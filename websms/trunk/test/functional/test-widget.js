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
 *	test-widget.js
 */

/**
 *	Mock Objects
 */

var phone = 
{
	_widget: null,
	flip: function()
	{
		this._widget.flip();
	},
	savePreferences: function()
	{
		
	},
	updateAvailableChars: function()
	{
		
	}
};

var Proxy = {
	saveSettings: function()
	{
		
	}
};

var widget = 
{
	prepareForTransition: function()
	{},
	performTransition: function()
	{},
	setSkin: function(skin)
	{
		this._widget.loadSkin(skin);
	},
	system: function(cmd, handler)
	{
		this.outputString = "ciao";
		if (handler)
		{
			handler(this);
			return null;
		}
		return this;
	},
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

/*
var Plugins = {
	"tim" : {
		
	}
}
*/

var SUUpdater = {

};

/**
 *	TestCase
 */

function WidgetTest()
{
	return this;
}

WidgetTest.prototype = new UnitTest();

/**
 *	Test cases
 */

WidgetTest.prototype.setUp = function()
{
	// All code that should run *before* the tests must go here
};

WidgetTest.prototype.testFail = function()
{
	assert(false, "This test will fail")
};

/**
 *	Autostart machinery
 */

window.addEventListener("load", function(e)
	{
		phone._widget = new Widget();
		phone._widget.init(phone);
		
		new WidgetTest().run();
	},
	true);