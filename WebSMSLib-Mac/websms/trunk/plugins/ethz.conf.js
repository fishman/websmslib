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
 *  2008-05-21  Use ETH gateway direct API; support available messages left.
 *	2008-02-23	First release.
 *
 */

Plugins["ethz"] = {
	name: "ETH Zürich SMS gateway",
	version: "2.0",
	max_message_length: Infinity,
	success_marker: /^200 /,
	charset: "iso-8859-1",
	steps: [
		// Step 1: fetch session key
		{				
			//action: "https://www.sms.ethz.ch/send.pl?action=sendsms&username=%USERNAME%&password=%PASSWORD%&originator=phone&number=%2B%TO_CCODE%%TO%&message=%TEXT%",
			action: "https://ndev9.ethz.ch/cgi-bin/sms/send.pl",
			data: "action=sendsms&username=%USERNAME%&password=%PASSWORD%&originator=phone&number=%2B%TO_CCODE%%TO%&message=%TEXT%",
			check: [
				{
					match: /^402/,
					reason: "Invalid username."
				},
				{
					match: /^403/,
					reason: "Wrong password."
				}
			],
			flags: "-L -s",
			availabilityCheck: function(__text) {
				// messages allowed every day
				var messagesADay = 20;
				// messages left for this day
				var messagesLeft;
				
				// compute "today"
				var d = new Date();
				var curdate_ddmmyyyy = d.getDate().toString() + "-" + d.getMonth().toString() + "-" + d.getFullYear().toString();
				
				// records of previous messages sent?
				var record_date = widget.preferenceForKey("ethz_smsleft_date");
				
				if (record_date == undefined || record_date != curdate_ddmmyyyy) {
					// no records for today
					// have all the messages available for this day minus the one just sent
					messagesLeft = messagesADay - 1;
					
					// store/update the number of messages left for today
					widget.setPreferenceForKey(curdate_ddmmyyyy, "ethz_smsleft_date");
				} else {
					// some of today's messages are already consumed. Recall how many
					messagesLeft = widget.preferenceForKey("ethz_smsleft_number");
					if (messagesLeft == undefined) {
						// unexpectedly found date but not number. Set it to messagesADay-1
						messagesLeft = messagesADay - 1;
					} else {
						// information retrieved, update the counter
						messagesLeft = messagesLeft - 1;
					}
				}
				
				// store/update the number of messages left for today
				widget.setPreferenceForKey(messagesLeft, "ethz_smsleft_number");
				
				// return the number of messages left
				return messagesLeft;
			}
		}
	]
};

