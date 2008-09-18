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
 *	---------
 *	2008-03-08	Captcha code can be entered with Enter key.
 *	2008-02-16	Rewritten using the prototype assignment notation.
 *	2008-02-03	Widget now has its own file.
 */

var NO_CAPTCHA = -1;
var IMG_NULL = "img/null.png";
var REMINDER_INTERVAL = 20;

/**
 *	@class Widget
 *	@abstract The main view of the widget.
 *	@discussion This is a bloat of a class. Probably needs some better decoupling and
 *	partitioning into smaller components.
 */
function Widget()
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
	this._textBezel = null;
	this._toLabel = null;
	this._sending = null;
	this._phone = null;
	this._provider = null;

	/* Captcha handling */
	this._captchaPane = null;
	this._captchaImg = null;
	this._captchaTxt = null;
	
	/* Sparkle */
	this._sparklePane = null;
	this._sparkleReleaseNotes = null;

	this.isShowingMessage = false;
	this.isShowingCaptcha = false;
	this.isSendingMessage = false;

	return this;
}

/**
 *	@method init
 *	@abstract Initializes the receiver for the given phone object.
 *	@param __phone The phone object owner of the receiver.
 */
Widget.prototype.init = function(__phone)
{
	this._phone = __phone;

	this._toField = document.getElementById("toField");
	this._fromField = document.getElementById("fromField");
	this._usernameField = document.getElementById("usernameField");
	this._passwordField = document.getElementById("passwordField");
	this._contactsList = document.getElementById("contactsList");
	this._availableCharsField = document.getElementById("availableCharsField");
	this._dailyAvailableSMSField = document.getElementById("dailyAvailableSMSField");
	this._textField = document.getElementById("textField");
	this._sending = document.getElementById("sending");
	this._provider = document.getElementById("providersList");

	this._front = document.getElementById("front");
	this._back = document.getElementById("back");
	this._textBezel = document.getElementById("textBezel");
	this._fakeTop = document.getElementById("fakeTop");
	this._fakeBottom = document.getElementById("fakeBottom");
	this._toLabel = document.getElementById("toLabel");

	/* Captcha handling */
	this._captchaPane = document.getElementById("captchaPane");
	this._captchaImg = document.getElementById("captchaImg");
	this._captchaTxt = document.getElementById("captchaTxt");
	
	/* Sparkle */
	this._sparklePane = document.getElementById("sparklePane");
	this._sparkleReleaseNotes = document.getElementById("sparkleReleaseNotes");

	
	/* UI Localization */		
	this._captchaTxt.setAttribute("placeholder", getLocalizedString("Enter the code"));
	document.getElementById("toFieldLabel").innerHTML = getLocalizedString("To:");
	document.getElementById("fromFieldLabel").innerHTML = getLocalizedString("Sign:");
	document.getElementById("providersListLabel").innerHTML = getLocalizedString("Plugin:");
	document.getElementById("usernameFieldLabel").innerHTML = getLocalizedString("Username:");
	document.getElementById("passwordFieldLabel").innerHTML = getLocalizedString("Password:");
	document.getElementById("updateAvailable").title = getLocalizedString("Update available");

	document.getElementById("noProxyLabel").text = getLocalizedString("None");
	document.getElementById("proxyTypeListLabel").innerHTML = getLocalizedString("Proxy:");
	document.getElementById("proxyHostFieldLabel").innerHTML = getLocalizedString("Host:");
	document.getElementById("proxyUsernameFieldLabel").innerHTML = getLocalizedString("Username:");
	document.getElementById("proxyPasswordFieldLabel").innerHTML = getLocalizedString("Password:");
	document.getElementById("proxyAuthListLabel").innerHTML = getLocalizedString("Auth type:");

	document.getElementById("countryCodeListLabel").innerHTML = getLocalizedString("Country");
	
	document.getElementById("suTablePluginHdr").innerHTML = getLocalizedString("Plugin");
	document.getElementById("suTableCurrentHdr").innerHTML = getLocalizedString("Got");
	document.getElementById("suTableLatestHdr").innerHTML = getLocalizedString("New");
	
	this._textField.widget = this;
	this._textBezel.widget = this;

	new AppleGlassButton(document.getElementById("doneButton"),
		getLocalizedString("Done"),
		function()
		{
			phone.savePreferences();
			Proxy.saveSettings();
			phone.flip();
		});

	SUUpdater.updateButton = new AppleGlassButton(document.getElementById("suUpdateButton"),
		getLocalizedString("Update"),
		function() { SUUpdater.performUpdate(); });
	SUUpdater.updateButton.setEnabled(false);

	SUUpdater.checkButton = new AppleGlassButton(document.getElementById("suCheckButton"),
		getLocalizedString("Check"),
		function() { SUUpdater.checkUpdates(); });

	new AppleGlassButton(document.getElementById("donateButton"),
		getLocalizedString("Donate"),
		function() { Utils.donate() });
	
	this._toField.onfocus = function(e)
	{
		document.getElementById("abtoggler").src = "img/combotoggler-focused.png";
	};
	this._toField.onblur = function(e)
	{
		document.getElementById("abtoggler").src = "img/combotoggler.png";			
	};
	this._toField.autocompletion = new Autocompletion(this._toField);
	this._toField.autocompletion.lookupCallback = AddressBook.bestMatchForPrefix.makeCallbackTarget(AddressBook);
	this._toField.autocompletion.onCompleteCallback = phone.updateToFromField.makeCallbackTarget(phone);
	this._textField.onblur = function()
	{
		this.widget.showTextBezel();
	};
	this._textField.addEventListener('keyup', function(evt)
		{
			if (this.value.length > 0)
			{
				this.widget.setMainButtonCaption(getLocalizedString("Send"), false);
			}
			else
			{
				this.widget.setMainButtonCaption(null, false);
			}
			this.widget._phone.updateAvailableChars(this, evt);
			this.widget._phone.update(this);
		},
		true);
	this._textBezel.onclick = function()
	{
		this.widget.hideTextBezel();
	};
	this._toLabel.onclick = function()
	{
		phone.flip();
		setTimeout(function(wdgt)
		{
			phone.showPreferencePane(document.getElementById("generalPreferencesTab"),
				function()
				{
					phone._widget._toField.focus();
				});
		},
		1000);
		
	};
	this._captchaTxt.onkeydown = function(e)
	{
		if (e.keyCode == 13)
		{
			e.preventDefault();
			e.stopPropagation();
			// I love JS closures... binding the parameter here.
			__phone.action();
		}
	};
	// Set version number in the back.
	document.getElementById("version").innerHTML = "v" + window.getInfoDictionaryValueForKey("CFBundleVersion");
};

