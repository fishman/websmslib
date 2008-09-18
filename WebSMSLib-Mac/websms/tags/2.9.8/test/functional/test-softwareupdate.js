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
 *	test-softwareupdate.js
 */
 
function getLocalizedString(str)
{
	return str;
}

/**
 *	Mock Objects
 */
 
var Plugins = {
	'vodafone': {
		name: 'Vodafone',
		version: '0.9',
		parameters: [
			{
				name: 'greeting',
				type: 'text',
				defaultValue: 'hello'
			},
			{
				name: 'mood',
				type: 'list',
				values: ['so-so','happy','sad'],
				defaultValue: 'happy'
			}
		], 
		steps: [
			{
				action: 'http://www.vodafone.it',
				referrer: 'http://www.vodafone.it',
				data: 'cmd=login',
				flags: '-L -s'
			}
		]
	},
	'tim': {
		name: 'TIM',
		version: '1.1.2',
		steps: [
			{
				action: 'http://www.tim.it',
				referrer: 'http://www.tim.it',
				data: 'cmd=login',
				flags: '-L -s'
			}
		]
	},
	'tele2': {
		name: 'Tele2',
		version: '1.0',
		steps: [
			{
				action: 'http://www.tele2.it',
				referrer: 'http://www.tele2.it',
				data: 'cmd=login',
				flags: '-L -s'
			}
		]
	}
};

var widget = 
{
	preferenceForKey: function(key)
	{
		//__DEBUG(key);
		switch (key)
		{
			case "Check at startup":
				return false;
		}
	},
	system: function(cmd, callback)
	{
		//__DEBUG(cmd);
		var result;
		var status = 0;
		switch (cmd)
		{
			case "/usr/bin/curl -s http://tetra.emeraldion.it/websms/plugins/vodafone.conf.js | /usr/bin/grep version:":
				result = "1.0";
				break;
			case "/usr/bin/curl -s http://tetra.emeraldion.it/websms/plugins/tim.conf.js | /usr/bin/grep version:":
				result = "1.1.2";
				break;
			case "/usr/bin/curl -s http://tetra.emeraldion.it/websms/plugins/tele2.conf.js | /usr/bin/grep version:":
				status = 1;
				break;
			case "bin/suupdater.sh vodafone":
				break;
			case "/bin/cat plugins/vodafone.conf.js":
				result = "Plugins['vodafone'] = { \
					name: 'Vodafone', \
					version: '1.0', \
					parameters: [ \
						{ \
							name: 'greeting', \
							type: 'text', \
							defaultValue: 'hello' \
						}, \
						{ \
							name: 'mood', \
							type: 'list', \
							values: ['so-so','happy','sad'], \
							defaultValue: 'happy' \
						} \
					],  \
					steps: [ \
						{ \
							action: 'http://www.vodafone.it', \
							referrer: 'http://www.vodafone.it', \
							data: 'cmd=login', \
							flags: '-L -s' \
						} \
					] \
				};";
			default:
		}

		this.outputString = result;
		this.status = status;
		if (callback)
		{
			setTimeout(callback, 100, this);
		}
		return this;
	},
	_result: null
};

var checkButton = {
	setEnabled: function(enabled)
	{
		document.getElementById("check_btn").disabled = !enabled;
	}
};

var updateButton = {
	setEnabled: function(enabled)
	{
		//__DEBUG(enabled);
		document.getElementById("update_btn").disabled = !enabled;
		this.enabled = enabled;
	}
};

/**
 *	TestCase
 */

function SoftwareUpdateTest()
{
	SUUpdater.checkButton = checkButton;
	SUUpdater.updateButton = updateButton;
	
	return this;
}

SoftwareUpdateTest.prototype = new UnitTest();

/**
 *	Test cases
 */

SoftwareUpdateTest.prototype.setUp = function()
{
	// All code that should run *before* the tests must go her
	SUUpdater.init();
};

SoftwareUpdateTest.prototype.testInit = function()
{
	SUUpdater.init();
	
	assertEqual(document.getElementById('su_tim_label').innerHTML, 'TIM', "Bad initialization");
	assertEqual(document.getElementById('su_tim_version').innerHTML, '1.1.2', "Bad initialization");
	
	assertEqual(document.getElementById('su_vodafone_label').innerHTML, 'Vodafone', "Bad initialization");
	assertEqual(document.getElementById('su_vodafone_version').innerHTML, '0.9', "Bad initialization");
};

SoftwareUpdateTest.prototype.testCheckUpdates = function()
{
	testRunner.pause();
	SUUpdater.checkUpdates();
	setTimeout(function()
	{
		assertEqual(Plugins['tim'].latestVersion, '1.1.2', "Bad update check");
		assertEqual(document.getElementById('su_tim_latestversion').innerHTML, '1.1.2', "Bad update check");
		
		assertEqual(Plugins['vodafone'].latestVersion, '1.0', "Bad update check");
		assertEqual(document.getElementById('su_vodafone_latestversion').innerHTML, '1.0', "Bad update check");
		
		testRunner.resume();
	},
	2000);
};

SoftwareUpdateTest.prototype.testPerformUpdate = function()
{
	testRunner.pause();
	SUUpdater.checkUpdates();
	setTimeout(function()
	{
		SUUpdater.performUpdate();
		
		setTimeout(function()
		{
			assertEqual(Plugins['tim'].version, '1.1.2', "Bad update");
			assertEqual(Plugins['vodafone'].version, '1.0', "Bad update");
			
			testRunner.resume();
		},
		2000);
	},
	2000);
};

/**
 *	Autostart machinery
 */

window.addEventListener("load", function(e)
	{
		new SoftwareUpdateTest().run();
	},
	true);