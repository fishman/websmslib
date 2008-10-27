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
 *	fixtures.js
 *
 *	Test fixtures
 */

var FIXTURE_INFO_PLIST_DICTIONARY = '{\n    AllowFullAccess = 1; \n    CFBundleDisplayName = WebSMS; \n    CFBundleIdentifier = "it.emeraldion.widget.websms"; \n    CFBundleName = WebSMS; \n    CFBundleShortVersionString = "2.7.1"; \n    CFBundleVersion = "2.7.1"; \n    CloseBoxInsetX = 10; \n    CloseBoxInsetY = 13; \n    Height = 273; \n    MainHTML = "WebSMS.html"; \n    Plugin = "ABPlugin.widgetplugin"; \n    Width = 218; \n}';
var FIXTURE_INFO_PLIST_CFBUNDLEVERSION = "2.7.1";
var FIXTURE_INFO_PLIST_CFBUNDLEIDENTIFIER = "it.emeraldion.test.websms";

var FIXTURE_VERSIONCHECK_SERVER_RESPONSE = "2.7.2";

var FIXTURE_ADDITIONS_DICTIONARY = {foo: "bar", baz: 1};
var FIXTURE_ADDITIONS_ARRAY = ["foo", "bar", "baz"];

var FIXTURE_WEBSMSENGINE_REPLACEMENTS = {
	'%USERNAME%': 'adelmo',
	'%PASSWORD%': 'sugar',
	'%TEXT%': 'ciao'
};
var FIXTURE_WEBSMSENGINE_BOGUS_REPLACEMENTS = {
	'%USERNAME%': 'adelmo',
	'%PASSWORD%': 'zucchero',
	'%TEXT%': 'ciao'
};

var FIXTURE_RESPONSE_VODAFONE_LOGINERRORPAGE = "<html> \
	<head> \
		<title>Vodafone</title> \
	</head> \
	<body> \
		<p>Error: you entered a wrong username or password.</p> \
	</body> \
</html>";
var FIXTURE_RESPONSE_VODAFONE_WELCOMEPAGE = "<html> \
	<head> \
		<title>Vodafone</title> \
	</head> \
	<body> \
		<p>Welcome!</p> \
	</body> \
</html>";
var FIXTURE_RESPONSE_VODAFONE_COMPOSEPAGE = "<html> \
	<head> \
		<title>Vodafone</title> \
	</head> \
	<body> \
		<p>Compose</p> \
		<p>You have 4 messages available today</p> \
	</body> \
</html>";
var FIXTURE_RESPONSE_VODAFONE_SENTPAGE = "<html> \
	<head> \
		<title>Vodafone</title> \
	</head> \
	<body> \
		<p>Message sent!</p> \
	</body> \
</html>";

var FIXTURE_RESPONSE_TIM_WELCOMEPAGE = "<html> \
	<head> \
		<title>TIM</title> \
	</head> \
	<body> \
		<p>Benvenuti!</p> \
	</body> \
</html>";
var FIXTURE_RESPONSE_TIM_COMPOSEPAGE = "<html> \
	<head> \
		<title>TIM</title> \
	</head> \
	<body> \
		<p>Scrivi</p> \
		<p>Hai 2 messaggi disponibili oggi</p> \
	</body> \
</html>";
var FIXTURE_RESPONSE_TIM_SENTPAGE = "<html> \
	<head> \
		<title>TIM</title> \
	</head> \
	<body> \
		<p>Il messaggio è stato inviato</p> \
	</body> \
</html>";
var FIXTURE_RESPONSE_TIM_SERVICEUNAVAILABLEPAGE = "<html> \
	<head> \
		<title>TIM</title> \
	</head> \
	<body> \
		<p>Servizio non disponibile</p> \
	</body> \
</html>";

var FIXTURE_WEBSMSENGINE_PLUGINS = {
	'vodafone': {
		name: 'Vodafone',
		steps: [
			{
				action: 'http://www.vodafone.it/login.html',
				referrer: 'http://www.vodafone.it',
				data: 'cmd=login&u=%USERNAME%&p=%PASSWORD%',
				flags: '-L -s',
				check:
				[
					{
						match: /wrong username or password/i,
						reason: "Wrong username or password!"
					}
				]
			},
			{
				action: 'http://www.vodafone.it/compose.html',
				referrer: 'http://www.vodafone.it/home.html',
				captcha: 'http://www.vodafone.it/captcha.png',
				flags: '-L -s',
				availabilityCheck: function(text)
				{
					return text.match(/(\d+) messages available today/)[1] - 1;
				}
			},
			{
				action: 'http://www.vodafone.it/send.html',
				referrer: 'http://www.vodafone.it/compose.html',
				data: 'cmd=send&t=%TEXT%&c=%CAPTCHA%',
				flags: '-L -s'
			}
		],
		success_marker: /Message sent/
	},
	'tim': {
		name: 'TIM',
		steps: [
			{
				action: 'http://www.tim.it/entra.html',
				referrer: 'http://www.tim.it',
				data: 'cmd=entra&u=%USERNAME%&p=%PASSWORD%',
				flags: '-L -s'
			},
			{
				action: 'http://www.tim.it/scrivi.html',
				referrer: 'http://www.tim.it/casa.html',
				captcha: 'http://www.tim.it/captcha.png',
				flags: '-L -s',
				availabilityCheck: function(text)
				{
					return text.match(/(\d+) messaggi disponibili oggi/)[1] - 1;
				}
			},
			{
				action: 'http://www.tim.it/send.html',
				referrer: 'http://www.tim.it/scrivi.html',
				data: 'cmd=invia&t=%TEXT%&c=%CAPTCHA%',
				flags: '-L -s'
			}
		],
		success_marker: /stato inviato/
	},
	'tim-unavailable': {
		name: 'TIM',
		steps: [
			{
				action: 'http://www.tim.it/entra.html',
				referrer: 'http://www.tim.it',
				data: 'cmd=entra&u=%USERNAME%&p=%PASSWORD%',
				flags: '-L -s'
			},
			{
				action: 'http://www.tim.it/scrivi.html',
				referrer: 'http://www.tim.it/casa.html',
				captcha: 'http://www.tim.it/captcha.png',
				flags: '-L -s',
				availabilityCheck: function(text)
				{
					return text.match(/(\d+) messaggi disponibili oggi/)[1] - 1;
				}
			},
			{
				action: 'http://www.tim.it/send-unavailable.html',
				referrer: 'http://www.tim.it/scrivi.html',
				data: 'cmd=invia&t=%TEXT%&c=%CAPTCHA%',
				flags: '-L -s'
			}
		],
		success_marker: /stato inviato/
	}
};

var FIXTURE_ABPLUGIN_SYSTEMVERSIONSTRING = "10.5.2";