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
 *	gmx.conf.js
 *
 *	Configuration file for GMX.com
 *	© Andreas Beier <abeier [at] gmx [dot] com>
 *
 *	Changelog
 *	2007-01-30	Added logout as first step
 *			
 *	2007-01-27	Modified to correctly handle (+) country code in query strings
 *	2007-01-23	First release
 *
 */
 Plugins["gmx"] = {
	name: "GMX",
	version: "1.2.1",
	max_message_length: 159,
	success_marker: /SMS-Nachricht wurde an /,
	charset: "iso-8859-1",
	steps: [
		// Preventive Logout to avoid the GMX timeout reminder
		// We do not logout after all.
		{
			referrer: "https://www.gmx.net/de/dienst/",
			action: "https://service.gmx.net/de/cgi/nph-logout?CUSTOMERNO=%USERNAME%",
			data: "",
			flags: "-L -s"
		},
		// Login to GMX
		{
			referrer: "https://www.gmx.net/de/dienst/",
			action: "https://service.gmx.net/de/cgi/login",
			data: "AREA=1&EXT=&EXT2=&id=%USERNAME%&p=%PASSWORD%",
			flags: "-L -s",
			vars: [
				{
					match: /CUSTOMERNO=\d+&t=(de[a-f\.\d]+)/,
					name: "GMX_SESSION_ID"
				},
				{
					match: /CUSTOMERNO=(\d+)&t=de[a-f\.\d]+/,
					name: "GMX_CUSTOMER_NO"
				}]
		},
		// Call SMS page
		{
			referrer: "http://service.gmx.net/de/cgi/g.fcgi/startpage?site=greetings&CUSTOMERNO=%GMX_CUSTOMER_NO%&lALIAS=&lDOMAIN=&lLASTLOGIN=&t=%GMX_SESSION_ID%&",
			action: "https://service.gmx.net/de/cgi/sms?CUSTOMERNO=%GMX_CUSTOMER_NO%&t=%GMX_SESSION_ID%",
			data: "",
			flags: "-L -s",
			availabilityCheck: function(__text)
			{
				var matches;
				if (matches = __text.match(/<td><strong>(\d+)<\/strong> von <strong>(\d+)<\/strong>/))
				{
					return (matches[2] - matches[1] - 1);
				}
				return 0;
			}
		},
		// Enter data and continue
		{
			referrer: "https://service.gmx.net/de/cgi/sms?CUSTOMERNO=%GMX_CUSTOMER_NO%&t=%GMX_SESSION_ID%",
			action: "https://service.gmx.net/de/cgi/sms",
			data: "CUSTOMERNO=%GMX_CUSTOMER_NO%&t=%GMX_SESSION_ID%&AREA=11&SPONSOR=&USEPRO=0&nr=%TO%&email=&msg=%TEXT%%20%FROM%",
			flags: "-L -s",
			check: [
        		{
		        	match: /<li>Die Nummer ist ung&uuml;ltig!<\/li>/i,
          			reason: "Die Nummer ist ungültig!"
        		}],
			vars: [
				{
					match: /name=\"nr\"\svalue=\"\+(\d+)\">/,
					name: "GMX_TO"
				}]
		},	
		// Confirm SMS
		{
			referrer: "https://service.gmx.net/de/cgi/sms?CUSTOMERNO=%GMX_CUSTOMER_NO%&t=%GMX_SESSION_ID%",
			action: "https://service.gmx.net/de/cgi/sms",
			data: "CUSTOMERNO=%GMX_CUSTOMER_NO%&t=%GMX_SESSION_ID%&AREA=12&nr=%2B%GMX_TO%&msg=%TEXT%%20%FROM%&email=&USEPRO=0&SPONSOR=",
			flags: "-L -s"
		}
	]
};