/**
 *	tim.conf.js
 *
 *	Parametri di configurazione per l'invio sms tramite TIM	
 *
 */

Plugins["TIM"] = {
	name: "TIM",
	max_message_length: 624,
	success_marker: "Invio effettuato",
	steps: [
		{
			referrer: "http://www.tim.it",
			action: "https://www.tim.it/yacasWeb/mac/login.do",
			data: "login=%USERNAME%&password=%PASSWORD%&portale=timitalia&urlOk=http://www.tim.it&urlKo=http://www.tim.it/timita_errore",
			flags: "-L -s"
		},
		{
			referrer: "http://www.tim.it",
			action: "http://www.i.tim.it/cda/servizi/timn_servizio/0,,68,00.html",
			data: "",
			flags: "-L -s"
		},
		{
			referrer: "http://www.i.tim.it/cda/servizi/timn_servizio/0,,68,00.html",
			action: "http://webmail.posta.tim.it/login?servizio=mail",
			data: "",
			flags: "-L -s"
		},
		{
			referrer: "http://webmail.posta.tim.it/login?servizio=mail",
			action: "http://webmail3.posta.tim.it/agent/moblogin",
			data: "FRAMES=1&USERNAME=%USERNAME%@tim.it&PASSWORD=%PASSWORD%&jsCapable=1&LOCALE=it_IT-TIM-UM&VARIANT=",
			flags: "-L -s"
		},
		{
			referrer: "http://webmail3.posta.tim.it/agent/moblogin",
			action: "http://weblogin.posta.tim.it/ews/jsp/it_IT-TIM-UM/jsp/SMS/composerSMS.jsp?msisdn=%USERNAME%&locale=it_IT-TIM-UM",
			data: "",
			flags: "-L -s",
			check: [
				{
					match: /<a href="javascript:alert\('Raggiunto il numero massimo di invii giornalieri'\);">/gi,
					reason: "SMS odierni esauriti"
				}]
		},
		{
			referrer: "http://weblogin.posta.tim.it/ews/jsp/it_IT-TIM-UM/jsp/SMS/composerSMS.jsp?msisdn=%USERNAME%&locale=it_IT-TIM-UM",
			action: "http://weblogin.posta.tim.it/ews/jsp/it_IT-TIM-UM/jsp/SMS/sendSMS.jsp",
			data: "msisdn=%USERNAME%&locale=it_IT-TIM-UM&SENDER=%FROM%&DEST=%TO%&ABGDEST=&NOME_LISTA=%20&OTPWD=%20&SHORT_MESSAGE=%TEXT%",
			flags: "-L -s",
			check: [
				{
					match: /<font face=Verdana size=1 color=#0a256a><b>sistemi non disponibili <\/b><\/font>/gi,
					reason: "Servizio non disponibile"
				}]

		}
	]
};