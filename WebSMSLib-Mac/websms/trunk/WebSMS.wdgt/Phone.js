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

/**
 *	Phone Controller object
 */

function Phone()
{
	this._message = null; // the message associated with this phone
	this._widget = null; // the widget associated with this phone
	this._preferences = null; // preferences for this phone instance
	this._plugin = null;
	this._provider = null;
	this._step = 0;
	this._preferencePane = null;
	this._canSwapPreferencePanes = true;
	this._shouldAbortSending = false;
	this._engine = null;

	return this;
}

/**
 *	@method init
 *	@abstract Initializes the receiver.
 */
Phone.prototype.init = function()
{
	// Instantiate preferences
	this._preferences = new Preferences();

	// Instantiate the widget
	this._widget = new Widget();
	// Set up the widget interface
	this._widget.init(this);
	this._preferencePane = document.getElementById("generalPreferences");

	// Set preference defaults
	this._preferences.registerDefaults({
		"provider": "tim",
		"from": "",
		"username": "",
		"password": "",
		"skin": "blue"
	});
	
	// Load preferences
	this._preferences.load();

	var provider = this._preferences.preferenceForKey("provider");
	var from     = this._preferences.preferenceForKey("from");
	var username = this._preferences.preferenceForKey("username");
	var password = this._preferences.preferenceForKey("password");
	var skin     = this._preferences.preferenceForKey("skin");
	
	this._widget.setProvider(provider);
	this._widget.setFrom(from);
	this._widget.setUsername(username);
	this._widget.setPassword(password);
	this._widget.loadSkin(skin);

	// Update skin chooser
	SkinChooser.updateWithSkin(skin);

	// Instantiate the message
	this._message = new Message();

	this._message.setPropertyForKey(from, "from");
	this._message.setPropertyForKey(username, "username");
	this._message.setPropertyForKey(password, "password");

	this.setProvider(provider);
	this.updateAvailableChars(this._widget._textField, null);

	// Check for updates
	var checker = new VersionChecker();
	checker.didFetchLatestVersion = function(updateAvailable, name, latestVersion)
	{
		phone._widget.showAvailableUpdate(updateAvailable, name, latestVersion);
	};
	checker.checkUpdate();
	
	// Sparkle appcast
	/*
	var sparkleUpdater = new SparkleUpdater();
	sparkleUpdater.setDelegate(this);
	sparkleUpdater.checkUpdate();
	*/
};

/**
 *	@method abortSending
 *	@abstract Requests the receiver to interrupt the sending under way.
 */
Phone.prototype.abortSending = function()
{
	if (this._engine)
	{
		this._engine.abort();
	}
	this.reset();
};

/**
 *	@method reset
 *	@abstract Resets the receiver.
 */
Phone.prototype.reset = function()
{
	// Reset phone params
	this._step = 0;
	phone._availableSMS = -1;

	// Reset captcha
	this.setCaptcha(NO_CAPTCHA);
	this._widget._captchaTxt.value = "";
	this._widget._captchaImg.src = IMG_NULL;
	this._widget.isShowingCaptcha = false;
	this._widget.hideCaptcha();
	
	if (this._engine)
	{
		this._engine.reset();
	}
	
	// Remove sending icon
	this._widget.endSending();
};

/**
 *	@method saveMessage
 *	@abstract Saves the message to disk, unless configured otherwise.
 */
Phone.prototype.saveMessage = function()
{
	if (widget.preferenceForKey(DO_NOT_SAVE_KEY))
		return;
	this._message.save(this._plugin.name, this._session_id);
};

/**
 *	@method increaseSMSCounter
 *	@abstract Increments the counter of SMS messages that have been sent.
 */
Phone.prototype.increaseSMSCounter = function()
{
	var count = widget.preferenceForKey(SMS_COUNT_KEY);
	if (!count) count = 0;

	widget.setPreferenceForKey(++count, SMS_COUNT_KEY);
};

/**
 *	@method showPreferencePane
 *	@abstract Shows the preference pane <tt>tab</tt>.
 *	@param tab The preference pane that should be brought into view.
 *	@param preflight A callback function called before the animation starts.
 *	@param postflight A callback function called after the animation starts.
 */
