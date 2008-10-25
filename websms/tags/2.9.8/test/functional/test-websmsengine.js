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
 *	test-websmsengine.js
 */

/**
 *	Mock Objects
 */

var ABPlugin = {
	systemVersionString: function()
	{
		return FIXTURE_ABPLUGIN_SYSTEMVERSIONSTRING;
	}
};

var Plugins = FIXTURE_WEBSMSENGINE_PLUGINS;

var widget = 
{
	system: function(cmd, callback)
	{
		//__DEBUG(cmd);
		var result;
		switch (cmd)
		{
			case '/usr/bin/curl -L -s -d "cmd=login&u=adelmo&p=sugar" -c "/var/tmp/websms.vodafone.cookie.1.txt" -A "Mozilla/5.0 (WebSMSEngine; Emeraldion)" -e "http://www.vodafone.it" "http://www.vodafone.it/login.html"':
				result = FIXTURE_RESPONSE_VODAFONE_WELCOMEPAGE;
				break;
			case '/usr/bin/curl -L -s -d "cmd=login&u=adelmo&p=zucchero" -c "/var/tmp/websms.vodafone.cookie.1.txt" -A "Mozilla/5.0 (WebSMSEngine; Emeraldion)" -e "http://www.vodafone.it" "http://www.vodafone.it/login.html"':
				result = FIXTURE_RESPONSE_VODAFONE_LOGINERRORPAGE;
				break;
			case '/usr/bin/curl -L -s -b "/var/tmp/websms.vodafone.cookie.1.txt" -c "/var/tmp/websms.vodafone.cookie.2.txt" -A "Mozilla/5.0 (WebSMSEngine; Emeraldion)" -e "http://www.vodafone.it/home.html" "http://www.vodafone.it/compose.html"':
				result = FIXTURE_RESPONSE_VODAFONE_COMPOSEPAGE;
				break;
			case '/usr/bin/curl -L -s -b "/var/tmp/websms.vodafone.cookie.2.txt" -c "/var/tmp/websms.vodafone.cookie.2.txt" -A "Mozilla/5.0 (WebSMSEngine; Emeraldion)" -e "http://www.vodafone.it/compose.html" -o "/var/tmp/websms.vodafone.captcha.1202236814249" "http://www.vodafone.it/captcha.png"':
			case '/usr/bin/curl -L -s -b "/var/tmp/websms.tim.cookie.2.txt" -c "/var/tmp/websms.tim.cookie.2.txt" -A "Mozilla/5.0 (WebSMSEngine; Emeraldion)" -e "http://www.tim.it/scrivi.html" -o "/var/tmp/websms.tim.captcha.1202236814249" "http://www.tim.it/captcha.png"':
			case '/usr/bin/curl -L -s -b "/var/tmp/websms.tim-unavailable.cookie.2.txt" -c "/var/tmp/websms.tim-unavailable.cookie.2.txt" -A "Mozilla/5.0 (WebSMSEngine; Emeraldion)" -e "http://www.tim.it/scrivi.html" -o "/var/tmp/websms.tim-unavailable.captcha.1202236814249" "http://www.tim.it/captcha.png"':
				result = null;
				break;
			case '/usr/bin/curl -L -s -d "cmd=send&t=ciao&c=WqBCH" -b "/var/tmp/websms.vodafone.cookie.2.txt" -c "/var/tmp/websms.vodafone.cookie.3.txt" -A "Mozilla/5.0 (WebSMSEngine; Emeraldion)" -e "http://www.vodafone.it/compose.html" "http://www.vodafone.it/send.html"':
				result = FIXTURE_RESPONSE_VODAFONE_SENTPAGE;
				break;
			case '/usr/bin/curl -L -s -d "cmd=entra&u=adelmo&p=sugar" -c "/var/tmp/websms.tim-unavailable.cookie.1.txt" -A "Mozilla/5.0 (WebSMSEngine; Emeraldion)" -e "http://www.tim.it" "http://www.tim.it/entra.html"':
			case '/usr/bin/curl -L -s -d "cmd=entra&u=adelmo&p=sugar" -c "/var/tmp/websms.tim.cookie.1.txt" -A "Mozilla/5.0 (WebSMSEngine; Emeraldion)" -e "http://www.tim.it" "http://www.tim.it/entra.html"':
				result = FIXTURE_RESPONSE_TIM_WELCOMEPAGE;
				break;
			case '/usr/bin/curl -L -s -b "/var/tmp/websms.tim-unavailable.cookie.1.txt" -c "/var/tmp/websms.tim-unavailable.cookie.2.txt" -A "Mozilla/5.0 (WebSMSEngine; Emeraldion)" -e "http://www.tim.it/casa.html" "http://www.tim.it/scrivi.html"':
			case '/usr/bin/curl -L -s -b "/var/tmp/websms.tim.cookie.1.txt" -c "/var/tmp/websms.tim.cookie.2.txt" -A "Mozilla/5.0 (WebSMSEngine; Emeraldion)" -e "http://www.tim.it/casa.html" "http://www.tim.it/scrivi.html"':
				result = FIXTURE_RESPONSE_TIM_COMPOSEPAGE;
				break;
			case '/usr/bin/curl -L -s -d "cmd=invia&t=ciao&c=WqBCH" -b "/var/tmp/websms.tim.cookie.2.txt" -c "/var/tmp/websms.tim.cookie.3.txt" -A "Mozilla/5.0 (WebSMSEngine; Emeraldion)" -e "http://www.tim.it/scrivi.html" "http://www.tim.it/send.html"':
				result = FIXTURE_RESPONSE_TIM_SENTPAGE;
				break;
			case '/usr/bin/curl -L -s -d "cmd=invia&t=ciao&c=WqBCH" -b "/var/tmp/websms.tim-unavailable.cookie.2.txt" -c "/var/tmp/websms.tim-unavailable.cookie.3.txt" -A "Mozilla/5.0 (WebSMSEngine; Emeraldion)" -e "http://www.tim.it/scrivi.html" "http://www.tim.it/send-unavailable.html"':
				result = FIXTURE_RESPONSE_TIM_SERVICEUNAVAILABLEPAGE;
				break;
			case '/bin/sh -c "/usr/bin/defaults read \'`pwd`/Info\' CFBundleVersion"':
				result = FIXTURE_INFO_PLIST_CFBUNDLEVERSION;
				break;
			case '/bin/sh -c "/usr/bin/defaults read \'`pwd`/Info\'"':
				result = FIXTURE_INFO_PLIST_DICTIONARY;
				break;
			default:
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
	}
};

var Proxy = {
	inUse: function()
	{
		return false;
	}
};

var Phone = { NO_CAPTCHA: -1 };

var engineDelegate = {
	/**
	 *	WebSMSEngine delegate methods
	 */
	sendingSucceeded: function()
	{
		assert(true, "Will never fail");
		this._widget.showMessage(getLocalizedString("Messaggio inviato!") +
				(this._availableSMS > 0 ?
					getLocalizedString(" (%d disponibili)").replace("%d", this._availableSMS) : ""));
		this.saveMessage();
		this.increaseSMSCounter();
		this.reset();
		testRunner.resume();
	},
	sendingFailed: function()
	{
		assert(true, "Will never fail");
		this._widget.showError(getLocalizedString("Invio fallito!"));
		this.reset();
		assertEqual(document.getElementById('error_msg').innerHTML, getLocalizedString("Invio fallito!"), "Bad error string");
		testRunner.resume();
	},
	sendingError: function(error)
	{
		assert(true, "Will never fail");
		this.reset();
		this._widget.showError(error);
		assertEqual(document.getElementById('error_msg').innerHTML, error, "Bad error string");
		testRunner.resume();
	},
	requestCaptchaCode: function(src)
	{
		this._widget.showCaptcha(src);
	},
	availableMessages: function(num)
	{
		this._availableSMS = num;
	},
	
	_widget: {
		showCaptcha: function(src)
		{
			__DEBUG("Presenting captcha '%s'".sprintf(src));
			document.getElementById('captcha').src = '../images/captcha.png';
			document.getElementById('captcha_field').value = "WqBCH";
			testRunner.engine.setCaptchaCode(engineDelegate.captchaCode());
			testRunner.engine.send();
		},
		showError: function(msg)
		{
			document.getElementById('error_msg').innerHTML = msg;
		},
		showMessage: function(msg)
		{
			document.getElementById('error_msg').innerHTML = msg;
		}
	},
	_availableSMS: 0,
	_session_id: 1202236814249,
	reset: function()
	{
		document.getElementById('captcha_field').value = Phone.NO_CAPTCHA;
	},
	captchaCode: function()
	{
		//__DEBUG("captcha():"+this._captcha);
		return document.getElementById('captcha_field').value;
	},
	saveMessage: function()
	{
		//__DEBUG("saveMessage");
	},
	increaseSMSCounter: function()
	{
		//__DEBUG("increaseSMSCounter");
	}
};

/**
 *	TestCase
 */

function WebSMSEngineTest()
{
	return this;
}

WebSMSEngineTest.prototype = new UnitTest();

/**
 *	Test cases
 */

WebSMSEngineTest.prototype.setUp = function()
{
	// All code that should run *before* the tests must go her
	this.engine = new WebSMSEngine();
};

WebSMSEngineTest.prototype.tearDown = function()
{
	// All code that should run *after* the tests must go her
	engineDelegate.reset();
};

WebSMSEngineTest.prototype.testSetPlugin = function()
{
	this.engine.setPlugin(Plugins['vodafone']);
	
	assertEqual(this.engine._provider, "vodafone", "Bad provider");
	assertEqual(this.engine._plugin, Plugins['vodafone'], "Bad plugin");
};

WebSMSEngineTest.prototype.testSetDelegate = function()
{
	this.engine.setDelegate(engineDelegate);
	
	assertEqual(this.engine._delegate, engineDelegate, "Bad delegate");
};

WebSMSEngineTest.prototype.testSetReplacements = function()
{
	this.engine.setReplacements(FIXTURE_WEBSMSENGINE_REPLACEMENTS);
	
	assertEqual(this.engine._replacements, FIXTURE_WEBSMSENGINE_REPLACEMENTS, "Bad replacements");
};

WebSMSEngineTest.prototype.testShowCaptcha = function()
{
	this.engine.setDelegate(engineDelegate);
	this.engine.showCaptcha();
	assert(true, "This will never fail");
};

WebSMSEngineTest.prototype.testSend = function()
{
	this.pause();
	
	this.engine.setDelegate(engineDelegate);
	this.engine.setPlugin(Plugins['vodafone']);
	this.engine.setReplacements(FIXTURE_WEBSMSENGINE_REPLACEMENTS);
	this.engine.send();
};

WebSMSEngineTest.prototype.testSubsequentSend = function()
{
	this.pause();
	
	this.engine.setDelegate(engineDelegate);
	this.engine.setPlugin(Plugins['tim']);
	this.engine.setReplacements(FIXTURE_WEBSMSENGINE_REPLACEMENTS);
	this.engine.send();
};

WebSMSEngineTest.prototype.testLoginError = function()
{
	this.pause();
	
	this.engine.setDelegate(engineDelegate);
	this.engine.setPlugin(Plugins['vodafone']);
	this.engine.setReplacements(FIXTURE_WEBSMSENGINE_BOGUS_REPLACEMENTS);
	this.engine.send();
};

WebSMSEngineTest.prototype.testServiceUnavailable = function()
{
	this.pause();
	
	this.engine.setDelegate(engineDelegate);
	this.engine.setPlugin(Plugins['tim-unavailable']);
	this.engine.setReplacements(FIXTURE_WEBSMSENGINE_REPLACEMENTS);
	this.engine.send();
};

/**
 *	Autostart machinery
 */

window.addEventListener("load", function(e)
	{
		new WebSMSEngineTest().run();
	},
	true);