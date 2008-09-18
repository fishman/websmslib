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
 * ethz.conf.js
 *
 * © Michele Mazzucchi 2008-Today
 *
 * WebSMS plugin for ETH Zürich's SMS gateway -- www.sms.ethz.ch
 * Send SMS everywhere in the world from your phone number.
 *
 * You need to be registered at ETH. Your mobile number has to be certified to
 * ETH (see https://www.adressen.ethz.ch/eAdressen/ ).
 *
 * Changelog
 * ---------
 *	2008-02-23	First release.
 *
 */

Plugins["ethz"] = {
	name: "ETH Zurich",
	version: "1.0",
	max_message_length: Infinity,
	success_marker: /span class="ok"/,
	charset: "iso-8859-1",
	steps: [
		// Step 1: fetch session key
		{				
			action: "https://idn.ethz.ch/cgi-bin/sms/main.cgi",
			vars: [
				{
					match: /input type="submit" name="(_#[0-9]+#_)"/,
					name: "ETHZ_LOGIN_SUBMIT_KEY",
					index: 1,
					escape: true
				},
				{
					match: /form method="post" action="(https:\/\/idn\.ethz\.ch\/cgi-bin\/sms\/main\.cgi\/[a-zA-Z]+\/_top)"/,
					name: "ETHZ_LOGIN_URL",
					index: 1,
					escape: false
				}
			],
			flags: "-L -s"
		},
		// Step 2: login
		{
			referrer: "https://idn.ethz.ch/cgi-bin/sms/main.cgi",
			action: "%ETHZ_LOGIN_URL%",
			data: "_username=%USERNAME%&_password=%PASSWORD%&_login_page=1&%ETHZ_LOGIN_SUBMIT_KEY%=Login",
			vars: [
				{
					match: /form action="([^\"]+)"/,
					name: "ETHZ_SEND_URL",
					index: 1,
					escape: false
				},
				{ // your number as a sender -- have to be registered for being available
					match: /input type='hidden' name="phoneoriginator" value="([^\"]+)"/,
					name: "ETHZ_PHONE_ORIGINATOR",
					index: 1,
					escape: true
				}
			],
			flags: "-L -s"
		},
		// Step 3: send message
		{
			referrer: "%ETHZ_LOGIN_URL%",
			action: "https://idn.ethz.ch/%ETHZ_SEND_URL%",
			data: "originator=phone&phoneoriginator=%ETHZ_PHONE_ORIGINATOR%&mode=sendsms&phone=%2b%TO_CCODE%%TO%&messagetext=%TEXT%&mode=sendsms",
			check: [
				{
					match: /the volume permitted has been exceeded/,
					reason: "No SMS left."
				},
				{
					match: /not allowed phone number/,
					reason: "Invalid sender."
				}
			],
			flags: "-L -s"
		}
	]
};

