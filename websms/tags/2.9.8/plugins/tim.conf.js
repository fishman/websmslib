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
 *	tim.conf.js
 *
 *	Parametri di configurazione per l'invio sms tramite TIM	
 *
 *	Changelog
 *	---------
 *	2008-02-08	Empty plugin step properties no longer required.
 *	2007-08-21	Aggiunto controllo per messaggio di errore numero destinatario non TIM
 *				(una novità che non merita alcun commento).
 *	2007-04-21	Modificato per cambiamenti all'area 119 (Lavoro anche il giorno del mio compleanno, ARGH!)
 *	2007-03-10	Modificato per cambiamenti al sito TIM
 *	2007-01-18	Aggiunto controllo al passo finale per l'errore "Servizio non disponibile"
 *				Aggiunta firma in coda al messaggio.
 *	2007-01-17	Riscritto per la nuova interfaccia web che fa uso di Captcha (non ancora funzionante).
 *
 */

Plugins["tim"] = {
	name: "TIM",
	version: "1.2.4",
	max_message_length: 138,
	success_marker: /stato inviato correttamente\./,
	charset: "iso-8859-1",
	steps: [
		{
			referrer: "http://www.tim.it/consumer/homepage.do",
			action: "https://www.tim.it/yacasWeb/mac/login.do",
			data: "login=%USERNAME%&password=%PASSWORD%&portale=timPortale&urlOk=https://www.tim.it/119/consumerdispatcher",
			flags: "-L -s"
		},
		{
			referrer: "https://www.tim.it/cdas119/p891/serv.do",
			action: "https://www.tim.it/servizitim/mac/redirezionaservizi.do?id_Servizio=6994",
			flags: "-L -s"
		},
		{
			referrer: "https://www.tim.it/servizitim/mac/redirezionaservizi.do?id_Servizio=6994",
			action: "https://www.tim.it/smsdaweb/smsdaweb.do",
			flags: "-L -s",
			availabilityCheck: function(__text)
			{
				return __text.match(/SMS disponibili:\s+<\/div>\s+<div class="contenuto color_blue">\s+(\d+)\s+SMS/)[1] - 1;
			},
			check: [
				{
					match: /Oggi hai raggiunto il numero massimo di SMS gratis a tua disposizione./i,
					reason: "SMS odierni esauriti"
				}],
			vars: [
				{
					match: /(\/smsdaweb\/imagecode\.jpg\?\d\.\d+)/,
					name: "TIM_CAPTCHA_URL",
					escape: false
				}],
			captcha: "https://www.tim.it%TIM_CAPTCHA_URL%"
		},
		{
			referrer: "https://www.tim.it/smsdaweb/smsdaweb.do",
			action: "https://www.tim.it/smsdaweb/inviasms.do",
			data: "tel=%TO%&msg=%TEXT%%20%FROM%&imagecode=%CAPTCHA%&mappaCaratteri=40%2Ca3%2C24%2Ca5%2Ce8%2Ce9%2Cf9%2Cec%2Cf2%2Ce7%2Cd8%2Cf8%2Cc5%2Ce5%2C5f%2C5e%2C7b%2C7d%2C5c%2C5b%2C7e%2C5d%2C7c%2Cc6%2Ce6%2Cdf%2Cc9%2C20%2C21%2C22%2C23%2Ca4%2C25%2C26%2C27%2C28%2C29%2C2a%2C2b%2C2c%2C2d%2C2e%2C2f%2C30%2C31%2C32%2C33%2C34%2C35%2C36%2C37%2C38%2C39%2C3a%2C3b%2C3c%2C3d%2C3e%2C3f%2Ca1%2C41%2C42%2C43%2C44%2C45%2C46%2C47%2C48%2C49%2C4a%2C4b%2C4c%2C4d%2C4e%2C4f%2C50%2C51%2C52%2C53%2C54%2C55%2C56%2C57%2C58%2C59%2C5a%2Cc4%2Cd6%2Cd1%2Cdc%2Ca7%2Cbf%2C61%2C62%2C63%2C64%2C65%2C66%2C67%2C68%2C69%2C6a%2C6b%2C6c%2C6d%2C6e%2C6f%2C70%2C71%2C72%2C73%2C74%2C75%2C76%2C77%2C78%2C79%2C7a%2Ce4%2Cf6%2Cf1%2Cfc%2Ce0",
			flags: "-L -s",
			check: [
				{
					match: /Il testo inserito non corrisponde a quello presente/,
					reason: "Hai inserito un codice scorretto"
				},
				{
					match: /possibile inviare SMS gratuiti da web solo verso Clienti TIM/i,
					reason: "Puoi inviare SMS soltanto a destinatari TIM"
				},
				{
					match: /Servizio non disponibile/,
					reason: "Servizio non disponibile"
				}]
		}
	]
};