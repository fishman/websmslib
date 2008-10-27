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
 *	att-us.js
 *	
 *	© Michael Pederson 2008
 *	<michael [dot] pederson [at] gmail [dot] com>
 *
 *	Note: this plugin will send SMS to and from AT&T subscribers only.
 */

Plugins["att-us"] = {
	name: "AT&T USA",
	version: "0.1",
	max_message_length: 160,
	success_marker: /Your message has been sent\./,
	steps: [
		/**
		 *	Step 1: Set pre-login session cookies by pulling login page. 
		 *	curl -L -c cookie-file https://www.wireless.att.com/olam/loginAction.olamexecute
		 */    
		{
			action: "https://www.wireless.att.com/olam/loginAction.olamexecute",
			flags: "-L -s",
			vars: [
				{
					// Grab session ID used in the login URL
					name: "ATT_US_SESSIONID",
					match: /loginAction\.doview;EDOCSSESSIONID=([^"]+)"/
				}
			]
		},    
	
		/**
		 *	Step 2: Send login info.  AT&T passwords are limited to letters and numbers.
		 *	curl -L -b cookie-file -c cookie-file -d "pass=%PASSWORD%&wireless_num=%USERNAME%&actionEvent=preAuthenticate&ajaxSupported=true&x=0&y=0" https://www.wireless.att.com/olam/loginAction.doview;EDOCSSESSIONID=%ATT_US_SESSIONID%
		 */
		{
			action: "https://www.wireless.att.com/olam/loginAction.doview;EDOCSSESSIONID=%ATT_US_SESSIONID%",
			data: "pass=%PASSWORD%&wireless_num=%USERNAME%&actionEvent=preAuthenticate&ajaxSupported=true&x=0&y=0",
			flags: "-L -s",
			check: [
				{
					match: /The password you entered does not match the password for this wireless number/,
					reason: "Wrong Password"
				},
				{
					match: /The wireless number you entered is not found in our records/,
					reason: "Username/Number does not exist"
				}
			]
		},
	
		/**
		 *	Step 2.5: Second part of sending login info.
		 *	curl -L -b cookie-file -c cookie-file -d "IDToken1=%USERNAME%&IDToken2=%PASSWORD%&goto=https%3a%2f%2fwww.wireless.att.com%3a443%2folam%2floginAction.olamexecute%3factionEvent%3dlogin%26reportActionEvent%3dA_LGN_LOGIN_SUB&gotoOnFail=https%3a%2f%2fwww.wireless.att.com%3a443%2folam%2fauthenticateAction.olamexecute%3factionEvent%3dauthenticateFailed%26reportActionEvent%3dA_LGN_LOGIN_SUB" https://idis.wireless.att.com/amserver/UI/Login?IDToken0=&IDButton=Submit&arg=newsession&gx_charset=UTF-8
		 */   
		{
			action: "https://idis.wireless.att.com/amserver/UI/Login?IDToken0=&IDButton=Submit&arg=newsession&gx_charset=UTF-8",
			data: "IDToken1=%USERNAME%&IDToken2=%PASSWORD%&goto=https%3a%2f%2fwww.wireless.att.com%3a443%2folam%2floginAction.olamexecute%3factionEvent%3dlogin%26reportActionEvent%3dA_LGN_LOGIN_SUB&gotoOnFail=https%3a%2f%2fwww.wireless.att.com%3a443%2folam%2fauthenticateAction.olamexecute%3factionEvent%3dauthenticateFailed%26reportActionEvent%3dA_LGN_LOGIN_SUB",
			flags: "-L -s"
		},
	
		/**
		 *	Step 3: Send message.
		 *	curl -L -b "/Users/rlwimi/Desktop/curl/cookies/websms.att-us.cookies" -c "/Users/rlwimi/Desktop/curl/cookies/websms.att-us.cookies" -d "toCtnAreaCode=512&toCtnPrefix=563&toCtnNumber=3705&msgBody=curl+FTW%21&charsRemaining=141" -o "/Users/rlwimi/Desktop/curl/curl_send_text.html" --trace-ascii "/Users/rlwimi/Desktop/curl/curl_send_text.trace" "https://www.wireless.att.com/olam/gotoPhone.olamexecute?event=sendTextMessage&reportActionEvent=A_PHON_SEND_MSG_SUB"
		 */
		{
			action: "https://www.wireless.att.com/olam/gotoPhone.olamexecute?event=sendTextMessage&reportActionEvent=A_PHON_SEND_MSG_SUB",
			data: "toCtnAreaCode=%TO_US_AREACODE%&toCtnPrefix=%TO_US_PREFIX%&toCtnNumber=%TO_US_NUMBER%&msgBody=%TEXT%",
			flags: "-L -s",
			check: [
				{
					match: /not a valid AT&T wireless number/,
					reason: "Receiver must be an AT&T wireless subscriber."
				}
			]
		}
	]
};
