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
 *	o2-ie.conf.js
 *
 *	Configuration file for O2 Ireland (www.o2.ie)
 *	Based on the JackSMS configuration file written by filartrix
 *
 *	Changelog
 *	---------
 *	2007-08-30	First version
 *
 */

Plugins["o2-ie"] = {
	name: "O2 Ireland",
	version: "0.0.1",
	max_message_length: 160,
	success_marker: /Message Sent/,
	steps: [
		{
			referrer: "",
			action: "https://www.o2online.ie/amserver/UI/Login?org=o2ext",
			data: "IDToken1=%USERNAME%&IDToken2=%PASSWORD%&Go=Go",
			flags: "-L -s",
			check: [
				{
					match: /successful due to incorrect details/,
					reason: "Wrong username or password"
				}
			]
		},
		{
			referrer: "",
			action: "http://www.o2online.ie/NASApp/TM/O2/send.jsp?wcmArea=",
			data: "",
			flags: "-L -s"
		},
		{
			referrer: "http://www.o2online.ie/NASApp/TM/O2/send.jsp?wcmArea=",
			action: "http://www.o2online.ie/NASApp/TM/O2/processSendMessage.jsp",
			data: "msisdn=%TO_CCODE%%TO%&Msg=%TEXT%%20%FROM%&Msg1=%TEXT%%20%FROM%&msgcount=&country=&recipients=1&grpSTR=&ConSTR=&command=send&NumMessages=1",
			flags: "-L -s",
			check: [
				{
					match: /Problem sending message/i,
					reason: "Problem sending message"
				},
				{
					match: /Service is currently unavailable/i,
					reason: "Service is currently unavailable"
				},
				{
					match: /maintenance/i,
					reason: "Service under maintenance"
				}
			]
		}
	]
};
