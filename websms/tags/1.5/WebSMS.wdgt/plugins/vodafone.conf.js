/**
 *	vodafone.conf.js
 *
 *	Parametri di configurazione per l'invio sms tramite Vodafone (190.it)	
 *
 */

Plugins["Vodafone"] = {
	name: "Vodafone",
	max_message_length: 360,
	success_marker: "La tua richiesta e' stata elaborata correttamente.",
	steps: [
		{
			referrer: "http://www.190.it/190/trilogy/jsp/homePage.do?tabName=HOME+190&ty_skip_md=true",
			action: "http://www.190.it/190/trilogy/jsp/login.do",
			data: "username=%USERNAME%&password=%PASSWORD%",
			flags: "-L -s"
		},
		{
			referrer: "http://www.190.it/190/trilogy/jsp/homePage.do?tabName=HOME+190",
			action: "http://www.190.it/190/trilogy/jsp/common/ty_iPage.jsp?retURL=http%3A%2F%2Fwww.areaprivati.190.it%2F190%2Ftrilogy%2Fjsp%2Fdispatcher.do%3Fty_key%3Dfsms_hp",
			data: "",
			flags: "-L -s"
		},
		{
			referrer: "",
			action: "http://www.areaprivati.190.it/190/trilogy/jsp/dispatcher.do?ty_key=fsms_hp&ipage=next",
			data: "",
			flags: "-L -s"
		},
		{
			referrer: "http://www.areaprivati.190.it/190/trilogy/jsp/programPage.do?ty_key=fsms_hp&ty_program_page=%2fprecheck.do&channelId=-18126&ty_target_type=1&pageTypeId=9604&ipage=next&programId=10384&ty_program_ctx=%2ffsms&ty_nocache=true",
			action: "http://www.areaprivati.190.it/190/fsms/prepare.do",
			data: "pageTypeId=9604&programId=10384&channelId=-18126&receiverNumber=%TO%&message=%TEXT%",
			flags: "-L -s",
			check: [
				{
					match: /<div align="left">Ti ricordiamo che puoi inviare SMS via Web solo a numeri di cellulare Vodafone.<br>/gi,
					reason: "Puoi inviare SMS soltanto a numeri Vodafone"
				}]
		},
		{
			referrer: "http://www.areaprivati.190.it/190/fsms/prepare.do",
			action: "http://www.areaprivati.190.it/190/fsms/send.do?pageTypeId=9604&programId=10384&channelId=-18126",
			data: "",
			flags: "-L -s"
		}
	]
};