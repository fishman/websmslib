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
 *	2007-04-08	Portata a Konfabulator.
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

var WEBSMS_USER_AGENT = "Mozilla/5.0 (Macintosh; U; PPC Mac OS X Mach-O; it; rv:1.8.0.1) Gecko/20060111 Firefox/1.5.0.1";
// I'd rather use this but providers would go crazy
//var WEBSMS_USER_AGENT = "Mozilla/5.0 (Macintosh; U; PPC Mac OS X; it; 10.4.7) WebSMS/1.8";
var NO_CAPTCHA = -1;
var IMG_NULL = "img/null.png";
var REMINDER_INTERVAL = 20;

/* Preferences keys */
var DEBUG_KEY = "Debug";
var SMS_COUNT_KEY = "SMS sent";
var BLAMED_KEY = "Blamed";
var ALREADY_DONATED_KEY = "Already donated";
var REMIND_AFTER_KEY = "Remind after";
var DO_NOT_SAVE_KEY = "Do not save";

/* Keycodes */
var BACKSPACE_KEYCODE = 8;

var __replacements = {};

function Message() // The Model
{
	/**
	 *	Represents a Short Message
	 */

	this._properties = {
		username: "",
		password: "",
		to: "",
		from: "",
		text: ""
	};

	this.setPropertyForKey = function(value, key)
	{
		this._properties[key] = value;
	};
	this.propertyForKey = function(key)
	{
		return this._properties[key];
	};

	this.maxLength = function()
	{
		return this._maxLength;
	};
	
	this.setMaxLength = function(len)
	{
		this._maxLength = len;
	}

	this.isWellFormed = function()
	{
		// Valida il messaggio

		return true;
		// Questo potrebbe richiedere verifiche specifiche per il provider

		// Es: Vodafone permette l'invio a numeri Vodafone (ma come si verifica questo??)
		//return this._plugin.validateMessage(this._properties);

		if (!this.propertyForKey("to") ||
			!this.propertyForKey("username") ||
			!this.propertyForKey("password"))
		{
			return false;
		}
		return true;
	};

	this.toString = function()
	{
		var str = "";
		for (var property in this._properties)
		{
			str += property + ":" + this._properties[property] + "\n";
		}
		return str;
	};
}

