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
 *	alice.conf.js
 *
 *	Parametri di configurazione per l'invio sms tramite Alice
 *
 *	Changelog
 *	2007-04-13	Introdotto controllo sistemi non disponibili
 *	2007-03-16	Alfin funzionante dopo l'ennesimo cambiamento e introduzione del CAPTCHA
 *	2006-10-20	Aggiornato per cambiamenti al sito alice.it
 *				Ridotto il numero di passi a tre.
 *	2006-07-23	Aggiunta la firma in coda al messaggio
 *	          	Implementata la funzione che ritorna il numero di messaggi residui
 *
 */

Plugins["alice"] = {
	name: "Alice",
	version: "1.2.1",
	max_message_length: 150,
	success_marker: /Vuoi aggiungerli ora/,
	charset: "iso-8859-1",
	steps: [
		{
			referrer: "http://pf.rossoalice.alice.it",
			action: "http://authsrs.alice.it/aap/validatecredential",
			data: "DOMAIN=&dominio=@alice.it&password=%PASSWORD%&pwd=%PASSWORD%&PASS=%PASSWORD%&login=%USERNAME%@alice.it&msisdn=%USERNAME%&usernameDisplay=%USERNAME%&username=%USERNAME%@alice.it&user=%USERNAME%@alice.it&URL_OK=http://portale.rossoalice.alice.it/ps/MailServizi_WP.do&channel=hp_alice&servizio=mail&a3aid=na&a3afep=http://portale.rossoalice.alice.it/ps/ManageCodError.do?code=470",
			flags: "-L -s"
		},
		{
			referrer: "http://portale.rossoalice.alice.it/ps/MailServizi_WP.do",
			action: "http://portale.rossoalice.alice.it/ps/HomePS.do?area=welcomePage",
			data: "",
			flags: "-L -s"
		},
		{
			referrer: "http://portale.rossoalice.alice.it/ps/HomePS.do?area=welcomePage",
			action: "http://portale.rossoalice.alice.it/ps/navigazione.do?area=welcomePage&areaclienti=187",
			data: "",
			flags: "-L -s"
		},
		{
			referrer: "http://portale.rossoalice.alice.it/ps/navigazione.do?area=welcomePage&areaclienti=187",
			action: "http://portale.rossoalice.alice.it/ps/Posta.do",
			data: "",
			flags: "-L -s"
		},
		{
			referrer: "http://portale.rossoalice.alice.it/ps/Posta.do",
			action: "http://portale.rossoalice.alice.it/ps/menuGold.do",
			data: "",
			flags: "-L -s"
		},
		{
			referrer: "http://portale.rossoalice.alice.it/ps/menuGold.do",
			action: "http://auth.rossoalice.alice.it/aap/serviceforwarder?sf_dest=ibox_inviosms",
			data: "",
			flags: "-L -s"
		},
		{
			referrer: "http://webloginmobile.rossoalice.alice.it/sunrise/loginSunriseWeb?",
			action: "http://webloginmobile.rossoalice.alice.it/alice/jsp/SMS/composer.jsp?ID_Field=0&ID_Value=0&id_clickto=0&dummy=dummy",
			data: "",
			flags: "-L -s",
			check: [
				{
					match: /sistemi non disponibili/i,
					reason: "Servizio non disponibile"
				},
				{
					match: /ad ogni destinatario ha un costo/i,
					reason: "SMS gratuiti odierni esauriti"
				}
			],
			availabilityCheck: function(__text)
			{
				var matches;
				if (matches = __text.match(/Oggi hai ancora +a disposizione <b>\s+(\d+) SMS GRATUITI<\/b>/i))
				{
					return matches[1] - 1;
				}
				return 0;
			}
		},
		{
			referrer: "http://webloginmobile.rossoalice.alice.it/alice/jsp/SMS/composer.jsp?ID_Field=0&ID_Value=0&id_clickto=0&dummy=dummy",
			action: "http://webloginmobile.rossoalice.alice.it/alice/jsp/SMS/CheckDest.jsp",
			data: "DEST=%TO%&ABGDEST=&TYPE=smsp&ABG_NOME_LISTA=&NOME_LISTA=2800&SHORT_MESSAGE2=%TEXT%%20%FROM%&SHORT_MESSAGE=%E_TEXT%%2520%E_FROM%&INVIA_SUBITO=true&GIORNO=&ORE=&MINUTI=",
			flags: "-L -s"
		},
		{
			referrer: "http://webloginmobile.rossoalice.alice.it/alice/jsp/SMS/CheckDest.jsp",
			action: "http://webloginmobile.rossoalice.alice.it/alice/jsp/SMS/inviaSms.jsp",
			data: "MINUTI=&SHORT_MESSAGE=%E_TEXT%%2520%E_FROM%&ABG_NOME_LISTA=&TYPE=smsp&ORE=&GIORNO=&INVIA_SUBITO=true&ABGDEST=&SHORT_MESSAGE2=%TEXT%%20%FROM%&NOME_LISTA=&DEST=%TO%&nonInviati=2800&nonInRubrica=%TO%",
			flags: "-L -s",
			captcha: "http://webloginmobile.rossoalice.alice.it/alice/jsp/EwsJCaptcha.jpg"			
		},
		{
			referrer: "http://webloginmobile.rossoalice.alice.it/alice/jsp/SMS/inviaSms.jsp",
			action: "http://webloginmobile.rossoalice.alice.it/alice/jsp/SMS/inviaSms.jsp",
			data: "MINUTI=&SHORT_MESSAGE=%E_TEXT%%2520%%E_FROM%&NOME_LISTA=&nonInviati=2800&ABG_NOME_LISTA=&nonInRubrica=%TO%&TYPE=smsp&ORE=&DEST=%TO%&GIORNO=&INVIA_SUBITO=true&ABGDEST=&SHORT_MESSAGE2=%TEXT%%20%FROM%&captchafield=%CAPTCHA%",
			flags: "-L -s"
		}
	]
};
