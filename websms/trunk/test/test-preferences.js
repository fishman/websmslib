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
 *	test-preferences.js
 */

/**
 *	Mock Objects
 */

var widget = {
	identifier: "123456",
	preferenceForKey: function(key)
	{
		//__DEBUG("preferenceForKey: " + key);
		return this.storedPrefs[key] || null;
	},
	setPreferenceForKey: function(val, key)
	{
		//__DEBUG("widget.setPreferenceForKey('" + val+ "','" + key + "')");
		this.storedPrefs[key] = val;
	},
	storedPrefs: {
		"123456:provider": "tim",
		"123456:skin": "red",
		"tim:password": "pasquale".rot13(),
		"tim:username": "annalisa",
		"from": "maria",
	}
};

var ABPlugin = {
	passwordForServiceAccountName: function(provider, username)
	{
		switch (provider)
		{
			case 'tim':
				return 'pasquale';
		}
		return null;
	},
	passwordForServiceAccountName: function(value, provider, username)
	{
		// Empty
		;
	}
};

/**
 *	Unit Test Case for preferences
 *
 */

function PreferencesTest()
{
	return this;
}

PreferencesTest.prototype = new UnitTest();

/**
 *	Test cases
 */

PreferencesTest.prototype.setUp = function()
{
	// All code that should run *before* the tests must go here
	this.prefs = new Preferences();
};

PreferencesTest.prototype.testLoad = function()
{
	this.prefs.load();
	
	assertEqual(this.prefs.preferenceForKey("provider"), "tim", "Bad preference");
	assertEqual(this.prefs.preferenceForKey("username"), "annalisa", "Bad preference");
	assertEqual(this.prefs.preferenceForKey("password"), "pasquale", "Bad preference");
	assertEqual(this.prefs.preferenceForKey("skin"), "red", "Bad preference");
	assertEqual(this.prefs.preferenceForKey("from"), "maria", "Bad preference");
};

PreferencesTest.prototype.testSave = function()
{
	this.prefs.setPreferenceForKey("vodafone", "provider");
	this.prefs.setPreferenceForKey("adelmo", "username");
	this.prefs.setPreferenceForKey("sugar", "password");
	this.prefs.setPreferenceForKey("white", "skin");
	this.prefs.setPreferenceForKey("zucchero", "from");
	
	this.prefs.save();
	
	assertEqual(widget.storedPrefs["123456:provider"], "vodafone", "Bad preference");
	assertEqual(widget.storedPrefs["vodafone:username"], "adelmo", "Bad preference");
	assertEqual(widget.storedPrefs["vodafone:password"], "sugar".rot13(), "Bad preference");
	assertEqual(widget.storedPrefs["123456:skin"], "white", "Bad preference");
	assertEqual(widget.storedPrefs["from"], "zucchero", "Bad preference");
};

PreferencesTest.prototype.testDeferSave = function()
{
	testRunner.pause();
	this.prefs.setPreferenceForKey("anastasia", "from");
	
	setTimeout(function()
	{
		assertEqual(widget.storedPrefs["from"], "anastasia", "Bad preference");
		testRunner.resume();
	},
	5500);
};

PreferencesTest.prototype.testClear = function()
{
	this.prefs.setPreferenceForKey("vodafone", "provider");
	this.prefs.setPreferenceForKey("adelmo", "username");
	this.prefs.setPreferenceForKey("sugar", "password");
	this.prefs.setPreferenceForKey("white", "skin");
	this.prefs.setPreferenceForKey("zucchero", "from");
	
	this.prefs.save();
	
	this.prefs.clear();
	
	assertNull(widget.storedPrefs["123456:skin"], "Bad preference");
	assertNull(widget.storedPrefs["123456:provider"], "Bad preference");
	assertNotNull(widget.storedPrefs["vodafone:username"], "Bad preference");
	assertNotNull(widget.storedPrefs["vodafone:password"], "Bad preference");
	assertNotNull(widget.storedPrefs["from"], "Bad preference");
};

PreferencesTest.prototype.testClearAll = function()
{
	this.prefs.setPreferenceForKey("vodafone", "provider");
	this.prefs.setPreferenceForKey("adelmo", "username");
	this.prefs.setPreferenceForKey("sugar", "password");
	this.prefs.setPreferenceForKey("white", "skin");
	this.prefs.setPreferenceForKey("zucchero", "from");
	
	this.prefs.save();
	
	this.prefs.clearAll();
	
	assertNull(widget.storedPrefs["123456:skin"], "Bad preference");
	assertNull(widget.storedPrefs["123456:provider"], "Bad preference");
	assertNull(widget.storedPrefs["vodafone:username"], "Bad preference");
	assertNull(widget.storedPrefs["vodafone:password"], "Bad preference");
	assertNull(widget.storedPrefs["from"], "Bad preference");
};

PreferencesTest.prototype.testDefaults = function()
{
	// We can use whatever keys we like, defaults have no restrictions
	this.prefs.registerDefaults({
		provider: "tim",
		skin: "blue",
		foo: "bar",
		});
	assertEqual(this.prefs.defaults()["provider"], "tim", "Bad default");
	assertEqual(this.prefs.defaults()["skin"], "blue", "Bad default");
	assertEqual(this.prefs.defaults()["foo"], "bar", "Bad default");
};

PreferencesTest.prototype.tearDown = function()
{
	// All code that should run *after* the tests must go here
	this.prefs = null;
};


/**
 *	Autostart machinery
 */

window.addEventListener("load", function(e)
	{
		new PreferencesTest().run();
	},
	true);