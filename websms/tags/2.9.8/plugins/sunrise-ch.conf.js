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
 *	sunrise-ch.conf.js
 *
 *	Configuration file for the sunrise.ch free SMS service (mymobile.sunrise.ch)	
 *	© Christoph Studer <christoph [at] studer [dot] tv>
 *
 *	Changelog
 *	---------
 *  2008-02-08	Added check for account temporarily blocked
 *				Set charset to ISO-8859-1
 *  2007-09-02	Initial version
 *
 */

Plugins["sunrise-ch"] = {
	name: "sunrise.ch",
	version: "0.0.2",
	max_message_length: 130,
	success_marker: /(SMS gesendet|SMS envoy|SMS mandato)/,
	charset: "iso-8859-1",
	steps: [
		// 1. Get cookie
		{
			referrer: "",
			action: "https://mymobile.sunrise.ch/",
			data: "",
			flags: "-L -s"
		},
		// 2. Login
		{
			referrer: "https://mymobile.sunrise.ch/portal/res/guest?paf_dm=full&paf_gear_id=100001&?successURL=/portal/res/member",
			action: "https://mymobile.sunrise.ch/portal/res/guest?paf_dm=full&paf_gear_id=100001&_DARGS=/portal/sunrise/login/html/LargeLogin.jsp",
			data: "_dyncharset=iso-8859-1&_lg=%USERNAME%&_D%3A_lg=+&%2Fch%2Fsunrise%2Fportal%2Fmobile%2Flogin%2FLoginFormHandler.value.password=%PASSWORD%&_D%3A%2Fch%2Fsunrise%2Fportal%2Fmobile%2Flogin%2FLoginFormHandler.value.password=+&_D%3A%2Fch%2Fsunrise%2Fportal%2Fmobile%2Flogin%2FLoginFormHandler.cookie=+&%2Fch%2Fsunrise%2Fportal%2Fmobile%2Flogin%2FLoginFormHandler.nextUrl=%2Fportal%2Fres%2Fguest%3Fpaf_dm%3Dfull%26paf_gear_id%3D100001&_D%3A%2Fch%2Fsunrise%2Fportal%2Fmobile%2Flogin%2FLoginFormHandler.nextUrl=+&%2Fch%2Fsunrise%2Fportal%2Fmobile%2Flogin%2FLoginFormHandler.errUrl=%2Fportal%2Fres%2Fguest%3Fpaf_dm%3Dfull%26paf_gear_id%3D100001&_D%3A%2Fch%2Fsunrise%2Fportal%2Fmobile%2Flogin%2FLoginFormHandler.errUrl=+&%2Fch%2Fsunrise%2Fportal%2Fmobile%2Flogin%2FLoginFormHandler.guestUrl=%2Fportal%2Fres%2Fguest&_D%3A%2Fch%2Fsunrise%2Fportal%2Fmobile%2Flogin%2FLoginFormHandler.guestUrl=+&%2Fch%2Fsunrise%2Fportal%2Fmobile%2Flogin%2FLoginFormHandler.mysuccessUrl=&_D%3A%2Fch%2Fsunrise%2Fportal%2Fmobile%2Flogin%2FLoginFormHandler.mysuccessUrl=+&loginSubmitImage.x=41&loginSubmitImage.y=1&_D%3AloginSubmitImage=+&_DARGS=%2Fportal%2Fsunrise%2Flogin%2Fhtml%2FLargeLogin.jsp",
			flags: "-L -s",
			check: [
					{
						match: /falsche|incorrectes|errati/i,
						reason: "Wrong login!"
					},
					{
						match: /morgen|demain|domani/i,
						reason: "Account disabled. Try again tomorrow."
					}
			]
		},
		// 3. Click onto the SMS link (did not work w/o this step)
		{
			referrer: "https://mymobile.sunrise.ch/portal/res/guest",
			action: "http://mymobile.sunrise.ch/portal/res/member?site=ps&paf_dm=full&paf_gm=content&paf_gear_id=500013",
			data: "",
			flags: "-L -s"
		},
		// 4. Send & extract remaining SMS count
		{
			referrer: "https://mymobile.sunrise.ch/portal/res/member",
			action: "https://mymobile.sunrise.ch/portal/res/member?_DARGS=/portal/sunrise/sms/html/standard_sms.jsp",
			data: "_dyncharset=iso-8859-1&%2Fch%2Fsunrise%2Fportal%2Fmobile%2Fsms%2FSmsSendFormHandler.orgNumber=msisdn&_D%3A%2Fch%2Fsunrise%2Fportal%2Fmobile%2Fsms%2FSmsSendFormHandler.orgNumber=+&%2Fch%2Fsunrise%2Fportal%2Fmobile%2Fsms%2FSmsSendFormHandler.successUrl=%2Fportal%2Fres%2Fmember%3Fpaf_dm%3Dfull%26paf_gear_id%3D500013&_D%3A%2Fch%2Fsunrise%2Fportal%2Fmobile%2Fsms%2FSmsSendFormHandler.successUrl=+&%2Fch%2Fsunrise%2Fportal%2Fmobile%2Fsms%2FSmsSendFormHandler.buyUrl=%2Fportal%2Fres%2Fmember%3Fpaf_dm%3Dfull%26paf_gear_id%3D500013%26site%3DloadSms&_D%3A%2Fch%2Fsunrise%2Fportal%2Fmobile%2Fsms%2FSmsSendFormHandler.buyUrl=+&%2Fch%2Fsunrise%2Fportal%2Fmobile%2Fsms%2FSmsSendFormHandler.destination=%TO%&_D%3A%2Fch%2Fsunrise%2Fportal%2Fmobile%2Fsms%2FSmsSendFormHandler.destination=+&text_count=4&_D%3AMESSAGE=+&MESSAGE=%TEXT%&%2Fch%2Fsunrise%2Fportal%2Fmobile%2Fsms%2FSmsSendFormHandler.update.x=51&%2Fch%2Fsunrise%2Fportal%2Fmobile%2Fsms%2FSmsSendFormHandler.update.y=5&%2Fch%2Fsunrise%2Fportal%2Fmobile%2Fsms%2FSmsSendFormHandler.update=true&_D%3A%2Fch%2Fsunrise%2Fportal%2Fmobile%2Fsms%2FSmsSendFormHandler.update=+&%2Fch%2Fsunrise%2Fportal%2Fmobile%2Fsms%2FSmsSendFormHandler.sendMessages=true&_D%3A%2Fch%2Fsunrise%2Fportal%2Fmobile%2Fsms%2FSmsSendFormHandler.sendMessages=+&%2Fch%2Fsunrise%2Fportal%2Fmobile%2Fsms%2FSmsSendFormHandler.formName=SmsSend&_D%3A%2Fch%2Fsunrise%2Fportal%2Fmobile%2Fsms%2FSmsSendFormHandler.formName=+&_DARGS=%2Fportal%2Fsunrise%2Fsms%2Fhtml%2Fstandard_sms.jsp",
			flags: "-L -s",
			availabilityCheck: function(__text) {
				var match = __text.match(/(\d+)&nbsp;(gratis|gratuis).*/)[1];
				return match;
			}
		}
	]
};