function Widget() // The View
{
	this._toField = null;
	this._fromField = null;
	this._usernameField = null;
	this._passwordField = null;
	this._contactsList = null;
	this._availableCharsField = null;
	this._dailyAvailableSMSField = null;
	this._textField = null;
	this._frontVisible = true;
	this._front = null;
	this._back = null;
	this._fakeTop = null;
	this._fakeBottom = null;
	//this._textBezel = null;
	this._toLabel = null;
	this._sending = null;
	this._phone = null;
	this._provider = null;

	/* Captcha handling */
	this._captcha = NO_CAPTCHA;
	this._captchaPane = null;
	this._captchaImg = null;
	this._captchaTxt = null;

	this.init = function(__phone)
	{
		this._phone = __phone;

		this._toField = getObj("toField");
		this._fromField = getObj("fromField");
		this._usernameField = getObj("usernameField");
		this._passwordField = getObj("passwordField");
		this._contactsList = getObj("contactsList");
		this._availableCharsField = getObj("availableCharsField");
		this._dailyAvailableSMSField = getObj("dailyAvailableSMSField");
		
		this._textField = getObj("textField");
		this._textField.onKeyDown = function(e) { phone.updateAvailableChars(this, e); };
		this._textField.onKeyUp = function (e) { phone.update(this); };
		
		this._sending = getObj("sending");
		this._provider = getObj("providersList");

		this._front = getObj("front");
		this._back = getObj("back");
		//this._textBezel = getObj("textBezel");
		this._fakeTop = getObj("fakeTop");
		this._fakeBottom = getObj("fakeBottom");
		this._toLabel = getObj("toLabel");

		/* Captcha handling */
		this._captchaPane = getObj("captchaPane");
		this._captchaImg = getObj("captchaImg");
		this._captchaTxt = getObj("captchaTxt");
		
		/* UI Localization */		
		/*
		this._captchaTxt.setAttribute("placeholder", getLocalizedString("Digita il codice"));
		getObj("toFieldLabel").innerHTML = getLocalizedString("A:");
		getObj("fromFieldLabel").innerHTML = getLocalizedString("Firma:");
		getObj("providersListLabel").innerHTML = getLocalizedString("Gestore:");
		getObj("usernameFieldLabel").innerHTML = getLocalizedString("Username:");
		getObj("passwordFieldLabel").innerHTML = getLocalizedString("Password:");
		getObj("updateLink").title = getLocalizedString("Aggiornamento disponibile");
		getObj("reminder").innerHTML = nl2br(getLocalizedString("Questa widget è il frutto di tante notti di lavoro. Se l'avete trovata utile, considerate un contributo al suo autore. Lo aiuterete a migliorarla ancora!"));
		getObj("alreadyDonatedLabel").innerHTML = getLocalizedString("Ho già donato");

		getObj("noProxyLabel").text = getLocalizedString("Nessuno");
		getObj("proxyTypeListLabel").innerHTML = getLocalizedString("Proxy:");
		getObj("proxyHostFieldLabel").innerHTML = getLocalizedString("Host:");
		getObj("proxyPortFieldLabel").innerHTML = getLocalizedString("Porta:");
		getObj("proxyUsernameFieldLabel").innerHTML = getLocalizedString("Username:");
		getObj("proxyPasswordFieldLabel").innerHTML = getLocalizedString("Password:");
		getObj("proxyAuthListLabel").innerHTML = getLocalizedString("Autenticaz.:");
		*/
		
		//this._textField.widget = this;
		//this._textBezel.widget = this;

		/*
		createGenericButton(getObj("doneButton"),
			getLocalizedString("Fatto"),
			function()
			{
				phone.savePreferences();
				Proxy.saveSettings();
				phone.flip();
				phone.showGeneralPreferences();
			});
		createGenericButton(getObj("proxyButton"),
			getLocalizedString("Proxy"),
			function() { phone.showProxyPreferences() });
		createGenericButton(getObj("generalButton"),
			getLocalizedString("Chiamata"),
			function() { phone.showGeneralPreferences() });
		createGenericButton(getObj("donateButton"),
			getLocalizedString("Dona!"),
			function() { Utils.donate() });

		createGenericButton(getObj("laterButton"),
			getLocalizedString("Nascondi"),
			function() { phone.hideReminder() });
		createGenericButton(getObj("donateButton2"),
			getLocalizedString("Dona!"),
			function() { Utils.donate() });
		*/

		this._textField.onGainFocus = function()
		{
			//this.widget.showTextBezel();
		};
		/*
		this._textBezel.onClick = function()
		{
			//this.widget.hideTextBezel();
		};
		this._toLabel.onClick = function()
		{
			//phone.flip();
		};
		*/

		//getObj("version").innerHTML = "v" + getWidgetProperty("CFBundleVersion");
	};

	this.initWithProperties = function(phone, properties)
	{
		this.init();
		for (var property in properties)
		{
			if (this["_" + property + "Field"])
				this["_" + property + "Field"].value = properties[property];
		}
	};
	
	this.showDailyAvailableSMS = function(available)
	{
		this._dailyAvailableSMSField.innerHTML = available;
	};

	this.showMessage = function(message)
	{
		this._textField_value = this._textField.data;
		this._textField.data = message;
		this._textField.editable = false;
		this.isShowingMessage = true;
		getObj("messageConfirmLabel").opacity = 255;
	};

	this.showError = function(error)
	{
		this.showMessage(getLocalizedString("Errore:\n") + error);
	};

	this.dismissMessage = function()
	{
		this._textField.data = this._textField_value;
		getObj("messageConfirmLabel").opacity = 0;	
		this._textField.editable = true;
		this.isShowingMessage = false;
	};
	
	this.startSending = function()
	{
		this._sending.opacity = 255;
	};

	this.endSending = function()
	{
		this._sending.opacity = 0;
	};

	this.showCaptcha = function(src)
	{
		this._captchaPane.opacity = 255;
		this._captchaImg.opacity = 255;
		this._captchaTxt.opacity = 255;
		
		this._captchaImg.src = src;
		this._captchaTxt.focus();
		this.isShowingCaptcha = true;
	};
	
	this.getCaptcha = function()
	{
		phone.setCaptcha(this._captchaTxt.data);
		
		this._captchaPane.opacity = 0;
		this._captchaImg.opacity = 0;
		this._captchaTxt.opacity = 0;
	};
	
	this.setTo = function(number, nickname)
	{
		this._toLabel.data = nickname || number;
	};
	this.to = function()
	{
		return preferences.to.value;
	};

	this.setFrom = function(from)
	{
		//this._fromField.data = from;
	};
	this.from = function()
	{
		return preferences.from.value;
	};

	this.setUsername = function(number)
	{
		//this._usernameField.data = number;
	};
	this.username = function()
	{
		return preferences.username.value;
	};

	this.setPassword = function(number)
	{
		//this._passwordField.value = number;
	};
	this.password = function()
	{
		return preferences.password.value;
	};

	this.setProvider = function(provider)
	{
		return;
		// handle all the UI animation here
		for (var i = 0; i < this._provider.options.length; i++)
			if (this._provider.options[i].value == provider)
				this._provider.selectedIndex = i;
	};
	this.provider = function()
	{
		return this._provider.value;
	};

	this.setAvailableChars = function(availableChars)
	{
		this._availableCharsField.data = availableChars;
	};
	
	this.loadSkin = function(skin)
	{
		//getObj("front").className = SkinClasses[skin];
	};

}

