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

var AddressBook = {
	_numbers: [],
	load: function()
	{
		// Loads addresses from the plugin
		if (ABPlugin) {
			ABPlugin.loadContacts();
			//__DEBUG("Found " + ABPlugin.count() + " contacts");
			var count = ABPlugin.count();
			var list = document.getElementById("contactsList");
			this._numbers = [];
			for (var i = 0; i < count; i++)
			{
				var number = ABPlugin.numberForIndex(i);
				this._numbers.push(number);
				list.options[i] = new Option(ABPlugin.contactForIndex(i), number);
			}
			this._numbers.sort();
		}
		else {
			alert("Widget plugin not loaded.");
		}
	},
	clear: function()
	{
		var list = document.getElementById("contactsList");
		list.options.length = 0;
		this._numbers = [];
	},
	count: function()
	{
		return this._numbers.length;
	},
	bestMatchForPrefix: function(prefix)
	{
		// Returns the best matching number for a given prefix, or the prefix itself
		// if no known number matches the prefix.
		if (this._numbers.length > 0)
		{
			for (var i = 0; i < this._numbers.length; i++)
			{
				if (this._numbers[i].startsWith(prefix))
				{
					return this._numbers[i];
				}
			}
		}
		return prefix;
	},
	randomNumber: function()
	{
		// When you want to call someone at random
		if (this._numbers.length > 0)
		{
			var randomPick = Math.floor(this._numbers.length * Math.random());
			return this._numbers[randomPick];
		}
		return null;
	}
};
