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
 *	twitter.conf.js
 *
 *	© Claudio Procida 2008
 *
 *	WebSMS plugin for updating Twitter status
 *
 *	Changelog
 *	---------
 *	2008-04-08	Created.
 *
 */

Plugins["twitter"] = {
	name: "Twitter",
	version: "0.1",
	max_message_length: 160,
	success_marker: /<status>/i,
	transport: 'curl',
	authentication: 'basic',
	username: '%USERNAME%',
	password: '%PASSWORD%',
	steps: [
		{
			action: "http://twitter.com/statuses/update.xml",
			data: "source=websmswidget&status=%TEXT%",
			check: [
				{
					match: /Could not authenticate you/i,
					reason: 'Wrong username or password'
				}
			]
		}
	]
};