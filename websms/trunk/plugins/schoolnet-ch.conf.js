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
 *	schoolnet-ch.conf.js
 *
 *	Configuration file for the Schoolnet CH (German) service (www.schoolnet.ch)
 *	Requested by D. Negele <amazalo [at] googlemail [dot] com>
 *
 *	Changelog
 *	---------
 *	2008-02-12	Added missing hostnames in actions at step 4 & 5 (me stupid!).
 *			Changed charset to UTF-8.
 *			Added missing submit image button name to post data.
 *	2008-02-11	Initial version (150th anniversary of Our Lady's apparitions in Lourdes).
 *
 */

Plugins["schoolnet-ch"] = {
	name: "Schoolnet CH (Experimental)",
	version: "0.0.1",
	max_message_length: 149,
	success_marker: /sms erfolgreich versandt/i,
	steps: [
		// 1: home page
		{
			action: "http://www.schoolnet.ch/DE/HomeDE.htm",
			flags: "-L -s",
			vars: [
				{
					match: /name="__VIEWSTATE" value="([^"]+)"/i,
					name: "SCHOOLNET_CH_VIEWSTATE"
				}]

		},
		// 2: login page
		{
			referrer: "http://www.schoolnet.ch/DE/HomeDE.htm",
			action: "http://www.schoolnet.ch/schoolnet/Templates/HomePage.aspx?NRMODE=Published&NRNODEGUID=%7bFC1600E3-5CFE-4E47-A279-A0917FF86261%7d&NRORIGINALURL=%2fDE%2fHomeDE%2ehtm&NRCACHEHINT=NoModifyGuest",
			data: "BotM%3AucUser%3AucUser2Col%3AtxtUsername=%USERNAME%&BotM%3AucUser%3AucUser2Col%3AtxtPassword=%PASSWORD%&__EVENTTARGET=BotM%3AucUser%3AucUser2Col%3AcmdLogin&__EVENTARGUMENT=&__VIEWSTATE=%SCHOOLNET_CH_VIEWSTATE%",
			flags: "-L -s"
		},
		// 3: welcome page
		{
			referrer: "http://www.schoolnet.ch/schoolnet/Templates/HomePage.aspx?NRMODE=Published&NRNODEGUID=%7bFC1600E3-5CFE-4E47-A279-A0917FF86261%7d&NRORIGINALURL=%2fDE%2fHomeDE%2ehtm&NRCACHEHINT=NoModifyGuest",
			action: "http://www.schoolnet.ch/DE/FreundeInternet/SMS/",
			flags: "-L -s"
		},
		// 4: compose page, add recipient
		{
			referrer: "http://www.schoolnet.ch/DE/FreundeInternet/SMS/",
			action: "http://www.schoolnet.ch/schoolnet/Templates/Template5Slots.aspx?NRMODE=Published&NRNODEGUID=%7b3137ACAF-0C52-410F-9A46-7AD5941C8884%7d&NRORIGINALURL=%2fDE%2fFreundeInternet%2fSMS%2f&NRCACHEHINT=NoModifyLoggedIn",
			data: "__EVENTTARGET=&__EVENTARGUMENT=&__VIEWSTATE=%SCHOOLNET_CH_VIEWSTATE%&Layout1%3APresentationModeControlsContainer%3A_ctl2%3A_ctl0%3A_ctl0%3Atxt_PhonePrefix=&Layout1%3APresentationModeControlsContainer%3A_ctl2%3A_ctl0%3A_ctl0%3Atxt_Phone=&Layout1%3APresentationModeControlsContainer%3A_ctl2%3A_ctl0%3A_ctl0%3AddlUserSelect=&Layout1%3APresentationModeControlsContainer%3A_ctl2%3A_ctl0%3A_ctl0%3AnoSelec=rbSendNumber&Layout1%3APresentationModeControlsContainer%3A_ctl2%3A_ctl0%3A_ctl0%3AtxtSmsListPrefix=%TO_PREFIX%&Layout1%3APresentationModeControlsContainer%3A_ctl2%3A_ctl0%3A_ctl0%3AtxtSmsListHandy=%TO_NUMBER%&Layout1%3APresentationModeControlsContainer%3A_ctl2%3A_ctl0%3A_ctl0%3Atxt_Message=%TEXT%%20%FROM%&Layout1%3APresentationModeControlsContainer%3A_ctl2%3A_ctl0%3A_ctl0%3AimgBtnAddrAddToGridForSms=&Layout1%3APresentationModeControlsContainer%3A_ctl2%3A_ctl0%3A_ctl0%3AimgBtnAddrAddToGridForSms.x=0&Layout1%3APresentationModeControlsContainer%3A_ctl2%3A_ctl0%3A_ctl0%3AimgBtnAddrAddToGridForSms.y=0",
			flags: "-L -s",
			availabilityCheck: function(response)
			{	
				// You need 1 point to send 1 message, so the number of available messages
				// is equal to the number of points.
				return response.match(/<TD align="right" width="20"><span id="userSnPoints"><B>(\d+)<\/B><\/span><\/TD>/i)[1] - 1;
			},
			vars: [
				{
					match: /name="__VIEWSTATE" value="([^"]+)"/i,
					name: "SCHOOLNET_CH_VIEWSTATE"
				}]
		},
		// 5: compose page, write message & send
		{
			referrer: "http://www.schoolnet.ch/schoolnet/Templates/Template5Slots.aspx?NRMODE=Published&NRNODEGUID=%7b3137ACAF-0C52-410F-9A46-7AD5941C8884%7d&NRORIGINALURL=%2fDE%2fFreundeInternet%2fSMS%2f&NRCACHEHINT=NoModifyLoggedIn",
			action: "http://www.schoolnet.ch/schoolnet/Templates/Template5Slots.aspx?NRMODE=Published&NRNODEGUID=%7b3137ACAF-0C52-410F-9A46-7AD5941C8884%7d&NRORIGINALURL=%2fDE%2fFreundeInternet%2fSMS%2f&NRCACHEHINT=NoModifyLoggedIn",
			data: "__EVENTTARGET=Layout1%3APresentationModeControlsContainer%3A_ctl2%3A_ctl0%3A_ctl0%3AcmdAnswer&__EVENTARGUMENT=&__VIEWSTATE=%SCHOOLNET_CH_VIEWSTATE%&Layout1%3APresentationModeControlsContainer%3A_ctl2%3A_ctl0%3A_ctl0%3Atxt_PhonePrefix=&Layout1%3APresentationModeControlsContainer%3A_ctl2%3A_ctl0%3A_ctl0%3Atxt_Phone=&Layout1%3APresentationModeControlsContainer%3A_ctl2%3A_ctl0%3A_ctl0%3AddlUserSelect=&Layout1%3APresentationModeControlsContainer%3A_ctl2%3A_ctl0%3A_ctl0%3AnoSelec=rbSendNumber&Layout1%3APresentationModeControlsContainer%3A_ctl2%3A_ctl0%3A_ctl0%3AtxtSmsListPrefix=&Layout1%3APresentationModeControlsContainer%3A_ctl2%3A_ctl0%3A_ctl0%3AtxtSmsListHandy=&Layout1%3APresentationModeControlsContainer%3A_ctl2%3A_ctl0%3A_ctl0%3Atxt_Message=%TEXT%%20%FROM%",
			flags: "-L -s",
			vars: [
				{
					match: /name="__VIEWSTATE" value="([^"]+)"/i,
					name: "SCHOOLNET_CH_VIEWSTATE"
				}]
		}
	]
};
