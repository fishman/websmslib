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
 *	test-proxy.js
 */

/**
 *	Mock Objects
 */

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

/**
 *	TestCase
 */

function ProxyTest()
{
	this.proxyAuthList = document.getElementById("proxyAuthList");
	this.proxyTypeList = document.getElementById("proxyTypeList");
	this.proxyHostField = document.getElementById("proxyHostField");
	this.proxyPortField = document.getElementById("proxyPortField");
	this.proxyUsernameField = document.getElementById("proxyUsernameField");
	this.proxyPasswordField = document.getElementById("proxyPasswordField");
	
	return this;
}

ProxyTest.prototype = new UnitTest();

/**
 *	Test cases
 */

ProxyTest.prototype.setUp = function()
{
	// All code that should run *before* the tests must go her
};

ProxyTest.prototype.testLoadSettings = function()
{
	Proxy.loadSettings();

	assertEqual(Proxy.proxyAuth, "ntlm", "Bad proxy auth type");
	assertTag({tag: "select", id: "proxyAuthList", value: Proxy.proxyAuth}, "Auth type not set");

	assertEqual(Proxy.proxyType, "proxy", "Bad proxy type");
	assertTag({tag: "select", id: "proxyTypeList", value: Proxy.proxyType}, "Proxy type not set");

	assertEqual(Proxy.proxyPort, 1980, "Bad proxy port");
	assertTag({tag: "input", id: "proxyPortField", value: Proxy.proxyPort}, "Port not set");

	assertEqual(Proxy.proxyHost, "192.168.1.1", "Bad proxy host");
	assertTag({tag: "input", id: "proxyHostField", value: Proxy.proxyHost}, "Host not set");

	assertEqual(Proxy.proxyUsername, "alice", "Bad proxy username");
	assertTag({tag: "input", id: "proxyUsernameField", value: Proxy.proxyUsername, attributes: {type: "text"}}, "Username not set");

	assertEqual(Proxy.proxyPassword, "wonderland", "Bad proxy password");
	assertTag({tag: "input", id: "proxyPasswordField", value: Proxy.proxyPassword, attributes: {type: "password"}}, "Password not set");

};

ProxyTest.prototype.testSaveSettings = function()
{
	Proxy.proxyAuth = "ntlm";
	Proxy.proxyType = "socks";
	Proxy.proxyUsername = "daniele";
	Proxy.proxyPassword = "pandora";
	Proxy.proxyHost = "pandora.ulb.ac.be";
	Proxy.proxyPort = 8080;
	
	Proxy.saveSettings();
	
	assertEqual(widget.preferenceForKey("proxyAuth"), "ntlm", "Bad proxy auth type");
	assertEqual(widget.preferenceForKey("proxyType"), "socks", "Bad proxy type");
	assertEqual(widget.preferenceForKey("proxyPort"), 8080, "Bad proxy port");
	assertEqual(widget.preferenceForKey("proxyHost"), "pandora.ulb.ac.be", "Bad proxy host");
	assertEqual(widget.preferenceForKey("proxyUsername"), "daniele", "Bad proxy username");
	assertEqual(widget.preferenceForKey("proxyPassword"), "pandora", "Bad proxy password");
};

ProxyTest.prototype.testInUse = function()
{
	Proxy.loadSettings();
	
	assert(Proxy.inUse(), "Proxy not initialized");
};

ProxyTest.prototype.testUpdate = function()
{
	Proxy.loadSettings();
	
	this.proxyHostField.value = "127.0.0.1";
	Proxy.update(this.proxyHostField);
	assertEqual(Proxy.proxyHost, this.proxyHostField.value, "Host not updated");

	this.proxyPortField.value = "9999";
	Proxy.update(this.proxyPortField);
	assertEqual(Proxy.proxyPort, this.proxyPortField.value, "Port not updated");

	this.proxyUsernameField.value = "paluani";
	Proxy.update(this.proxyUsernameField);
	assertEqual(Proxy.proxyUsername, this.proxyUsernameField.value, "Username not updated");

	this.proxyPasswordField.value = "balocco";
	Proxy.update(this.proxyPasswordField);
	assertEqual(Proxy.proxyPassword, this.proxyPasswordField.value, "Password not updated");

	this.proxyAuthList.selectedIndex = 0;
	Proxy.update(this.proxyAuthList);
	assertEqual(Proxy.proxyAuth, this.proxyAuthList.value, "Auth type not updated");

	this.proxyTypeList.selectedIndex = 1;
	Proxy.update(this.proxyTypeList);
	assertEqual(Proxy.proxyType, this.proxyTypeList.value, "Proxy type not updated");
};

ProxyTest.prototype.testCurlOptions = function()
{
	Proxy.loadSettings();
	assertEqual(Proxy.curlOptions(), " --socks pandora.ulb.ac.be:8080 --proxy-ntlm --proxy-user daniele:pandora", "Bad proxy options");
	
	Proxy.proxyType = "none";
	assertNull(Proxy.curlOptions(), "Bad proxy options");

	Proxy.proxyType = "proxy";
	Proxy.proxyPassword = "banana";
	Proxy.proxyAuth = "digest";
	assertEqual(Proxy.curlOptions(), " --proxy pandora.ulb.ac.be:8080 --proxy-digest --proxy-user daniele:banana", "Bad proxy options");

	Proxy.proxyAuth = "basic";
	assertEqual(Proxy.curlOptions(), " --proxy pandora.ulb.ac.be:8080 --proxy-basic --proxy-user daniele:banana", "Bad proxy options");

	Proxy.proxyUsername = null;
	Proxy.proxyPassword = null;
	assertEqual(Proxy.curlOptions(), " --proxy pandora.ulb.ac.be:8080", "Bad proxy options");

	Proxy.proxyHost = "golgi.ulb.ac.be";
	Proxy.proxyPort = "5080";
	assertEqual(Proxy.curlOptions(), " --proxy golgi.ulb.ac.be:5080", "Bad proxy options");
};

/**
 *	Autostart machinery
 */

window.addEventListener("load", function(e)
	{
		new ProxyTest().run();
	},
	true);