function Phone() // The Controller
{
	this._message = null; // the message associated with this phone
	this._widget = null; // the widget associated with this phone
	this._preferences = null; // preferences for this phone instance
	this._plugin = null;
	this._provider = null;
	this._step = 0;

	this.init = function()
	{
		// Instantiate the widget
		this._widget = new Widget();
		// Set up the widget interface
		this._widget.init();

		// Load preferences and update the widget interface
		//this._preferences.load();

		var provider = preferences.provider.value;
		var from     = preferences.from.value;
		var username = preferences.username.value;
		var password = preferences.password.value;
		//var skin     = this._preferences.propertyForKey("skin");
		
		this._widget.setProvider(provider);
		this._widget.setFrom(from);
		this._widget.setUsername(username);
		this._widget.setPassword(password);
		//this._widget.loadSkin(skin);
		
		this._widget.setTo(preferences.to.value);
		
		// Update skin chooser
		//SkinChooser.updateWithSkin(skin);

		// Instantiate the message
		this._message = new Message();

		this._message.setPropertyForKey(from, "from");
		this._message.setPropertyForKey(username, "username");
		this._message.setPropertyForKey(password, "password");

		this.setProvider(provider);
		this.updateAvailableChars(this._widget._textField, null);
		
		// Check for updates
		//var checker = new VersionChecker();
		//checker.onUpdateCall(showAvailableUpdate);
		//checker.checkUpdate();
	};
	
	this.reset = function()
	{
		this._step = 0;
		phone._availableSMS = -1;
		this.setCaptcha(NO_CAPTCHA);
		this._widget._captchaTxt.data = "";
		this._widget._captchaImg.src = IMG_NULL;
		this._widget.isShowingCaptcha = false;
		this._widget.endSending();
	};
	
	this.showGeneralPreferences = function()
	{
		getObj("proxyPreferences").style.display = "none";
		getObj("generalButton").style.display = "none";

		getObj("generalPreferences").style.display = "block";
		getObj("proxyButton").style.display = "block";
		getObj("donateButton").style.display = "block";
	};

	this.showProxyPreferences = function()
	{
		getObj("proxyPreferences").style.display = "block";
		getObj("generalButton").style.display = "block";

		getObj("generalPreferences").style.display = "none";
		getObj("proxyButton").style.display = "none";
		getObj("donateButton").style.display = "none";
	};
	
	this.saveMessage = function()
	{
		return;
		if (preferences.doNotSave)
			return;
		var out = getLocalizedString("A:") + " " + this._message._properties["to"] + "\r" +
			getLocalizedString("Data:") + " " + new Date(this._session_id).toString() + "\r" +
			this._message._properties["text"] + " " +
			this._message._properties["from"];
		widget.system("bin/save_message.sh " + this._plugin.name + " " +
			this._session_id + '.txt "' +
			addslashes(out) + '"', null);
	};
	
	this.increaseSMSCounter = function()
	{
		var count = preferences.SMSCount.value;
		if (!count) count = 0;
		
		preferences.SMSCount.value = ++count;
		__DEBUG("Sent " + count + " messages");
		
		if (!preferences.alreadyDonated.value)
		{
			var amt = preferences.remindAfter.value;
			if (!amt) amt = REMINDER_INTERVAL;
			
			__DEBUG("Remind after " + amt + " messages");
			if (count > amt)
			{
				this.showReminder();
				preferences.remindAfter.value = parseInt(amt) + REMINDER_INTERVAL;
			}
		}
		savePreferences();
	};

	this.loadPreferences = function()
	{
		this._preferences.load();

		this._widget.setFrom(this._preferences.propertyForKey("from"));
		this._widget.setUsername(this._preferences.propertyForKey("username"));
		this._widget.setPassword(this._preferences.propertyForKey("password"));
	};

	this.savePreferences = function()
	{
		this._preferences.setProvider(this._widget.provider());
		this._preferences.setPropertyForKey(this._widget.from(), "from");
		this._preferences.setPropertyForKey(this._widget.username(), "username");
		this._preferences.setPropertyForKey(this._widget.password(), "password");

		this._preferences.save();
	};

	this.showReminder = function()
	{
		getObj("reminderPane").style.display = "block";
		getObj("preferencesPane").style.display = "none";
	};
	
	this.hideReminder = function()
	{
		//widget.setPreferenceForKey(getObj("alreadyDonated").checked, ALREADY_DONATED_KEY);
		getObj("reminderPane").style.display = "none";
		getObj("preferencesPane").style.display = "block";
	};

	this.clearPreferences = function()
	{
		this._preferences.clear();
	};

	this.setProvider = function(provider)
	{
		provider = preferences.provider.value;
		__DEBUG(provider);
		
		for (var plugin in Plugins)
		{
			__DEBUG(plugin);
			
			if (Plugins[plugin].name == provider)
			{
				this._provider = provider;
				this._plugin = Plugins[provider];
				this._message.setMaxLength(this._plugin.max_message_length);
			}
		}		
	}

	this.showDailyAvailableSMS = function(avail)
	{
		// Not yet implemented
		//this._widget.showDailyAvailableSMS(avail || "");
	};

	this.setCaptcha = function(code)
	{
		this._widget._captcha = code;
	};

	this.captcha = function()
	{
		return this._widget._captcha;
	};
	
	this.sendMessage = function()
	{
		if (this._message.isWellFormed())
		{
			this._session_id = new Date().getTime();
			this._widget.startSending();
			this.send();
		}
		else
		{
			this._widget.showError(getLocalizedString("Introdurre destinatario, username e password"));
		}
	};
	
	this.send = function()
	{
		var command;

		this._replacements = {"%USERNAME%": preferences.username.value,//this._message._properties["username"],
			"%PASSWORD%": preferences.password.value, //this._message._properties["password"],
			"%FROM%": preferences.from.value, //escape(this._message._properties["from"]),
			"%E_FROM%": escape(escape(preferences.from.value)),
			"%TO%": Utils.trimNumber(preferences.to.value),
			"%TEXT%": escape(getObj("textField").data),
			"%E_TEXT%": escape(escape(getObj("textField").data)),
			"%TO_PREFIX%": Utils.trimNumber(preferences.to.value).substr(0, 3),
			"%TO_NUMBER%": Utils.trimNumber(preferences.to.value).substr(3),
			"%CAPTCHA%": this.captcha()};

		//__DEBUG("step:"+this._step);

		command =					  'curl ' + this._plugin.steps[this._step].flags +
		(this._plugin.steps[this._step].data ? ' -d "' + Utils.batchReplacePlaceholdersReplacements(this._plugin.steps[this._step].data, this._replacements) + '"' : '') +
									  ' -e "' + Utils.batchReplacePlaceholdersReplacements(this._plugin.steps[this._step].referrer, this._replacements) + '"' +
					(this._step > 0 ? ' -b "' + system.widgetDataFolder + '/websms.' + this._plugin.name + '.cookie.' + this._step + '.txt"' : '') +
									  ' -c "' + system.widgetDataFolder + '/websms.' + this._plugin.name + '.cookie.' + (this._step + 1) + '.txt"' +
									  ' -A "' + WEBSMS_USER_AGENT + '"' +
		/* Proxy section */
		(Proxy.inUse() ?
									 (' --' + Proxy.proxyType + ' ' + Proxy.proxyHost + ':' + Proxy.proxyPort +
			((Proxy.proxyUsername &&
			  Proxy.proxyPassword) ? (' --proxy-' + Proxy.proxyAuth + ' --proxy-user ' + Proxy.proxyUsername + ':' + Proxy.proxyPassword) :
									  '')) :
									  "") +
									  ' "' + Utils.batchReplacePlaceholdersReplacements(this._plugin.steps[this._step].action, this._replacements) + '"' +
//									  " | iconv -f iso-8859-1 -t utf-8" +
									  "";
		//__DEBUG(command);
		this._response = runCommand(command);
		//__DEBUG(this._response);

		try
		{
			if (typeof (this._response) != "undefined")
			{
				if (this._plugin.steps[this._step].check)
				{
					var check = this._plugin.steps[this._step].check;
					for (var j = 0; j < check.length; j++)
					{
						if (check[j].match.test(this._response))
						{
							this.reset();
							this._widget.showError(check[j].reason);
							return;
						}
					}
				}

				if (this._plugin.steps[this._step].vars)
				{
					var vars = this._plugin.steps[this._step].vars;
					for (var j = 0; j < vars.length; j++)
					{
						if (vars[j].match.test(this._response))
						{
							eval(vars[j].name + " = '" + RegExp.$1 + "'");

							__DEBUG("Set " + vars[j].name + " = '" + RegExp.$1 + "'");

							__replacements["%" + vars[j].name + "%"] = vars[j].escape ?
								escape(eval(vars[j].name)) :
								eval(vars[j].name);
						}
					}
				}
			
				if (this._plugin.steps[this._step].availabilityCheck)
				{
					var avail = this._plugin.steps[this._step].availabilityCheck(this._response);
					__DEBUG("You have " + avail + " messages left");
					this._availableSMS = avail;
				}
				
				// If the current step requires a Captcha to be read,
				// prompt the user and get out of this function.
				// The user will resume the sending by entering the text.
				if (this._plugin.steps[this._step].captcha &&
					(this.captcha() == NO_CAPTCHA))
				{
					command =					  'curl ' + this._plugin.steps[this._step].flags +
												  ' -e "' + Utils.batchReplacePlaceholdersReplacements(this._plugin.steps[this._step].action, this._placeholders, this._replacements) + '"' +
								(this._step > 0 ? ' -b "' + system.widgetDataFolder + '/websms.' + this._plugin.name + '.cookie.' + (this._step + 1) + '.txt"' : '') +
												  ' -c "' + system.widgetDataFolder + '/websms.' + this._plugin.name + '.cookie.' + (this._step + 1) + '.txt"' +
												  ' -A "' + WEBSMS_USER_AGENT + '"' +

					/* Proxy section */
					(Proxy.inUse() ?
												 (' --' + Proxy.proxyType + ' ' + Proxy.proxyHost + ':' + Proxy.proxyPort +
						((Proxy.proxyUsername &&
						  Proxy.proxyPassword) ? (' --proxy-' + Proxy.proxyAuth + ' --proxy-user ' + Proxy.proxyUsername + ':' + Proxy.proxyPassword) :
												  '')) :
												  "") +
												  ' "' + Utils.batchReplacePlaceholdersReplacements(this._plugin.steps[this._step].captcha, this._placeholders, this._replacements, true) + '"' +
												  ' -o "' + system.widgetDataFolder + '/websms.' + this._plugin.name + '.captcha.' + this._session_id + '"' +
												  "";
					//__DEBUG(command);
					this._response = runCommand(command);
					//__DEBUG(this._response);
					this._widget.showCaptcha(system.widgetDataFolder + "/websms." + this._plugin.name + ".captcha." + this._session_id);
					//__DEBUG("Showing captcha: " + system.widgetDataFolder + "/websms." + this._plugin.name + ".captcha." + this._session_id);
					++this._step;
					return;
					// Argh, my Software Engineering professor would kick my ass for this :/
				}
			}
			else
			{
				__DEBUG("undefined response");
				// If proxy is in use, it may be incorrect
				if (Proxy.inUse())
				{
					this.reset();
					this._widget.showError(getLocalizedString("Bad proxy"));
					return;
				}
			}
		}
		catch (e)
		{
			// Go on til the end
			alert("***Exception***: " + e);
		}
		
		if (++this._step < this._plugin.steps.length)
		{
			phone.send();
		}
		else
		{
			if (this._response.indexOf(this._plugin.success_marker) != -1)
			{
				this._widget.showMessage(getLocalizedString("Messaggio inviato!") +
					(this._availableSMS > 0 ?
						getLocalizedString(" (%d disponibili)").replace("%d", this._availableSMS) : ""));

				this.saveMessage();
				this.increaseSMSCounter();
			}
			else
			{
				this._widget.showError(getLocalizedString("Invio fallito!"));
			}
			this.reset();
		}

	};

	this.update = function(sender)
	{
		this._message.setPropertyForKey(sender.data,
			sender.id.substring(0, sender.id.indexOf("Field")));
	};

	this.updateProxy = function(sender)
	{
		this.setPropertyForKey(sender.data,
			sender.id.substring(0, sender.id.indexOf("Field")));
	};

	this.updateAvailableChars = function(sender, event)
	{
		var code = system.event.charCode;

		var available = this._message.maxLength()	// provider max length
			- sender.data.length					// message text
			- phone._widget.from().length;			// signature length
			
		if (available < 1)
		{
			switch (code)
			{
				case 8:  // <x
				case 37: // <
				case 38: // ^
				case 39: // >
				case 40: // v
				case 49: // x>
				case 82: // r
					break;
				default:
					event.stopPropagation();
					event.preventDefault();
			}
		}
		this._widget.setAvailableChars(available);
	};

	this.updateProvider = function(sender)
	{
		// Notify the provider change to preferences
		this._preferences.setProvider(sender.value);

		// Reload preferences
		this._preferences.load();

		// Retrieve username and password for the new provider
		var username = this._preferences.propertyForKey("username");
		var password = this._preferences.propertyForKey("password");
		
		// Notify the provider change to the widget
		this._widget.setUsername(username);
		this._widget.setPassword(password);

		// Notify the provider change to the message
		this._message.setPropertyForKey(username, "username");
		this._message.setPropertyForKey(password, "password");

		this.setProvider(sender.value);
	};
	
	this.setSkin = function(skin)
	{
		this._preferences.setPropertyForKey(skin, "skin");
		this._widget.loadSkin(skin);
	};

	this.setToFromList = function(list)
	{
		var to = Utils.trimNumber(list.value);
		// Update view...
		this._widget.setTo(to, Utils.nicknameFromString(list.options[list.selectedIndex].text));
		// ...and model
		this._message.setPropertyForKey(to, "to");
	};

	this.action = function()
	{
		if (!preferences.blamed.value)
		{
			if (preferences.SMSCount.value > 50)
			{
				preferences.blamed.value = true;
				Utils.blame();
				return;
			}
		}
		
		if (this._widget.isShowingMessage)
		{
			this._widget.dismissMessage();
		}
		else if (this._widget.isShowingCaptcha)
		{
			this._widget.getCaptcha();
			this.sendMessage();
		}
		else
		{
			this.sendMessage();
		}
	}
}