/**
 *	@method initWithProperties
 *	@abstract Initializes the receiver for the given phone object, and additionally sets properties.
 *	@param phone The phone object owner of the receiver.
 *	@param properties A dictionary of properties, keyed by their name.
 */
Widget.prototype.initWithProperties = function(phone, properties)
{
	this.init(phone);
	var iterator = properties.keyIterator();
	for (var property; property = iterator.next(); )
	{
		if (this["_" + property + "Field"])
			this["_" + property + "Field"].value = properties[property];
	}
};

/**
 *	@method showDailyAvailableSMS
 *	@abstract Sets the value of the daily available SMS label.
 *	@discussion This method is currently unused.
 *	@param available The number of available messages for today.
 */
Widget.prototype.showDailyAvailableSMS = function(available)
{
	this._dailyAvailableSMSField.innerHTML = available;
};

/**
 *	@method setMainButtonCaption
 *	@abstract Sets the caption of the receiver's main button.
 *	@discussion The main button of the Widget is a multifunctional action trigger. Depending on the state
 *	of the Phone object, this button has a different action, and the caption should inform the user of the
 *	current action that will be triggered when the user clicks on it.
 *	@param text The text of the button caption.
 *	@param highlighted <tt>true</tt> if the caption should be drawn in a highlighted color.
 */
Widget.prototype.setMainButtonCaption = function(text, highlighted)
{
	if (text)
	{
		document.getElementById("messageConfirmLabel").style.display = 'block';
		document.getElementById("messageConfirmLabel").innerHTML = text;
	}
	else
	{
		document.getElementById("messageConfirmLabel").style.display = 'none';
		document.getElementById("messageConfirmLabel").innerHTML = '';
	}
	document.getElementById("messageConfirmLabel").style.color = highlighted ? "#fff" : "#000";
};

/**
 *	@method getText
 *	@abstract Returns the text of the SMS message.
 *	@result The text of the SMS message.
 */
Widget.prototype.getText = function()
{
	return this._textField.value;
};

/**
 *	@method setText
 *	@abstract Sets the text of the SMS message.
 *	@param text The text of the SMS message.
 */
Widget.prototype.setText = function(text)
{
	this._textField.value = text;
	// this._phone.update(this._textField);
	this.setMainButtonCaption(this._textField.value.length > 0 ? getLocalizedString("Send") : null, false);
};

