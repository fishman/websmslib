/**
 *	WebSMS widget
 *
 *	© Claudio Procida 2006
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

var ERROR_PREFIX = "Errore: \n";

function Message() // The Model
{
	/**
	 *	Represents a Short Message
	 */

	this.widget = null;
	this._plugin = null;
	this._provider = null;
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

	this.setProvider = function(provider)
	{
		this._provider = provider;
		this._plugin = Plugins[provider];
	};

	this.provider = function()
	{
		return this._provider;
	};

	this.maxLength = function()
	{
		return this._plugin.max_message_length;
	};

	this.send = function()
	{
		var command;

		var agent = "Mozilla/5.0 (Macintosh; U; PPC Mac OS X Mach-O; it; rv:1.8.0.1) Gecko/20060111 Firefox/1.5.0.1";

		var placeholders = ["%USERNAME%",
							"%PASSWORD%",
							"%FROM%",
							"%TO%",
							"%TEXT%",
							"%TO_PREFIX%",
							"%TO_NUMBER%"];
		var replacements = [this._properties["username"],
							this._properties["password"],
							escape(this._properties["from"]),
							Utils.trimNumber(this._properties["to"]),
							escape(this._properties["text"]),
							Utils.trimNumber(this._properties["to"]).substr(0, 3),
							Utils.trimNumber(this._properties["to"]).substr(3)];
		var response;
		for (var i = 0; i < this._plugin.steps.length; i++)
		{
			command =					  '/usr/bin/curl ' + this._plugin.steps[i].flags +
			(this._plugin.steps[i].data ? ' -d "' + Utils.batchReplacePlaceholdersReplacements(this._plugin.steps[i].data, placeholders, replacements) + '"' : '')+
										  ' -e "' + Utils.batchReplacePlaceholdersReplacements(this._plugin.steps[i].referrer, placeholders, replacements) + '"' +
								 (i > 0 ? ' -b "' + eval("'/var/tmp/websms." + this._plugin.name + "." + i + ".txt'") + '"' : '') +
										  ' -c "' + eval("'/var/tmp/websms." + this._plugin.name + "." + (i + 1) + ".txt'") + '"' +
										  ' -A "' + agent + '"' +
										  ' "' + Utils.batchReplacePlaceholdersReplacements(this._plugin.steps[i].action, placeholders, replacements) + '"';
			response = widget.system(command, null).outputString;
			if (this._plugin.steps[i].check)
			{
				var check = this._plugin.steps[i].check;
				for (var j = 0; j < check.length; j++)
				{
					if (check[j].match.test(response))
					{
						this.widget.showMessage(check[j].reason);
						return;
					}
				}
			}
		}
		if ((typeof response != 'undefined') && this._plugin.success_marker && !response.match(this._plugin.success_marker))
		{
			this.widget.showMessage("Invio fallito");
		}
	};

	this.isWellFormed = function()
	{
		// Valida il messaggio

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

	this.initWithProvider = function(provider)
	{
		this.setProvider(provider);
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
	this._textField = null;
	this._frontVisible = true;
	this._front = null;
	this._back = null;
	this._fakeTop = null;
	this._textBezel = null;
	this._toLabel = null;
	this._sending = null;
	this._phone = null;
	this._provider = null;

	this.init = function(__phone)
	{
		this._phone = __phone;

		this._toField = document.getElementById("toField");
		this._fromField = document.getElementById("fromField");
		this._usernameField = document.getElementById("usernameField");
		this._passwordField = document.getElementById("passwordField");
		this._contactsList = document.getElementById("contactsList");
		this._availableCharsField = document.getElementById("availableCharsField");
		this._textField = document.getElementById("textField");
		this._sending = document.getElementById("sending");
		this._provider = document.getElementById("providersList");

		this._front = document.getElementById("front");
		this._back = document.getElementById("back");
		this._textBezel = document.getElementById("textBezel");
		this._fakeTop = document.getElementById("fakeTop");
		this._toLabel = document.getElementById("toLabel");

		this._textField.widget = this;
		this._textBezel.widget = this;

		this._alertScreen = new AlertScreen();

		createGenericButton(document.getElementById("doneButton"), "Fatto", function() { phone.savePreferences(); phone.flip() });
		createGenericButton(document.getElementById("donateButton"), "Dona!", function() { Utils.donate() });

		this._textField.onblur = function()
		{
			this.widget.showTextBezel();
		};
		this._textBezel.onclick = function()
		{
			this.widget.hideTextBezel();
		};
		this._toLabel.onclick = function()
		{
			phone.flip();
		};

		document.getElementById("version").innerHTML = "v" + getWidgetProperty("CFBundleVersion");
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

	this.showMessage = function(error)
	{
		//this._alertScreen.showAlert(error);
		this._textField._value = this._textField.value;
		this._textField.value = ERROR_PREFIX + error;
		setTimeout(function(obj){obj.value = obj._value}, 5000, this._textField);
	};

	this.startSending = function()
	{
		this._sending.style.display = "block";
	};

	this.endSending = function()
	{
		this._sending.style.display = "none";
	};

	this.hideTextBezel = function()
	{
		this._fakeTop.style.display = 'block';
		this._textBezel.style.zIndex = 0;
		this._textField.focus();
	}

	this.showTextBezel = function()
	{
		this._textBezel.style.zIndex = 2000;
		this._fakeTop.style.display = 'none';
	}

	this.setTo = function(number, nickname)
	{
		this._toField.value = number;
		this._toLabel.innerHTML = nickname;
	};
	this.to = function()
	{
		return this._toField.value;
	};

	this.setFrom = function(number)
	{
		this._fromField.value = number;
	};
	this.from = function()
	{
		return this._fromField.value;
	};

	this.setUsername = function(number)
	{
		this._usernameField.value = number;
	};
	this.username = function()
	{
		return this._usernameField.value;
	};

	this.setPassword = function(number)
	{
		this._passwordField.value = number;
	};
	this.password = function()
	{
		return this._passwordField.value;
	};

	this.setProvider = function(provider)
	{
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
		this._availableCharsField.innerHTML = availableChars;
	};
	
	this.loadSkin = function(skin)
	{
		document.getElementById("front").className = SkinClasses[skin];
	};

	this.flip = function()
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
			
			if (window.widget)
				setTimeout ('widget.performTransition();', 0);
		}
		this._frontVisible = !this._frontVisible;
	};
}

