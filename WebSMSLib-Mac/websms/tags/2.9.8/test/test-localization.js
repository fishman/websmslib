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
 *	test-localization.js
 */

/**
 *	Mock Objects
 */

var localizedStrings = [];

localizedStrings["Digita il codice"] = "Bitte Code eingeben";
localizedStrings["Fatto"] = "Fertig";
localizedStrings["Dona!"] = "Spenden";

function LocalizationTest()
{
	return this;
}

LocalizationTest.prototype = new UnitTest();

/**
 *	Test cases
 */

LocalizationTest.prototype.setUp = function()
{
	// All code that should run *before* the tests must go here
};

LocalizationTest.prototype.testGetLocalizedString = function()
{
	assertEqual("Bitte Code eingeben", getLocalizedString("Digita il codice"), "String was not translated");
	assertEqual("Fertig", getLocalizedString("Fatto"), "String was not translated");
	assertEqual("Spenden", getLocalizedString("Dona!"), "String was not translated");
	// Test a string that doesn't exist in localization table
	assertEqual("Ciccio", getLocalizedString("Ciccio"), "String should haven't been translated");
};

/**
 *	Autostart machinery
 */

window.addEventListener("load", function(e)
	{
		new LocalizationTest().run();
	},
	true);