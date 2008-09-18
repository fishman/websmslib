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
 *	test-message.js
 */

/**
 *	Mock Objects
 */

var ABPlugin = 
{
	loadContacts: function()
	{
		this._contacts = [
			"Maria",
			"Francesco"
		];
		this._numbers = [
			"+39333123456",
			"+39333654321"
		];
	},
	numberForIndex: function(idx)
	{
		return this._numbers[idx];
	},
	contactForIndex: function(idx)
	{
		return this._contacts[idx];
	},
	count: function()
	{
		return this._contacts.length;
	},
	_contacts: [],
	_numbers: []
};

function AddressBookTest()
{
	return this;
}

AddressBookTest.prototype = new UnitTest();

/**
 *	Test cases
 */

AddressBookTest.prototype.setUp = function()
{
	// All code that should run *before* the tests must go here
};

AddressBookTest.prototype.testLoad = function()
{
	assertEqual(AddressBook.count(), 0, "Bad contacts count");
	AddressBook.load();
	assertEqual(AddressBook.count(), 2, "Bad contacts count");
	assertEqual(document.getElementById("contactsList").options.length, 2, "Bad contacts list options count");
};

AddressBookTest.prototype.testClear = function()
{
	AddressBook.load();
	AddressBook.clear();
	assertEqual(AddressBook.count(), 0, "Bad contacts count");
	assertEqual(document.getElementById("contactsList").options.length, 0, "Bad contacts list options count");
};

AddressBookTest.prototype.testBestMatchForPrefix = function()
{
	AddressBook.load();
	assertEqual(AddressBook.bestMatchForPrefix("+393331"), "+39333123456", "Bad match for prefix");
	assertEqual(AddressBook.bestMatchForPrefix("+39349"), "+39349", "Bad match for prefix");
};

AddressBookTest.prototype.tearDown = function()
{
	// All code that should run *after* the tests must go here
	AddressBook.clear();
};


/**
 *	Autostart machinery
 */

window.addEventListener("load", function(e)
	{
		new AddressBookTest().run();
	},
	true);