Phone.prototype.showPreferencePane = function(tab, preflight, postflight)
{
	var paneId = tab.id.substring(0, tab.id.indexOf("Tab"));
	var prefPaneTabs = document.getElementById("preferences-tabbar").childNodes;

	for (var i = 0; i < prefPaneTabs.length; i++)
	{
		if (prefPaneTabs[i].nodeType == 1)
		{
			prefPaneTabs[i].className = (prefPaneTabs[i] == tab) ? 
				"preference-tab-selected" : "preference-tab";
		}
	}

	var prefPanes = document.getElementById("preferencesPane").childNodes;
	var paneToCome = null;
	for (var i = 0; i < prefPanes.length; i++)
	{
		if (prefPanes[i].nodeType == 1)
		{
			if (prefPanes[i].id == paneId) paneToCome = prefPanes[i];
		}
	}
	if (this._canSwapPreferencePanes &&
		this._preferencePane != paneToCome)
	{
		new CrossBlinds({
				elements:
				{
					first: this._preferencePane,
					second: paneToCome
				},
				width: 186,
				preflight: function()
				{
					phone._canSwapPreferencePanes = false;
					if (preflight)
						preflight();
				},
				postflight: function()
				{
					phone._preferencePane = paneToCome;
					phone._canSwapPreferencePanes = true;
					if (postflight)
						postflight();
				}
			}).run();
	}
	else
	{
		// Call immediately
		if (preflight)
			preflight();
		if (postflight)
			postflight();			
	}
};

/**
 *	@method loadPreferences
 *	@abstract Loads preferences from disk and sets message properties.
 */
Phone.prototype.loadPreferences = function()
{
	this._preferences.load();

	this._widget.setFrom(this._preferences.preferenceForKey("from"));
	this._widget.setUsername(this._preferences.preferenceForKey("username"));
	this._widget.setPassword(this._preferences.preferenceForKey("password"));
};

/**
 *	@method savePreferences
 *	@abstract Saves preferences to disk.
 */
Phone.prototype.savePreferences = function()
{
	this._preferences.setPreferenceForKey(this._widget.provider(), "provider");
	this._preferences.setPreferenceForKey(this._widget.from(), "from");
	this._preferences.setPreferenceForKey(this._widget.username(), "username");
	this._preferences.setPreferenceForKey(this._widget.password(), "password");

	this._preferences.save();
};

/**
 *	@method clearPreferences
 *	@abstract Clears saved preferences.
 */
Phone.prototype.clearPreferences = function()
{
	this._preferences.clear();
};

/**
 *	@method setProvider
 *	@abstract Sets the provider.
 *	@param provider The provider.
 */
Phone.prototype.setProvider = function(provider)
{
	this._provider = provider;
	this._plugin = Plugins[provider];
	this._message.setMaxLength(this._plugin.max_message_length || 999);
	// Populate plugin specific parameters pane
	PluginManager.populatePluginParametersPane(provider);
}

/**
 *	@method showDailyAvailableSMS
 *	@abstract Shows the number of available messages for today.
 *	@param avail The number of available messages for today.
 */
Phone.prototype.showDailyAvailableSMS = function(avail)
{
	// Not yet implemented
	//this._widget.showDailyAvailableSMS(avail || "");
};

/**
 *	@method setCaptcha
 *	@abstract Sets the captcha code entered by the user.
 *	@param code The code entered by the user.
 */
Phone.prototype.setCaptcha = function(code)
{
	if (this._engine)
	{
		this._engine.setCaptchaCode(code);
	}
};

/**
 *	@method refreshCaptcha
 *	@abstract Requests the refresh of the Captcha image.
 */
Phone.prototype.refreshCaptcha = function()
{
	this._engine.refreshCaptcha();
};

/**
 *	@method sendMessage
 *	@abstract Sends the current message.
 */
Phone.prototype.sendMessage = function()
{
	this._shouldAbortSending = false;
	if (this._message.isWellFormed())
	{
		this._widget.startSending();
		this._session_id = new Date().getTime();
		// Lazy initialization
		if (!this._engine)
		{
			this._engine = new WebSMSEngine();
			// Set myself as delegate
			this._engine.setDelegate(this);
			// Set plugin
			this._engine.setPlugin(this._plugin);
		}
		// Store trimmed recipient number in a variable since we are using it a lot later
		var to_trimmed = Utils.trimNumber(this._message.propertyForKey("to"));
		// Fill replacements dictionary
		this._engine.setReplacements({"%USERNAME%": this._message.propertyForKey("username"),
			"%PASSWORD%": this._message.propertyForKey("password"),
			"%FROM%": URL.encodeWithCharset(this._message.propertyForKey("from"), this._plugin.charset),
			"%E_FROM%": URL.encodeWithCharset(URL.encodeWithCharset(this._message.propertyForKey("from"), this._plugin.charset), this._plugin.charset),
			"%CCODE%": CountryCode.ownCode,
			"%TO%": to_trimmed,
			"%TEXT%": URL.encodeWithCharset(this._message.propertyForKey("text"), this._plugin.charset),
			"%E_TEXT%": URL.encodeWithCharset(URL.encodeWithCharset(this._message.propertyForKey("text"), this._plugin.charset), this._plugin.charset),
			"%U_TEXT%": this._message.propertyForKey("text"),
			"%U_FROM%": this._message.propertyForKey("from"),
			"%TO_PREFIX%": to_trimmed.substr(0, 3),
			"%TO_NUMBER%": to_trimmed.substr(3),
			"%TO_US_AREACODE%": to_trimmed.substr(0, 3),
			"%TO_US_PREFIX%": to_trimmed.substr(3, 3),
			"%TO_US_NUMBER%": to_trimmed.substr(6),
			"%TO_CCODE%": CountryCode.forNumber(this._message.propertyForKey("to"))});
		// Send
		this._performSending();
	}
	else
	{
		this._widget.showError(getLocalizedString("Enter recipient, username and password"));
	}
};