/**
 *	@method showMessage
 *	@abstract Shows an informative text.
 *	@discussion The Widget's main display is used to compose the SMS message, but is also
 *	used to inform the user of relevant status conditions. This method switches the display to
 *	present an informative message, and changes the main button's action in order to dismiss the
 *	message and return to SMS composer mode.
 *	@param message The text of the informative message.
 */
Widget.prototype.showMessage = function(message)
{
	this._textField._value = this._textField.value;
	this.setText(message);
	this._textField.readOnly = true;
	this.isShowingMessage = true;
	this.setMainButtonCaption(getLocalizedString("Ok"), false);
};

/**
 *	@method showError
 *	@abstract Shows an error message.
 *	@discussion This method is a shorthand to the <tt>showMessage</tt> method with
 *	an error indicator prefix.
 *	@param error The text of the error message.
 */
Widget.prototype.showError = function(error)
{
	this.showMessage(getLocalizedString("Error:\n") + error);
};

/**
 *	@method focusTextField
 *	@abstract Hides the textarea bezel.
 *	@discussion In order to hide the textarea border (which is 1px wide and cannot be hidden), the Widget overlays
 *	a rectangular bezel which camouflages the textarea over the screen. When the textarea gets the focus, the bezel
 *	should be hidden to allow editing.
 */
Widget.prototype.focusTextField = function()
{
	this.hideTextBezel();
};

/**
 *	@method dismissMessage
 *	@abstract Dismisses the informative message and switches back to the SMS composer.
 */
Widget.prototype.dismissMessage = function()
{
	this.setText(this._textField._value);
	this._textField.readOnly = false;
	this.isShowingMessage = false;
	
	if (this._textField.value.length == 0)
	{
		this.focusTextField();
	}
};

/**
 *	@method startSending
 *	@abstract Updates the widget UI to show the beginning of the sending process.
 */
Widget.prototype.startSending = function()
{
	this.setMainButtonCaption(getLocalizedString("Cancel"), false);
	this.isSendingMessage = true;
	this._sending.style.display = "block";
};

/**
 *	@method endSending
 *	@abstract Updates the widget UI to show the end of the sending process.
 */
Widget.prototype.endSending = function()
{
	if (!this.isShowingMessage)
	{
		this.setMainButtonCaption(this._textField.value.length > 0 ? getLocalizedString("Send") : null, false);
	}
	this.isSendingMessage = false;
	this._sending.style.display = "none";
};

/**
 *	@method hideTextBezel
 *	@abstract Hides the bezel which hides the border of the unfocused textarea.
 */
Widget.prototype.hideTextBezel = function()
{
	this._fakeTop.style.display = 'block';
	this._fakeBottom.style.display = 'block';
	this._textBezel.style.zIndex = 0;
	this._textField.focus();
};

/**
 *	@method showSparklePane
 *	@abstract Shows the information pane for Sparkle updates.
 *	@param params A dictionary of parameters to configure the pane.
 */
Widget.prototype.showSparklePane = function(params)
{
	//this._sparklePane.style.display = 'block';
	//this._sparkleReleaseNotes.src = params.releaseNotesLink;
};


/**
 *	@method showCaptcha
 *	@abstract Shows the captcha pane and loads the captcha image at <tt>src</tt>.
 *	@param src The captcha image source URI.
 */
Widget.prototype.showCaptcha = function(src)
{
	this._captchaPane.style.display = 'block';
	this._captchaImg.src = src.preventCached();
	this._captchaTxt.focus();
	this.isShowingCaptcha = true;
	this.setMainButtonCaption(getLocalizedString("Enter"), true);
};

/**
 *	@method hideCaptcha
 *	@abstract Dismisses the captcha pane.
 */
Widget.prototype.hideCaptcha = function()
{
	this._captchaPane.style.display = 'none';
	this._captchaImg.src = IMG_NULL;
	this.setCaptcha("");
	this.isShowingCaptcha = false;
	if (!this.isShowingMessage)
	{
		this.setMainButtonCaption(getLocalizedString("Cancel"), false);
	}
};

/**
 *	@method getCaptcha
 *	@abstract Returns the value of the captcha code entered by the user.
 *	@result The value of the captcha code entered by the user.
 */
Widget.prototype.getCaptcha = function()
{
	return this._captchaTxt.value;
};

/**
 *	@method setCaptcha
 *	@abstract Sets the value of the captcha code.
 *	@param code The value of the captcha code.
 */
Widget.prototype.setCaptcha = function(code)
{
	this._captchaTxt.value = code;
};

/**
 *	@method showTextBezel
 *	@abstract Shows the bezel which hides the border of the unfocused textarea.
 */
Widget.prototype.showTextBezel = function()
{
	this._textBezel.style.zIndex = 2000;
	this._fakeTop.style.display = 'none';
	this._fakeBottom.style.display = 'none';
};

