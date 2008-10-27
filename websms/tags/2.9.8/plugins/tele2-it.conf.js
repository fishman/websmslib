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
 *	tele2-it.conf.js
 *
 *	Parametri di configurazione per l'invio sms tramite Tele2 Italia (www.tele2internet.it)	
 *
 *	Changelog
 *	---------
 *	2007-08-30	Prima stesura, basato sul file di configurazione di JackSMS (http://www.jacksms.it)
 *
 */

Plugins["tele2-it"] = {
	name: "Tele2 Italia",
	version: "0.0.1",
	max_message_length: 125,
	success_marker: /stato preso in consegna/,
	charset: "iso-8859-1",
	steps: [
		// This step is a dummy step to feed a cookie set in code
		// What a great hack!
		{
			referrer: "http://www.tele2internet.it/",
			action: "http://www.tele2internet.it/",
			data: "",
			flags: "-L -s",
			cookies: [
				{
					name: "BrowserDetect",
					value: "passed"
				}
			]
		},
		{
			referrer: "http://www.tele2internet.it/",
			action: "http://www.tele2internet.it/clogin.phtml",
			data: "login_username=%USERNAME%&login_password=%PASSWORD%&redirect_url=&go.x=&go.y=",
			flags: "-L -s",
			check: [
				{
					match: /Nome utente o password non validi/i,
					reason: "Username o password errati"
				}]
		},
		{
			referrer: "http://www.tele2internet.it/clogin.phtml",
			action: "http://www.sms.tele2internet.it/",
			data: "",
			flags: "-L -s",
			vars: [
				{
					match: /input type="hidden" name="uniqID" value="([^"]+)"/,
					name: "TELE2_IT_UID"
				}]
		},
		{
			referrer: "http://www.sms.tele2internet.it/",
			action: "http://www.sms.tele2internet.it/",
			data: "banner_id=&type_flash=&timed_at=&uniqID=%TELE2_IT_UID%&message=%TEXT%%20%FROM%&gsmnumber=%2B%TO_CCODE%%TO%&show_sender_number=&fromname=%FROM%&send_sms=Invia",
			flags: "-L -s",
			check: [
				{
					match: /Il messaggio non pu/i,
					reason: "Messaggio troppo lungo"
				},
				{
					match: /necessario disporre di/i,
					reason: "Pepite insufficienti"
				}]
		}
	]
};