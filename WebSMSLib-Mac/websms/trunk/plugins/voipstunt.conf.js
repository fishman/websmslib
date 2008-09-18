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
 *	voipstunt.conf.js
 *
 *	Configuration file for Voip Stunt (http://www.voipstunt.com)
 *	Based on the open API advertised by VoipStunt at the URL:
 *	http://www.voipstunt.com/en/sms_instructions.html
 *	
 *
 *	Changelog
 *	---------
 *	2008-03-15	First release. The -k option is needed since without no response is returned.
 *
 */

Plugins["voipstunt"] = {
	name: "VoipStunt",
	version: "0.1",
	max_message_length: 160,
	success_marker: /./i,
	steps: [
		{
			action: "https://myaccount.voipstunt.com/clx/sendsms.php?username=%USERNAME%&password=%PASSWORD%&from=%USERNAME%&to=%2B%TO_CCODE%%TO%&text=%TEXT%%20%FROM%",
			flags: "-L -s -k",
			check: 
			[
				{
					match: /do not have enough credit/i,
					reason: 'You have no credit left'
				}
			]
		}
	]
};