/**
 *	@method setTo
 *	@abstract Sets the value of the to (recipient) field in the Call preference pane, and the nickname for the
 *	recipient label in the front of the widget.
 *	@param number The recipient of the message.
 *	@param nickname The nickname for the recipient label.
 */
Widget.prototype.setTo = function(number, nickname)
{
	this._toField.value = number;
	nickname = nickname || number;
	this._toLabel.innerHTML = nickname.clipToLength(11);
};

/**
 *	@method to
 *	@abstract Returns the value of the to (recipient) field in the Call preference pane.
 *	@result The value of the to (recipient) field in the Call preference pane.
 */
Widget.prototype.to = function()
{
	return this._toField.value;
};

/**
 *	@method setFrom
 *	@abstract Sets the value of the from (signature) field in the Call preference pane.
 *	@param from The signature for the service.
 */
Widget.prototype.setFrom = function(from)
{
	this._fromField.value = from;
};

/**
 *	@method from
 *	@abstract Returns the value of the from (signature) field in the Call preference pane.
 *	@result The value of the from field in the Call preference pane.
 */
Widget.prototype.from = function()
{
	return this._fromField.value;
};

/**
 *	@method setUsername
 *	@abstract Sets the value of the username field in the Call preference pane.
 *	@param username The username for the service.
 */
Widget.prototype.setUsername = function(username)
{
	this._usernameField.value = username;
};

/**
 *	@method username
 *	@abstract Returns the value of the username field in the Call preference pane.
 *	@result The value of the username field in the Call preference pane.
 */
Widget.prototype.username = function()
{
	return this._usernameField.value;
};

/**
 *	@method setPassword
 *	@abstract Sets the value of the password field in the Call preference pane.
 *	@param password The password for the service.
 */
 Widget.prototype.setPassword = function(password)
{
	this._passwordField.value = password;
};

/**
 *	@method password
 *	@abstract Returns the value of the password field in the Call preference pane.
 *	@result The value of the password field in the Call preference pane.
 */
Widget.prototype.password = function()
{
	return this._passwordField.value;
};

/**
 *	@method setProvider
 *	@abstract Sets the value of the provider field in the Call preference pane.
 *	@param provider The provider's name.
 */
Widget.prototype.setProvider = function(provider)
{
	// handle all the UI animation here
	for (var i = 0; i < this._provider.options.length; i++)
		if (this._provider.options[i].value == provider)
			this._provider.selectedIndex = i;
};

/**
 *	@method provider
 *	@abstract Returns the value of the provider field in the Call preference pane.
 *	@result The value of the provider field in the Call preference pane.
 */
Widget.prototype.provider = function()
{
	return this._provider.value;
};

/**
 *	@method setAvailableChars
 *	@abstract Updates the indication of available characters for the composition of the message.
 *	@param availableChars The number of characters available.
 */
Widget.prototype.setAvailableChars = function(availableChars)
{
	this._availableCharsField.innerHTML = (availableChars == Infinity ? "&infin;" : availableChars);
	// Sets a class name of exceeded if available chars are less than 0
	this._availableCharsField.className = availableChars < 0 ? 'exceeded' : '';
};

/**
 *	@method loadSkin
 *	@abstract Causes the change of the widget's skin (the graphics in the front).
 *	@param skin The name of the skin to load.
 */
Widget.prototype.loadSkin = function(skin)
{
	document.getElementById("front").className = SkinClasses[skin];
};

/**
 *	@method flip
 *	@abstract Turns the widget to the opposite side.
 */
Widget.prototype.flip = function()
{
	if (this._frontVisible)
	{
		if (window.widget)
			widget.prepareForTransition("ToBack");

		this._front.style.display="none";
		this._back.style.display="block";

		if (window.widget)
			setTimeout ('widget.performTransition();', 0);

	}
	else
	{
		if (window.widget)
			widget.prepareForTransition("ToFront");

		this._front.style.display="block";
		this._back.style.display="none";
		
		this._phone.updateAvailableChars(this._textField, null);
		
		if (window.widget)
			setTimeout ('widget.performTransition();', 0);
	}
	this._frontVisible = !this._frontVisible;
};

/**
 *	@method showAvailableUpdate
 *	@abstract Shows a message to the user, informing her of the availability of an updated version.
 *	@param available <tt>true</tt> if an update is available.
 *	@param item The internal codename of the software.
 *	@param latest The latest version available.
 */
Widget.prototype.showAvailableUpdate = function(available, item, latest)
{
	if (available)
	{
		document.getElementById("updateAvailable").style.visibility = "visible";
	}
};
