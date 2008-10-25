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
 *	orange-ch.conf.js
 *
 *	Configuration file for Orange.ch (www.orange.ch)
 *	Based on the work by Christoph Studer <christoph [at] studer [dot] tv>
 *
 *	Changelog
 *	---------
 *	2007-08-26	First revision, based on Orange.ch SMS by Christoph Studer
 *
 */

Plugins["orange-ch"] = {
	name: "Orange CH",
	version: "0.0.1",
	max_message_length: 142,
	success_marker: /successOutput/,
	charset: "iso-8859-1",
	steps: [
		{
			referrer: "http://www.orange.ch/footer/login",
			action: "https://www.orange.ch/footer/login/loginForm",
			data: "wui_target_id=loginButton&wui_event_id=onclick&username=%USERNAME%&password=%PASSWORD%&loginButton=Login",
			flags: "-L -s",
			check: [
				{
					match: /errorList/,
					reason: "Wrong username or password"
				}
			]
		},
		{
			referrer: "https://www.orange.ch/footer/login/loginForm",
			action: "https://www.orange.ch/myorange/sms/smsForm",
			data: "wui_target_id=sendButton&wui_event_id=onclick&destinationNumberInput=%TO%&messageInput=%TEXT%%20%FROM%&charNumberLeftOutput=0&signatureInput=",
			flags: "-L -s"
		}
	]
};