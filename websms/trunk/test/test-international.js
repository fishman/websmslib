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
 *	test-international.js
 */

function simulateSelectionChange(list, value)
{
	for (var i = 0; i < list.options.length; i++)
	{
		if (list.options[i].value == value)
		{
			list.selectedIndex = i;
		}
	}
	var evt = document.createEvent("HTMLEvents");
	evt.initEvent("change", true, false);
	var canceled = !list.dispatchEvent(evt);
}

/**
 *	Mock Objects
 */

var widget = {
	_dict: {
	},
	preferenceForKey: function(key)
	{
		return this._dict[key];
	},
	setPreferenceForKey: function(value, key)
	{
		this._dict[key] = value;
	}
};

var claudiosNumber;
var danielesNumber;
var martianNumber;

function InternationalTest()
{
	return this;
}

InternationalTest.prototype = new UnitTest();

/**
 *	Test cases
 */

InternationalTest.prototype.setUp = function()
{
	// All code that should run *before* the tests must go here
	claudiosNumber = "+39123456789"
	danielesNumber = "+32987654321";
	// This is a probable Martian phone number
	martianNumber = "+QQQ123456";
	
	// Assume the caller to be in Switzerland
	widget.setPreferenceForKey(41, COUNTRY_CODE_KEY);
};

InternationalTest.prototype.tearDown = function()
{
	simulateSelectionChange(document.getElementById("countryCodeList"), 41);
};

InternationalTest.prototype.testCountrySelectorInit = function()
{
	CountrySelector.init();
	assertEqual(CountryCode.ownCode, 41, "Bad country code");
	assertEqual(document.getElementById("countryCodeList").options.length, CountryCodes.length, "Wrong number of elements in country code selector");
};

InternationalTest.prototype.testCountrySelectorUpdate = function()
{
	simulateSelectionChange(document.getElementById("countryCodeList"), 39);
	assertEqual(CountryCode.ownCode, 39, "Bad country code");
	
	simulateSelectionChange(document.getElementById("countryCodeList"), 44);
	assertEqual(CountryCode.ownCode, 44, "Bad country code");
	
	simulateSelectionChange(document.getElementById("countryCodeList"), 1);
	assertEqual(CountryCode.ownCode, 1, "Bad country code");
};

InternationalTest.prototype.testCountryCodeForNumber = function()
{
	assertEqual(CountryCode.forNumber(claudiosNumber), 39, "Claudio's country code should be 39");
	assertEqual(CountryCode.forNumber(danielesNumber), 32, "Daniele's country code should be 32");
	assertEqual(CountryCode.forNumber(martianNumber), 41, "We should fall back to caller's country code: 41");
};

InternationalTest.prototype.testCountryCodeNumberByStrippingCode = function()
{
	assertEqual(CountryCode.numberByStrippingCode(claudiosNumber), 123456789, "Claudio's number should be 123456789");
	assertEqual(CountryCode.numberByStrippingCode(danielesNumber), 987654321, "Daniele's number should be 987654321");
	assertEqual(CountryCode.numberByStrippingCode(martianNumber), "+QQQ123456", "The full number should be returned when a matching country code has not been found");
};

/**
 *	Autostart machinery
 */

window.addEventListener("load", function(e)
	{
		document.getElementById("countryCodeList").onchange = function(e)
		{
			CountrySelector.update(this);
		};
		new InternationalTest().run();
	},
	true);