function Preferences()
{
	/**
	 *	Preferences hold information for current provider only.
	 *
	 *	A change of provider requires preferences to be reloaded.
	 */

	this._providerSpecific = {
		username: "",
		password: ""
	};

	this._globals = {
		from: ""
	};

	this._instanceSpecific = {
		skin: "blue"
	};

	this.dictionary = function()
	{
		return this._dictionary;
	};

	this.load = function()
	{
		/**
		 *	Loads preferences for this instance from user defaults
		 */

		this._provider = preferences.provider;

		var value;

		/*
		for (var property in this._globals)
		{
			value = widget.preferenceForKey(property);
			this._globals[property] = (value) ? value : "";
		}
		for (var property in this._instanceSpecific)
		{
			value = widget.preferenceForKey(widget.identifier + ":" + property);
			if (value)
				this._instanceSpecific[property] = value;
		}
		for (var property in this._providerSpecific)
		{
			value = widget.preferenceForKey(this._provider + ":" + property);
			if (property == "password")
				value = Utils.rot13(value);
			this._providerSpecific[property] = (value) ? value : "";
		}
		*/
	};

	this.save = function()
	{
		/**
		 *	Saves preferences for this instance to user defaults
		 */

		var value;

		for (var property in this._globals)
		{
			value = (this._globals[property]) ? this._globals[property] : null;
			widget.setPreferenceForKey(value, property);
		}
		for (var property in this._instanceSpecific)
		{
			value = (this._instanceSpecific[property]) ? this._instanceSpecific[property] : null;
			widget.setPreferenceForKey(value, widget.identifier + ":" + property);
		}
		for (var property in this._providerSpecific)
		{
			value = (this._providerSpecific[property]) ? this._providerSpecific[property] : null;
			if (property == "password")
			{
				value = Utils.rot13(value);
			}
			widget.setPreferenceForKey(value, this._provider + ":" + property);
		}
		widget.setPreferenceForKey(this._provider, widget.identifier + ":provider");
	};

	this.clear = function()
	{
		for (var property in this._instanceSpecific)
		{
			widget.setPreferenceForKey(null, widget.identifier + ":" + property);
		}
		widget.setPreferenceForKey(null, widget.identifier + ":provider");
	};

	this.clearAll = function()
	{
		for (var property in this._globals)
		{
			widget.setPreferenceForKey(null, property);
		}
		for (var property in this._providerSpecific)
		{
			widget.setPreferenceForKey(null, this._provider + ":" + property);
		}
		this.clear();
	};

	this.propertyForKey = function(propertyName)
	{
		return (this._globals[propertyName]) ?
			this._globals[propertyName] :
			(this._providerSpecific[propertyName]) ?
				this._providerSpecific[propertyName] :
				this._instanceSpecific[propertyName];
	};

	this.setPropertyForKey = function(property, propertyName)
	{
		if (this._globals[propertyName] !== undefined)
			this._globals[propertyName] = property;
		else if (this._providerSpecific[propertyName] !== undefined)
			this._providerSpecific[propertyName] = property;
		else
			this._instanceSpecific[propertyName] = property;
	};

	this.setProvider = function(provider)
	{
		this._provider = provider;
		widget.setPreferenceForKey(this._provider, widget.identifier + ":provider");
	};

	this.provider = function()
	{
		return this._provider;
	};
}

