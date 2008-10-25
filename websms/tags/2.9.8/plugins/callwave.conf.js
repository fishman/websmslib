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
 *	callwave.conf.js
 *
 *	Parametri di configurazione per l'invio sms tramite Callwave (www.callwave.com)	
 *
 *	Changelog
 *	---------
 *	2007-04-15	Utilizzati segnaposto non codificati per testo e mittente.
 *	2007-04-13	Sostituito segnaposto del codice internazionale. Adesso il plugin può essere
 *				utilizzato per inviare SMS anche all'estero.
 *	2007-04-12	Aggiornato alla versione 2 del protocollo Callwave
 *				Username e password sono adesso n. di telefono e codice PIN
 *	2007-01-18	Aggiunta verifica del buon esito dell'invio
 *				Aggiunta firma in coda al messaggio
 *	2007-01-17	Aggiunta verifica dello stato di sospensione del servizio
 *	2007-01-16	Costretto da UsqueTandem ad implementare il plugin sotto minaccia di morte :)
 *
 */

Plugins["callwave"] = {
	name: "Callwave",
	version: "1.2.3",
	max_message_length: 160,
	success_marker: /<status>0<\/status>/,
	steps: [
		{
			referrer: "",
			action: "http://wx0.callwave.com/v2w",
			data: "<?xml version=\\\"1.0\\\" encoding=\\\"UTF-8\\\"?><request><type>AUTH</type><src>SX</src><ver>3.6</ver><os>MacPPC</os><phone>%USERNAME%</phone><pin>%PASSWORD%</pin></request>",
			flags: "-L -s",
			vars:
			[
				{
					match: /<account>([^<]+)<\/account>/,
					name: "CW_ACCOUNT_ID"
				},
				{
					match: /<uString>([^<]+)<\/uString>/,
					name: "CW_USTRING"
				}
			],
			check:
			[
				{
					match: /not find an account/i,
					reason: "Bad account"
				},
				{
					match: /4-10 digits/i,
					reason: "Pin code must have 4-10 digits"
				}
			]
		},
		{
			referrer: "",
			action: "http://wx0.callwave.com/v2w",
			data: "<?xml version=\\\"1.0\\\" encoding=\\\"UTF-8\\\"?><request><type>SSMS</type><src>SX</src><ver>3.6</ver><os>MacPPC</os><account>%CW_ACCOUNT_ID%</account><uString>%CW_USTRING%</uString><sendToPhoneNumber>+%TO_CCODE% %TO%</sendToPhoneNumber><sendToCarrierID>-1</sendToCarrierID><sendFromPreference>0</sendFromPreference><message>%U_TEXT% %U_FROM%</message></request>",
			flags: "-L -s",
			check:
			[
				{
					match: /Exceeded daily limit/i,
					reason: "Exceeded daily limit"
				},
				{
					match: /Destination country not supported/i,
					reason: "Destination country not supported"
				}
			]
		}
	]
};
