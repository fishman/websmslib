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
 *	test-pluginmanager.js
 */

/**
 *	Mock Objects
 */

var widget = 
{
	system: function(cmd, callback)
	{
		//__DEBUG(cmd);
		var result;
		switch (cmd)
		{
			case "/usr/bin/find plugins -name *conf.js":
				result = "plugins/tim.conf.js\nplugins/vodafone.conf.js";
				break;
			case "/bin/cat plugins/vodafone.conf.js":
				result = "Plugins['vodafone'] = { \
					name: 'Vodafone', \
					parameters: [ \
					{ name: 'greeting', \
						type: 'text', \
						defaultValue: 'hello' }, \
					{ name: 'mood', \
						type: 'list', \
						values: ['so-so','happy','sad'], \
						defaultValue: 'happy' } \
					], \
					steps: [ \
					{ action: 'http://www.vodafone.it', \
						referrer: 'http://www.vodafone.it', \
						data: 'cmd=login', \
						flags: '-L -s' } \
					] \
				}";
				break;
			case "/bin/cat plugins/tim.conf.js":
				result = "Plugins['tim'] = { \
					name: 'TIM', \
					steps: [ \
					{ action: 'http://www.tim.it', \
						referrer: 'http://www.tim.it', \
						data: 'cmd=login', \
						flags: '-L -s' } \
					] \
				}";
				break;
			default:
		}

		this.outputString = result;
		if (callback)
		{
			setTimeout(callback, 100, this);
		}
		return this;
	},
	_result: null
};

/**
 *	TestCase
 */

function PluginManagerTest()
{
	return this;
}

PluginManagerTest.prototype = new UnitTest();

/**
 *	Test cases
 */

PluginManagerTest.prototype.setUp = function()
{
	// All code that should run *before* the tests must go her
};

PluginManagerTest.prototype.testLoadPlugins = function()
{
	testRunner.pause();
	PluginManager.loadPlugins(function()
	{
		assertEqual(document.getElementById("providersList").options.length, 2, "Failed loading plugins");
		
		assertEqual(document.getElementById("providersList").options[0].text, "TIM", "Failed loading plugins");
		assertEqual(document.getElementById("providersList").options[0].value, "tim", "Failed loading plugins");
		
		assertEqual(document.getElementById("providersList").options[1].text, "Vodafone", "Failed loading plugins");
		assertEqual(document.getElementById("providersList").options[1].value, "vodafone", "Failed loading plugins");
		
		assertEqual(Plugins["tim"].name, "TIM", "Failed loading plugins");
		assertEqual(Plugins["tim"].steps.length, 1, "Failed loading plugins");
		assertEqual(Plugins["tim"].steps[0].action, "http://www.tim.it", "Failed loading plugins");
		
		assertEqual(Plugins["vodafone"].name, "Vodafone", "Failed loading plugins");
		assertEqual(Plugins["vodafone"].steps.length, 1, "Failed loading plugins");
		assertEqual(Plugins["vodafone"].steps[0].referrer, "http://www.vodafone.it", "Failed loading plugins");
		
		testRunner.resume();
	});
};

PluginManagerTest.prototype.testPopulatePluginParametersPane = function()
{
	testRunner.pause();
	PluginManager.loadPlugins(function()
	{
		testRunner.resume();
	});
	
	PluginManager.populatePluginParametersPane("vodafone");
	
	assertTag({id: "greetingText", tag: "input", attrs: {type: "text", defaultValue: "hello"}}, "Bad parameter pane field");
	
	assertTag({id: "moodList", tag: "select"}, "Bad parameter pane field");
	assertTag(document.getElementById("moodList").options.length, 3, "Bad parameter pane field");
	assertTag(document.getElementById("moodList").options[0].value, "so-so", "Bad parameter pane field");
	assertTag(document.getElementById("moodList").options[0].text, "so-so", "Bad parameter pane field");
	assertTag(document.getElementById("moodList").options[1].value, "happy", "Bad parameter pane field");
	assertTag(document.getElementById("moodList").options[1].text, "happy", "Bad parameter pane field");
	assertTag(document.getElementById("moodList").options[2].value, "sad", "Bad parameter pane field");
	assertTag(document.getElementById("moodList").options[2].text, "sad", "Bad parameter pane field");
};

/**
 *	Autostart machinery
 */

window.addEventListener("load", function(e)
	{
		new PluginManagerTest().run();
	},
	true);