var Proxy = {
	inUse: function()
	{
		return preferences.proxyType.value != 'none';
	}
};

var AddressBook = {
	load: function()
	{
		return;
		// Loads addresses from the plugin
		if (ABPlugin) {
			ABPlugin.loadContacts();
			var count = ABPlugin.count();
			var list = getObj("contactsList");
			for (var i = 0; i < count; i++)
			{
				list.options[i] = new Option(ABPlugin.contactForIndex(i), ABPlugin.numberForIndex(i));
			}
		}
		else {
			alert("Widget plugin not loaded.");
		}
	}
}

var Plugins = {
};

var phone = null;

function setup()
{
	phone = new Phone();
	phone.init();

	//widget.onremove = function() { phone.clearPreferences() };

	AddressBook.load();
	//Proxy.loadSettings();
	
	//document.addEventListener("keydown", _onkeydown, true);
	
	widget.onPreferencesChanged = function() {
		phone._widget.setTo(preferences.to.value);
	};
}

var Utils = {

/**
 *	Utility class to hold handy functions
 */

	striptags: function(text)
	{
		// Removes tags from 
		var p = 0, q = 0, r = 0, b = '';
		while (p < text.length)
		{
			p = text.indexOf('<', r);
			if (p != -1)
			{
				b += text.substring(r, p);
				q = text.indexOf('>', p);
				if (q != -1)
				{
					r = q + 1;
				}
			}
			else
			{
				b += text.substring(r);
				break;
			}
		}
		return b;
	},
	nicknameFromString: function(str)
	{
		var terms = str.substr(0, str.indexOf(" (")).split(" ");
		return terms[terms.length - 1];
	},
	batchReplacePlaceholdersReplacements: function(str, replacements)
	{
		// Substitute given placeholders with replacements
		for (var i in replacements)
		{
			str = str.replace(new RegExp(i, "g"), replacements[i]);
		}
		// Substitute common placeholders with replacements
		for (var i in __replacements)
		{
			str = str.replace(new RegExp(i, "g"), __replacements[i]);
		}
		return str;
	},
	rot13: function(str)
	{
		if (!str) return "";
		var rot13str = "";
		var middle = "n".charCodeAt(0);
		var chr, cod;
		for (var i = 0; i < str.length; i++)
		{
			chr = str.charAt(i).toLowerCase();
			cod = str.charCodeAt(i)
			if ('a' <= chr && chr <= 'z')
				cod += (chr < 'n') ? 13 : -13;
			rot13str += String.fromCharCode(cod);
		}
		return rot13str;
	},
	trimNumber: function(number)
	{
		// Remove spaces
		number = number.replace(/[\s\(\)\-]/g, "");

		// Remove international prefixes
		if (number.indexOf("+") == 0)
		{
			// Removes only 2-cypher prefixes :(
			number = number.substring(3);
		}
		return number;
	},
	emeLodge: function()
	{
		openURL("http://www.emeraldion.it");
	},
	home: function()
	{
		openURL("http://www.emeraldion.it/software/widgets/websms/");
	},
	help: function()
	{
		openURL("http://www.emeraldion.it/software/widgets/websms/instructions/");
	},
	donate: function()
	{
		openURL("http://www.emeraldion.it/software/widgets/websms/donate/");
	},
	blame: function()
	{
		openURL("http://www.emeraldion.it/pages/10,-100,-1000-sms/");
	}
}


