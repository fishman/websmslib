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
 *	enel.conf.js
 *
 *	Parametri di configurazione per l'invio sms tramite portale Enel.it	
 *
 *	Basato sul plugin Enel.py del progetto MoioSMS di Silvio Moioli (http://www.moioli.net)
 *
 *	Changelog
 *	---------
 *	2007-01-27	Corretto un referrer errato al passo 3
 *				Aggiunti svariati messaggi d'errore per account inattivo
 *				Aggiunta rilevazione della variabile di controllo variabile (!)
 *				P.S: una sola prova al giorno è davvero troppo poco! Barboni!
 *	2007-01-19	Prima stesura
 *
 */

/**
 *	Here you are adding your plugin to the plugins list.
 *	Use a unique name, to avoid overwriting other plugins :)
 */
Plugins["enel"] = {
	name: "Enel",
	version: "1.2.1",
	max_message_length: 110,
	success_marker: /inviato correttamente/,
	charset: "iso-8859-1",
	steps: [
		{
			referrer: "http://www.enel.it",
			action: "http://www.enel.it/AuthFiles/Login.aspx",
			data: "txtPassword=%PASSWORD%&txtUsername=%USERNAME%&SpontaneousLogon=/Index.asp",
			flags: "-L -s",
			check: [
				{
					match: /Autenticazione fallita/i,
					reason: "Errore di login"
				}]
		},		
		{
			referrer: "http://www.enel.it/Index.asp",
			action: "http://servizi.enel.it/sms/service/scrivisms.asp?SMSstartpage=http://www.enel.it/",
			data: "",
			flags: "-L -s",
			check: [
				{
					match: /Per attivare il servizio/i,
					reason: "Servizio non ancora attivato"
				},
				{
					match: /Inserisci il <b>PIN<\/b> ricevuto/i,
					reason: "PIN non ancora inserito"
				},
				{
					match: /necessario attendere alcuni minuti/i,
					reason: "Attendere alcuni minuti"
				}],
			availabilityCheck: function(__text)
			{
				var matches;
				if (matches = __text.match(/Il numero mensile di Sms disponibili &egrave; <b>(\d)<\/b>/i))
				{
					return matches[1] - 1;
				}
				return 0;
			}
		},		
		{
			referrer: "http://www.enel.it/sms/",
			action: "http://servizi.enel.it/sms/service/scrivisms.asp",
			data: "prefix=%TO_PREFIX%&gsm=%TO_NUMBER%&message=%TEXT%%20%FROM%",
			flags: "-L -s",
			vars: [
				{
					match: /<INPUT TYPE=hidden NAME=(\S+) VALUE='\d+'>/i,
					name: "ENEL_XVAR_NAME"
				},
				{
					match: /<INPUT TYPE=hidden NAME=\S+ VALUE='(\d+)'>/i,
					name: "ENEL_XVAR_VALUE"
				}]
		},
		{
			referrer: "http://servizi.enel.it/sms/service/scrivisms.asp",
			action: "http://servizi.enel.it/sms/service/scrivisms.asp",
			data: "accetta=yes&%ENEL_XVAR_NAME%=%ENEL_XVAR_VALUE%&prefix=%TO_PREFIX%&gsm=%TO_NUMBER%&message=%TEXT%%20%FROM%",
			flags: "-L -s",
			check: [
				{
					match: /superato il limite massimo/i,
					reason: "Puoi inviare un solo SMS al giorno"
				}]
		}
	]
};