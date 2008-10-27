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
 *	tin.conf.js
 *
 *	Parametri di configurazione per l'invio sms tramite Tin.it
 *
 *	basato sul modulo WWW::SMS::Tin scritto da Fabio Marzocca <thesaltydog [at] gmail [dot] com>
 *	e Ivo Marino <eim [at] users [dot] sourceforge [dot] net> per il progetto WWW-SMS <http://www-sms.sf.net>
 *
 *	2006-07-10	Aggiunta la patch sottoposta da marco <marcord [at] virgilio [dot] it>
 *	2006-07-23	Aggiunta la firma in coda al messaggio
 */

Plugins["tin"] = {
	name: "Tin",
	version: "1.2.1",
	max_message_length: 147,
	success_marker: /Messaggio inviato/,
	charset: "iso-8859-1",
	steps: [
		{
			referrer: "",
			action: "http://communicator.virgilio.it/asp/login.asp?pop_login=%USERNAME%&password=%PASSWORD%",
			data: "",
			flags: "-L -s"
		},
		{
			referrer: "",
			action: "http://gsmailmdumail.alice.it:8080/supermail/controller?username=%USERNAME%",
			data: "",
			flags: "-L -s"
		},
		{
			referrer: "",
			action: "http://gsmailmdumail.alice.it:8080/supermail/controller",
			data: "username=%USERNAME%&recipient=%TO%&testo=%TEXT%%20%FROM%&action=sendsms",
			flags: "-L -s"
		}
	]
};
