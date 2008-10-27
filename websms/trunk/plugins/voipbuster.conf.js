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
 *	voipbuster.conf.js
 *
 *	Configuration file for the Voipbuster SMS service (www.voipbuster.com)	
 *	© Ceriel Jacobs <c [at] vakantieland [dot] nl>
 *
 *	Changelog
 *	---------
 *	2008-02-08	Added check for wrong username or password
 *  2007-07-30	Initial version
 *
 */

Plugins["voipbuster"] = {
	name: "VoipBuster",
	version: "0.0.4",
	max_message_length: 172,
	success_marker: /success/,
	steps: [
		{
			referrer: "",
			action: "https://myaccount.voipbuster.com/clx/sendsms.php?username=%USERNAME%&password=%PASSWORD%&from=%FROM%&to=%2B%TO_CCODE%%TO%&text=%TEXT%",
			data: "",
			flags: "-k -L -s",
			check: [
				{
					match: /Wrong Username\/password combination/,
					reason: "Wrong username or password"
				}
			]
		}
	]
};
