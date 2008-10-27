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
 *	logicsms-za.conf.js
 *
 *	Configuration file for LogicSMS (http://www.logicsms.co.za)
 *	Based on the open API advertised by LogicSMS at the URL:
 *	http://www.logicsms.co.za/kn.aspx?i=1
 *	
 *
 *	Changelog
 *	---------
 *	2008-03-23	First release.
 *	2008-03-25	Added trailing space to status message in success marker.
 *
 */

Plugins["logicsms-za"] = {
	name: "LogicSMS",
	version: "0.1",
	max_message_length: 160,
	success_marker: /<Status>SENT\s*<\/Status>/i,
	steps: [
		{
			action: "http://www.logicsms.co.za/postmsg2.aspx?username=%USERNAME%&password=%PASSWORD%&mobile=%TO_CCODE%%TO%&message=%TEXT%%20%FROM%&Originator=WebSMS&",
			flags: "-L -s",
			check: [
				{
					match: /Incorrectly formated username/i,
					reason: "Wrong username or password"
				}
			]
		}
	]
};