var flipShown = false,
	animation = {duration:0, starttime:0, to:1.0, now:0.0, from:0.0, firstElement:null, secondElement:null, timer:null};


function animate() { // shows a glowing effect
	var T;
	var ease;
	var time = (new Date).getTime();


	T = clampTo(time-animation.starttime, 0, animation.duration);

	if (T >= animation.duration) {
		clearInterval (animation.timer);
		animation.timer = null;
		animation.now = animation.to;
	}
	else {
		ease = 0.5 - (0.5 * Math.cos(Math.PI * T / animation.duration));
		animation.now = computeNextFloat (animation.from, animation.to, ease);
	}

	animation.firstElement.style.opacity = animation.now;
	animation.secondElement.style.opacity = animation.now;
}

function mousemove (event) {
	if (!flipShown) {
		if (animation.timer != null) {
			clearInterval (animation.timer);
			animation.timer  = null;
		}

		var starttime = (new Date).getTime() - 13;

		animation.duration = 500;
		animation.starttime = starttime;
		animation.firstElement = getObj("flip");
		animation.secondElement = getObj("huh");
		animation.timer = setInterval ("animate();", 13);
		animation.from = animation.now;
		animation.to = 1.0;
		animate();
		flipShown = true;
	}
}

function mouseexit (event) {
	if (flipShown) {
		// fade in the info button
		if (animation.timer != null) {
			clearInterval (animation.timer);
			animation.timer  = null;
		}

		var starttime = (new Date).getTime() - 13;

		animation.duration = 500;
		animation.starttime = starttime;
		animation.firstElement = getObj("flip");
		animation.secondElement = getObj("huh");
		animation.timer = setInterval ("animate();", 13);
		animation.from = animation.now;
		animation.to = 0.0;
		animate();
		flipShown = false;
	}
}

function clampTo(value, min, max) { // constrains a value between two limits
	return value < min ? min : value > max ? max : value;
}

function computeNextFloat (from, to, ease) { // self explaining
	return from + (to - from) * ease;
}

function nl2br(txt)
{
	return txt.replace(/\n/g, "<br />");
}

function addslashes(txt)
{
	return txt.replace(/"/g, "\\\"").replace(/'/g, "\'");
}

function _onkeydown(evt)
{
	switch (evt.keyCode)
	{
		case BACKSPACE_KEYCODE:
			if (evt.metaKey &&
				!phone._widget.isShowingMessage)
			{
				phone._widget._textField.value = "";
				phone.updateAvailableChars(phone._widget._textField, null);
				evt.stopPropagation();
				evt.preventDefault();
			}
			break;
	}
}

function getLocalizedString (key) {
	try {
		var ret = localizedStrings[key];
		if (ret === undefined)
			ret = key;
		return ret;
	}
	catch (ex) {
	}
	return key;
}

function showAvailableUpdate(available, item, latest)
{
	if (available)
		getObj("updateAvailable").style.visibility = "visible";
}

function __DEBUG(what)
{
	log(what);	
}

function getObj(id)
{
	return widget.getElementById(id);
}