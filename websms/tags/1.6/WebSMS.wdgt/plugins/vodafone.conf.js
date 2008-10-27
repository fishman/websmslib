/**
 *	vodafone.conf.js
 *
 *	Parametri di configurazione per l'invio sms tramite Vodafone (190.it)	
 *
 *	Changelog
 *	---------
 *	2006-03-22	Aggiornati gli indirizzi per riflettere i cambiamenti del sito 190.it
 *
 */

Plugins["Vodafone"] = {
	name: "Vodafone",
	max_message_length: 360,
	success_marker: "La tua richiesta e' stata elaborata correttamente.",
	steps: [
		{
			referrer: "http://190.it/190/trilogy/jsp/home.do?tabName=HOME+190&ty_skip_md=true",
			action: "http://190.it/190/trilogy/jsp/login.do",
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
			referrer: "http://www.areaprivati.190.it/190/trilogy/jsp/programView.do?ty_target_type=1&ty_program_ctx=/fsms&ty_program_page=/precheck.do&ty_nocache=true&pageTypeId=9604&channelId=-18126&programId=10384&ty_key=fsms_hp&ipage=next",
			action: "http://www.areaprivati.190.it/190/fsms/prepare.do",
			data: "receiverNumber=%TO%&message=%TEXT%",
			flags: "-L -s",
			check: [
				{
					match: /<div align="left">Ti ricordiamo che puoi inviare SMS via Web solo a numeri di cellulare Vodafone.<br>/gi,
					reason: "Puoi inviare SMS soltanto a numeri Vodafone"
				}]
		},
		{
			referrer: "http://www.areaprivati.190.it/190/fsms/prepare.do",
			action: "http://www.areaprivati.190.it/190/fsms/send.do",
			data: "receiverNumber=%TO%&message=%TEXT%",
			flags: "-L -s"
		}
	]
};
