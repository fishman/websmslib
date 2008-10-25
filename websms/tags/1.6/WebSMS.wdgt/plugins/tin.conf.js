/**
 *	tin.conf.js
 *
 *	Parametri di configurazione per l'invio sms tramite Tin.it
 *
 *	basato sul modulo WWW::SMS::Tin scritto da Fabio Marzocca <thesaltydog@gmail.com>
 *	e Ivo Marino <eim@users.sourceforge.net> per il progetto WWW-SMS <http://www-sms.sf.net>
 */

Plugins["Tin"] = {
	name: "Tin",
	max_message_length: 147,
	success_marker: "Messaggio inviato",
	steps: [
		{
			referrer: "",
			action: "http://communicator.virgilio.it/asp/login.asp?pop_login=%USERNAME%&password=%PASSWORD%",
			data: "",
			flags: "-L -s"
		},
		{
			referrer: "",
			action: "http://gsmailmd.umail.virgilio.it:8080/supermail/controller?username=%USERNAME%",
			data: "",
			flags: "-L -s"
		},
		{
			referrer: "",
			action: "http://gsmailmd.umail.virgilio.it:8080/supermail/controller",
			data: "username=%USERNAME%&recipient=%TO%&testo=%TEXT%&action=sendsms",
			flags: "-L -s"
		}
	]
};
