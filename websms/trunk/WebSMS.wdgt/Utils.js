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

var Utils = {

/**
 *	Utility class to hold handy functions
 */
	nicknameFromString: function(str)
	{
		var terms = str.substr(0, str.indexOf(" (")).split(" ");
		return terms[Math.max(terms.length - 1, 0)];
	},
	trimNumber: function(number)
	{
		// Remove spaces
		number = number.replace(/[\s\(\)\-]/g, "");

		// Remove international prefixes
		if (number.indexOf("+") == 0 ||
			number.indexOf("00") == 0)
		{
			number = CountryCode.numberByStrippingCode(number);
		}
		return number;
	},
	emeLodge: function()
	{
		widget.openURL("http://www.emeraldion.it");
	},
	home: function()
	{
		widget.openURL("http://www.emeraldion.it/software/widgets/websms.html");
	},
	help: function()
	{
		widget.openURL("http://www.emeraldion.it/software/widgets/websms/instructions.html");
	},
	donate: function()
	{
		widget.openURL("http://www.emeraldion.it/software/widgets/websms/donate.html");
	}
};