function Phone() // The Controller
{
	this._message = null; // the message associated with this phone
	this._widget = null; // the widget associated with this phone
	this._preferences = null; // preferences for this phone instance

	this.init = function()
	{
		// Instantiate preferences
		this._preferences = new Preferences();

		// Instantiate the widget
		this._widget = new Widget();
		// Set up the widget interface
		this._widget.init();

		// Load preferences and update the widget interface
		this._preferences.load();

		var provider = this._preferences.provider() || "";
		var from     = this._preferences.propertyForKey("from") || "";
		var username = this._preferences.propertyForKey("username") || "";
		var password = this._preferences.propertyForKey("password") || "";
		var skin     = this._preferences.propertyForKey("skin");
		
		this._widget.setProvider(provider);
		this._widget.setFrom(from);
		this._widget.setUsername(username);
		this._widget.setPassword(password);
		this._widget.loadSkin(skin);
		
		// Update skin chooser
		SkinChooser.updateWithSkin(skin);

		// Instantiate the message
		this._message = new Message();

		// Initialize the message
		this._message.initWithProvider(provider);

		this._message.widget = this._widget;

		this._message.setPropertyForKey(from, "from");
		this._message.setPropertyForKey(username, "username");
		this._message.setPropertyForKey(password, "password");

		// Check for updates
		var checker = new VersionChecker();
		checker.checkUpdate();
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

	this.clearPreferences = function()
	{
		this._preferences.clear();
	};

	this.sendMessage = function()
	{
		if (this._message.isWellFormed())
		{
			this._widget.startSending();
			this._message.send();
			this._widget.endSending();
		}
		else
		{
			this._widget.showMessage("Introdurre destinatario, username e password");
		}
	};

	this.update = function(sender)
	{
		this._message.setPropertyForKey(sender.value, sender.id.substring(0, sender.id.indexOf("Field")));
	};

	this.updateAvailableChars = function(sender, event)
	{
		var available = this._message.maxLength() - sender.value.length;
		if (available < 1)
		{
			event.stopPropagation();
			event.preventDefault();
		}
		else
		{
			this._widget.setAvailableChars(available);
		}
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
		this._message.setProvider(sender.value);
		this._message.setPropertyForKey(username, "username");
		this._message.setPropertyForKey(password, "password");
	};
	
	this.setSkin = function(skin)
	{
		this._preferences.setPropertyForKey(skin, "skin");
		this._widget.loadSkin(skin);
	};

	this.flip = function()
	{
		this._widget.flip();
	};

	this.setToFromList = function(list)
	{
		var to = Utils.trimNumber(list.value);
		// Update view...
		this._widget.setTo(to, Utils.nicknameFromString(list.options[list.selectedIndex].text));
		// ...and model
		this._message.setPropertyForKey(to, "to");
	};

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

		this._provider = widget.preferenceForKey(widget.identifier + ":provider") || "TIM";

		var value;

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

AddressBook = {
	load: function()
	{
		// Loads addresses from the plugin
		if (ABPlugin) {
			ABPlugin.loadContacts();
			var count = ABPlugin.count();
			var list = document.getElementById("contactsList");
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

	widget.onremove = function() { phone.clearPreferences() };

	AddressBook.load();
}

var Utils = {

/**
 *	Utility class to hold handy functions
 */

	nicknameFromString: function(str)
	{
		var terms = str.substr(0, str.indexOf(" (")).split(" ");
		return terms[terms.length - 1];
	},
	batchReplacePlaceholdersReplacements: function(str, placeholders, replacements)
	{
		for (var i = 0; i < placeholders.length; i++)
		{
			str = str.replace(new RegExp(placeholders[i], "g"), replacements[i]);
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
		number = number.replace(/\s/g, "");

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
		widget.openURL("http://www.emeraldion.it");
	},
	home: function()
	{
		widget.openURL("http://www.emeraldion.it/software/widgets/websms/");
	},
	help: function()
	{
		widget.openURL("http://www.emeraldion.it/software/widgets/websms/instructions/");
	},
	donate: function()
	{
		widget.openURL("http://www.emeraldion.it/software/widgets/websms/donate/");
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
		animation.firstElement = document.getElementById ("flip");
		animation.secondElement = document.getElementById ("huh");
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
		animation.firstElement = document.getElementById ("flip");
		animation.secondElement = document.getElementById ("huh");
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

function AlertScreen()
{
	// Not really used

	this.animation = {duration:0, starttime:0, to:1.0, now:0.0, from:0.0, timer:null};
	this._visible = false;
	this._label = document.getElementById("alertmessage-body");
	this._alertmessage = document.getElementById("alertmessage");

	this.showAlert = function(text)
	{
		this._label.innerHTML = text;
		this.show();
		setTimeout(function(obj) { obj.hide() }, 5000, this);
	}

	this.show = function()
	{
		if (!this._visible)
		{
			if (this.animation.timer != null) {
				clearInterval (this.animation.timer);
				this.animation.timer  = null;
			}

			var starttime = (new Date).getTime() - 13;

			this.animation.duration = 1000;
			this.animation.starttime = starttime;
			this.animation.timer = setInterval (function(obj) { obj.animate(); }, 13, this);
			this.animation.from = this.animation.now;
			this.animation.to = 1.0;
			this.animate();
			this._visible = true;
		}
	};

	this.hide = function()
	{
		if (this._visible)
		{
			if (this.animation.timer != null) {
				clearInterval (this.animation.timer);
				this.animation.timer  = null;
			}

			var starttime = (new Date).getTime() - 13;

			this.animation.duration = 1000;
			this.animation.starttime = starttime;
			this.animation.timer = setInterval (function(obj) { obj.animate(); }, 13, this);
			this.animation.from = this.animation.now;
			this.animation.to = 0.0;
			this.animate();
			this._visible = false;
		}
	};

	this.setOpacity = function(opacity)
	{
		this._alertmessage.style.opacity = opacity;
	};

	this.animate = function()
	{
		var T;
		var ease;
		var time = (new Date).getTime();

		T = clampTo(time-this.animation.starttime, 0, this.animation.duration);

		if (T >= this.animation.duration) {
			clearInterval (this.animation.timer);
			this.animation.timer = null;
			this.animation.now = this.animation.to;
		}
		else {
			ease = 0.5 - (0.5 * Math.cos(Math.PI * T / this.animation.duration));
			this.animation.now = computeNextFloat (this.animation.from, this.animation.to, ease);
		}
		//alert(this.animation.now);

		this.setOpacity(this.animation.now);
	};
}