/**
 *	@method _performSending
 *	@abstract Performs the sending of the message.
 *	@discussion This method actually invokes the <tt>send</tt> method in <tt>WebSMSEngine</tt>.
 */
Phone.prototype._performSending = function()
{
	// Send request
	this._engine.send();
};

/**
 *	@method update
 *	@abstract Updates the message property bound to <tt>sender</tt>.
 *	@param sender The field containing the value to update.
 */
Phone.prototype.update = function(sender)
{
	this._message.setPropertyForKey(sender.value,
									sender.id.substring(0, sender.id.indexOf("Field")));
};

/**
 *	@method updateProxy
 *	@abstract Updates the proxy property bound to <tt>sender</tt>.
 *	@param sender The field containing the value to update.
 */
Phone.prototype.updateProxy = function(sender)
{
	this.setPropertyForKey(sender.value,
									sender.id.substring(0, sender.id.indexOf("Field")));
};

/**
 *	@method updateAvailableChars
 *	@abstract Updates the available characters count for the message according
 *	to current plugin settings.
 *	@param sender The field containing the message text.
 *	@param event The event triggered by the alteration of <tt>sender</tt>.
 */
Phone.prototype.updateAvailableChars = function(sender, event)
{
	var available = this._message.maxLength()	// provider max length
		- sender.value.length					// message text
		- phone._widget.from().length;			// signature length
	if (available < 1)
	{
		if (event)
		{
			switch (event.keyCode)
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
	}
	this._widget.setAvailableChars(available);
};

/**
 *	@method updateProvider
 *	@abstract Updates the provider setting for the receiver.
 *	@param sender The field containing the new provider.
 */
Phone.prototype.updateProvider = function(sender)
{
	// Abort if sending
	this.abortSending();
	
	// Dispose engine
	this._engine = null;
	
	// Notify the provider change to preferences
	this._preferences.setPreferenceForKey(sender.value, "provider");
	
	// Retrieve username and password for the new provider
	var username = this._preferences.preferenceForKey("username");
	var password = this._preferences.preferenceForKey("password");

	// Notify the provider change to the widget
	this._widget.setUsername(username);
	this._widget.setPassword(password);

	// Notify the provider change to the message
	this._message.setPropertyForKey(username, "username");
	this._message.setPropertyForKey(password, "password");

	this.setProvider(sender.value);
};

/**
 *	@method setSkin
 *	@abstract Sets the skin of the receiver.
 *	@param skin The name of the skin.
 */
Phone.prototype.setSkin = function(skin)
{
	this._preferences.setPreferenceForKey(skin, "skin");
	this._widget.loadSkin(skin);
};

/**
 *	@method flip
 *	@abstract Flips the receiver.
 *	@discussion This method causes the Widget to be flipped to the opposite side.
 */
Phone.prototype.flip = function()
{
	this._widget.flip();
};

/**
 *	@method updateToFromField
 *	@abstract Updates the value of the recipient of the message to the value of <tt>field</tt>.
 *	@param field The field containing the recipient.
 */
Phone.prototype.updateToFromField = function(field)
{
	var list = this._widget._contactsList;
	this._widget.setTo(field.value, field.value);
	for (var i = 0; i < list.options.length; i++)
	{
		if (list.options[i].value == field.value)
		{
			list.options[i].selected = list.options[i].value == field.value;
			this._widget.setTo(field.value, Utils.nicknameFromString(list.options[i].text));
		}
	}
	this.update(field);	
};

/**
 *	@method setToFromList
 *	@abstract Updates the value of the recipient of the message to the value of <tt>list</tt>.
 *	@param list The list containing the recipient.
 */
Phone.prototype.setToFromList = function(list)
{
	var to = list.value;
	// Update view...
	this._widget.setTo(to, Utils.nicknameFromString(list.options[list.selectedIndex].text));
	// ...and model
	this._message.setPropertyForKey(to, "to");
};

/**
 *	@method action
 *	@abstract Triggers the most appropriate action for the phone.
 *	@discussion This method is called when pressing the main button.
 *	Its effect depends on the particular state of the Phone while the
 *	button has been pressed.
 *	- While composing the message, it triggers the sending.
 *	- While showing a Captcha image, it captures the code and resumes the sending.
 *	- While showing an informational or error message, it dismisses it.
 *	- While sending the message, it aborts the sending.
 */
Phone.prototype.action = function()
{
	if (this._widget.isShowingMessage)
	{
		this._widget.dismissMessage();
	}
	else if (this._widget.isShowingCaptcha)
	{
		this.setCaptcha(this._widget.getCaptcha());
		this._widget.setCaptcha(NO_CAPTCHA);
		this._widget.hideCaptcha();
		this._performSending();
	}
	else if (this._widget.isSendingMessage)
	{
		this.abortSending();
	}
	else
	{
		this.sendMessage();
	}
};

/**
 *	@method translateText
 *	@abstract Translates the message to the desired language.
 *	@discussion This method translates the message to the desired language
 *	using the Google Ajax Language API <tt>google.language.translate</tt>.
 *	The language of the message is automatically guessed using the API
 *	<tt>google.language.detect</tt>.
 *	@param theLang The desired language.
 */
Phone.prototype.translateText = function(toLang)
{
	// Get current SMS text
	var text = phone._widget.getText();
	// Try to guess the language it is written in
	google.language.detect(text,
		function(result)
		{
			// Check if language is known
			if (result.language != google.language.Languages['UNKNOWN'])
			{
				// Translate the text to the desired language
				google.language.translate(text, result.language, toLang, function(result)
				{
					// If translation has been successful
					if (result.translation)
					{
						// Replace the SMS text with translation
						phone._widget.setText(result.translation);
					}
				});
			}
		});
};

/**
 *	SparkleUpdater delegate protocol
 */

/**
 *	@method sparkleUpdateAvailable
 *	@abstract Called by SparkleUpdater when an update has been detected.
 *	@discussion The Phone object simply passes <tt>dict</tt> to the Widget's
 *	method that shows to the user that there's an update available.
 *	@param dict A dictionary of key-value pairs with relevant update info.
 */
Phone.prototype.sparkleUpdateAvailable = function(dict)
{
	this._widget.showSparklePane(dict);
};

/**
 *	WebSMSEngine delegate protocol
 */

/**
 *	@method sendingSucceeded
 *	@abstract Called by WebSMSEngine when the sending has been successful.
 *	@discussion The Phone shows the number of remaining messages that the user can send
 *	(if available), saves the message to disk, increases the all-time counter of
 *	messages sent, and resets itself to the initial state.
 */
Phone.prototype.sendingSucceeded = function()
{
	this._widget.showMessage(getLocalizedString("Message sent!") +
		(this._availableSMS > 0 ?
			(this._availableSMS > 1 ?
					getLocalizedString(" (%s left)").sprintf(this._availableSMS) :
					getLocalizedString(" (%s left)").sprintf(this._availableSMS)) :
				getLocalizedString(" (No SMS left)")));
	this.saveMessage();
	this.increaseSMSCounter();
	this.reset();
};

/**
 *	@method sendingFailed
 *	@abstract Called by WebSMSEngine when the sending has failed with no specific reason.
 *	@discussion The Phone shows a generic error message, and resets itself to the initial
 *	state.
 */
Phone.prototype.sendingFailed = function()
{
	// This is 100% code reuse
	this.sendingError(getLocalizedString("Sending failed!"));
};

/**
 *	@method sendingError
 *	@abstract Called by WebSMSEngine when the sending has failed with a specific reason.
 *	@discussion The Phone shows the error message <tt>error</tt>, and resets itself to the
 *	initial state.
 */
Phone.prototype.sendingError = function(error)
{
	this._widget.showError(error)
	this.reset();
};

/**
 *	@method availableMessages
 *	@abstract Called by WebSMSEngine when it is known the number of available messages.
 *	@discussion This method just sets the value of <tt>_availableSMS</tt> to <tt>count</tt>.
 *	This value will be used later to show an informational message to the user at the end of
 *	the sending.
 *	@param count The number of available messages.
 */
Phone.prototype.availableMessages = function(count)
{
	this._availableSMS = count;
};

/**
 *	@method requestCaptchaCode
 *	@abstract Called by WebSMSEngine when the a captcha code is required to proceed.
 *	@discussion This method passes the captcha image URL <tt>captcha_src</tt> to the Widget
 *	which is in charge of displaying it and receiving the user input.
 *	@param captcha_src The URL of the captcha image.
 */
Phone.prototype.requestCaptchaCode = function(captcha_src)
{
	this._widget.showCaptcha(captcha_src);
};