/**
 *	alice.conf.js
 *
 *	Parametri di configurazione per l'invio sms tramite Alice
 *
 *	Known issues:
 *	- Impossibile ottenere l'output di curl per il secondo e il terzo passo :(
 *
 */

Plugins["Alice"] = {
	name: "Alice",
	max_message_length: 627,
	success_marker: ">OK<",
	steps: [
		{
			referrer: "http://mail.virgilio.it/mail/home/index.html?servizio=mail_webmail",
			action: "http://auth.rossoalice.virgilio.it/aap/validatecredential",
			data: "login=%USERNAME%@alice.it&pwd=%PASSWORD%&URL_OK=http://portale.rossoalice.virgilio.it/ps/PortaleServizi.do&URL_KO=http://mail.virgilio.it/mail/home/errore_login.html&URL_ERROR=http://portale.rossoalice.virgilio.it/ps/pages/error/dx/SDUrlError.jsp&URL_PROV=http://portale.rossoalice.virgilio.it/ps/pages/error/alice/SDUrlProv.jsp&servizio=mail&msisdn=%USERNAME%&username=%USERNAME%@alice.it&user=%USERNAME%@alice.it&a3aid=comhpvi&a3afep=http://mail.virgilio.it/mail/home/mail_error.html&DOMAIN=&PASS=%PASSWORD%&usernameDisplay=%USERNAME%&dominio=@alice.it&password=%PASSWORD%",
			flags: "-L -s"
		},
		{
			referrer: "http://portale.rossoalice.virgilio.it/ps/tiles/gold/menuGoldMaster.jsp?service=mail_webmail&offerta=N&targetURL=",
			action: "http://auth.rossoalice.virgilio.it/aap/serviceforwarder?sf_dest=sms_inviosmsalice",
			data: "",
			flags: "-L -s --connect-timeout 10 -m 10 2>&1"
		},
		{
			referrer: "http://sms.alice.it/scu187/wond_inviaSms.do",
			action: "http://sms.alice.it/scu187/wond_inviaSms.do",
			data: "prefisso=%TO_PREFIX%&numDest=%TO_NUMBER%&testo=%TEXT%",
			flags: "-L -s",
			check: [
				{
					match: /<td width="90%" class="white11bs" valign="middle">&Egrave; possibile inviare gratuitamente fino a 10 SMS al giorno<\/td>/,
					reason: "SMS odierni esauriti"
				}
			]
		}
	]
};
