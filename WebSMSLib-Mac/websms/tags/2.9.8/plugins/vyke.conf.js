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
 *	vyke.conf.js
 *
 *	© Michele Pedrolli 2008
 *	mailto: mix <<at>> shouldshave dot org
 *
 *	WebSMS plugin for Vyke (www.vyke.com)
 *
 *	If you want to use your mobile phone number as from address,
 *	put it in the 'Sign' field with the international prefix (e.g. 393471234567).
 *	Note that your mobile phone number must be registered in Vyke.
 *
 *	Changelog
 *	---------
 *	2008-03-06	First release.
 *
 */

Plugins["vyke"] = {
	name: "Vyke",
	version: "0.1",
	max_message_length: 480,
	success_marker: /sent/i,
	charset: "iso-8859-1",
	steps: [
		{
			action: "https://www.vyke.com/merchantsite/login.c?Distributor=MASKINA",
			data: "act=menulogin&username=%USERNAME%&password=%PASSWORD%",
			flags: "-L -s"
		},
		{
			action: "https://www.vyke.com/merchantsite/sms.c",
			data: "act=sendSMS&from=%FROM%&to=%TO_CCODE%%TO%&message=%TEXT%",
			check: [
				{
					match: /Sorry, you do not have enough credit/i,
					reason: "No enough credit."
				},
				{
					match: /phonenumber is incorrect/i,
					reason: "Invalid phone number."
				},
				{
					match: /phonenumber is invalid/i,
					reason: "Invalid phone number."
				}
			],
			flags: "-L -s"
		}
	]
};