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
 *
 *	Changelog
 *
 *	2008-02-02	Added custom user agent with system version and WebSMS software version.
 *	2007-11-05	Fixed bogus negation in success check.
 *	2007-08-24	Spaces in plugin names are replaced by underscores to make shell work easier.
 *	2007-04-13	Modificato pannello preferenze, aggiunta barra dei tab.
 *				Aggiunti pannelli Internazionale, Colore, Aggiornamento Software
 *	2007-01-30	Aggiunto supporto ai proxy.
 *	2007-01-20	Implementato salvataggio degli SMS inviati nella libreria dell'utente.
 *	2007-01-19	Aggiunto contatore degli SMS inviati, e un promemoria per la donazione.
 *	2007-01-18	Aggiunta funzione di dump delle risposte del server e di passaggi salienti in
 *				modalità Debug.
 *				Aggiunta indicazione dei messaggi rimasti per i plugin che implementano il metodo
 *				availabilityCheck(__text).
 *	2007-01-16	Aggiunto supporto per i Captcha.
 *	2006-07-23	Riorganizzate le classi. Il plugin e il provider sono stati assegnati alla classe Phone.
 *	          	Il Message adesso contiene soltanto informazioni relative al messaggio di testo.
 */

/* Preferences keys */
var DEBUG_KEY = "Debug";
var STEALTH_MODE_KEY = "StealthMode";
var SMS_COUNT_KEY = "SMS sent";
var DO_NOT_SAVE_KEY = "Do not save";

/* Keycodes */
var BACKSPACE_KEYCODE = 8;
var ESCAPE_KEYCODE = 27;

var __replacements = {};

var phone = null;

var WEBSMS_USER_AGENT = null;
window.userAgent = function()
{
	if (!WEBSMS_USER_AGENT)
	{
		if (widget.preferenceForKey(STEALTH_MODE_KEY))
		{
			// Disguise as Safari
			WEBSMS_USER_AGENT = "Mozilla/5.0 (Macintosh; U; PPC Mac OS X; %s) AppleWebKit/523.12.2 (KHTML, like Gecko) Version/3.0.4 Safari/523.12.2".sprintf(window.getSystemLanguage());
		}
		else
		{
			WEBSMS_USER_AGENT = "Mozilla/5.0 (Mac OS X; %s) WebSMS/%s".sprintf(ABPlugin.systemVersionString(), window.getInfoDictionaryValueForKey("CFBundleVersion").trim());
		}
	}
	return WEBSMS_USER_AGENT;
};

function setup()
{
	PluginManager.loadPlugins(function()
	{	
		phone = new Phone();

		phone.init();
		
		AddressBook.load();
		Proxy.loadSettings();
		CountrySelector.init();
		SUUpdater.init();
		
		setTimeout(function()
			{
				new Fader({
					elements: {
						first: document.getElementById("eme-splash")
					},
					from: 1.0,
					to: 0.0,
					postflight: function()
					{
						phone._widget._textField.disabled = false;
						phone._widget._textField.style.opacity = 1.0;
						phone._widget.focusTextField();
					}}).run(); 
			},
			200);		
	});

	widget.onremove = function() { phone.clearPreferences() };	
	document.addEventListener("keydown", _onkeydown, true);
}

function _onkeydown(evt)
{
	switch (evt.keyCode)
	{
		case BACKSPACE_KEYCODE:
			if (evt.metaKey &&
				!phone._widget.isShowingMessage &&
				!phone._widget.isShowingCaptcha &&
				!phone._widget.isSendingMessage)
			{
				phone._widget.setText("");
				phone.updateAvailableChars(phone._widget._textField, null);
				evt.stopPropagation();
				evt.preventDefault();
			}
			break;
		case ESCAPE_KEYCODE:
			phone.abortSending();
			break;
		
		// Text translation
		case 64: // 'A'
			attemptTranslationTo(evt, 'ar');
			break;
		case 68: // 'D'
			attemptTranslationTo(evt, 'de');
			break;
		case 69: // 'E'
			attemptTranslationTo(evt, 'en');
			break;
		case 70: // 'F'
			attemptTranslationTo(evt, 'fr');
			break;
		case 73: // 'I'
			attemptTranslationTo(evt, 'it');
			break;
		case 74: // 'J'
			attemptTranslationTo(evt, 'ja');
			break;
		case 75: // 'K'
			attemptTranslationTo(evt, 'ko');
			break;
		case 78: // 'N'
			attemptTranslationTo(evt, 'nl');
			break;
		case 80: // 'P'
			attemptTranslationTo(evt, 'pt-PT');
			break;
		case 82: // 'R'
			attemptTranslationTo(evt, 'ru');
			break;
		case 83: // 'S'
			attemptTranslationTo(evt, 'es');
			break;
		case 90: // 'Z'
			attemptTranslationTo(evt, 'zh');
			break;
	}
}

function attemptTranslationTo(evt, lang)
{
	if (evt.ctrlKey && evt.altKey && evt.metaKey)
	{
		phone.translateText(lang);
		evt.stopPropagation();
		evt.preventDefault();
	}
}

function __DEBUG(what)
{
	if (widget.preferenceForKey(DEBUG_KEY))
		alert(what);	
}