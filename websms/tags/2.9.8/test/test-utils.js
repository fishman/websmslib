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
 *	test-utils.js
 */

/**
 *	Mock Objects
 */

var widget = {
	lastOpenedURL: null,
	openURL: function(URL)
	{
		this.lastOpenedURL = URL;
	}
};

/**
 *	Unit Test Case for Utils
 *
 */

function UtilsTest()
{
	return this;
}

UtilsTest.prototype = new UnitTest();

/**
 *	Test cases
 */

UtilsTest.prototype.setUp = function()
{
	// All code that should run *before* the tests must go here
};

UtilsTest.prototype.testOpenURLs = function()
{
	Utils.emeLodge();
	assertEqual(widget.lastOpenedURL, "http://www.emeraldion.it", "Wrong URL");
	Utils.home();
	assertEqual(widget.lastOpenedURL, "http://www.emeraldion.it/software/widgets/websms.html", "Wrong URL");
	Utils.help();
	assertEqual(widget.lastOpenedURL, "http://www.emeraldion.it/software/widgets/websms/instructions.html", "Wrong URL");
	Utils.donate();
	assertEqual(widget.lastOpenedURL, "http://www.emeraldion.it/software/widgets/websms/donate.html", "Wrong URL");
};

UtilsTest.prototype.tearDown = function()
{
	// All code that should run *after* the tests must go here
};


/**
 *	Autostart machinery
 */

window.addEventListener("load", function(e)
	{
		new UtilsTest().run();
	},
	true);