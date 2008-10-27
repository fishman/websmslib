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
 *	vodafone-ie.conf.js
 *
 *	Configuration file for Vodafone Ireland (www.vodafone.ie)
 *	© Mikolaj Zuberek <mikolaj [at] upcmail [dot] ie>
 *
 *	Changelog
 *	---------
 *	2007-11-07	Created
 *	2007-11-10	First working version
 *
 */

Plugins["vodafone-ie"] = {
	name: "Vodafone Ireland",
	version: "0.0.2",
	max_message_length: 160,
	success_marker: /Message sent/,
	steps: [
		{
			referrer: "https://www.vodafone.ie/",
			action: "https://www.vodafone.ie/myv/services/login/Login.shtml",
			data: "username=%USERNAME%&password=%PASSWORD%&keeplogon=",
			flags: "-L -s -k",
			check: [
				{
					match: /Please check your details/,
					reason: "Wrong username or password"
				},
				{
					match: /Vodafone is currently unavailable/,
					reason: "Service is currently unavailable"
				}
			],
			vars: [
				{
					match: /webtext\/index\.jsp\?ts=([0-9]+)"/,
					name: "VODAFONE_IE_TIMESTAMP"
				}
			]
		},
		{
			referrer: "https://www.vodafone.ie/myv/index.jsp",
			action: "https://www.vodafone.ie/myv/messaging/webtext/index.jsp?ts=%VODAFONE_IE_TIMESTAMP%",
			flags: "-L -s -k",
			availabilityCheck: function(__text)
			{
				return __text.match(/Remaining messages this month: <span class="msg-total">([\d]+)<\/span>/)[1] - 1;
			},
			vars: [
				{
					match: /name="org\.apache\.struts\.taglib\.html\.TOKEN" value="([a-f0-9]+)">/,
					name: "VODAFONE_IE_TOKEN"
				}
			]
		},
		{
			referrer: "https://www.vodafone.ie/myv/messaging/webtext/index.jsp?ts=%VODAFONE_IE_TIMESTAMP%",
			action: "https://www.vodafone.ie/myv/messaging/webtext/Process.shtml",
			data: "recipients[0]=%TO%&recipients[1]=&recipients[2]=&recipients[3]=&recipients[4]=&message=%TEXT%&org.apache.struts.taglib.html.TOKEN=%VODAFONE_IE_TOKEN%&futuredate=&futuretime=",
			flags: "-L -s -k",
			check: [
				{
					match: /Problem sending message/,
					reason: "Problem sending message"
				},
				{
					match: /nicknames could not be found/,
					reason: "You entered a wrong nickname"
				},
				{
					match: /has been a server error/,
					reason: "Server error"
				},
				{
					match: /Service is currently unavailable/,
					reason: "Service is currently unavailable"
				},
				{
					match: /maintenance/,
					reason: "Service under maintenance"
				}
			]
		}
	]
};
