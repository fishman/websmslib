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
 *	smsdiscount-no-account.conf.js
 *
 *	Configuration file for SMSdiscount service without an account (www.smsdiscount.com)
 *	© Ceriel Jacobs <c [at] vakantieland [dot] nl>
 *
 *	Changelog
 *	---------
 *  2007-11-06	Added check for unsupported destinations. Guess what? Italy!
 *  2007-08-24	Replaced mistyped %TEST% for %TEXT%. Testing anyone?
 *  2007-07-30	Initial version, Todo: correct charset encoding (for non ASCII chars)
 *
 */

Plugins["smsdiscount-no-account"] = {
	name: "SMSdiscount (No account)",
	version: "0.0.4",
	max_message_length: 160,
	success_marker: /SMS succesfully sent!/,
	steps: [
		{
			referrer: "http://www.smsdiscount.com/demosms/senddemosms.php",
			action: "http://www.smsdiscount.com/demosms/senddemosms.php",
			data: "message=%TEXT%%20%FROM%&recipient=%2B%TO_CCODE%%TO%&remLen=160&x=102&y=16",
			flags: "-L -s",
			check: [
				{
					match: /You have reached the maximum/i,
					reason: "You have reached the maximum of free SMS."
				},
				{
					match: /This destination is currently not supported/i,
					reason: "Destination not supported."
				}
			]
		}
	]
};
