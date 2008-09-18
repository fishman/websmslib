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
 *	----------
 *	2008-04-04	Passwords are stored in Keychain and accessed through the Widget Plugin's methods
 *				<tt>passwordForServiceAccountName</tt> and <tt>setPasswordForServiceAccountName</tt>.
 *	2008-02-09	Documented.
 */


var PREFERENCES_DEFER_SAVE_INTERVAL = 5000;

/**
 *	@class Preferences
 *	@abstract A class to hold user preferences.
 */
function Preferences()
{
	/**
	 *	Preferences holds user preferences and is responsible of loading
	 *	and saving them to disk.
	 *
	 *	User preferences have three domains:
	 *		- Global domain
	 *		- Plugin ("provider") domain
	 *		- Instance domain
	 *
	 *	The global domain contains all preferences common to all instances
	 *	of the widget for the same user. The provider domain contains
	 *	preferences common for the same provider (i.e. username and password).
	 *	Finally, instance domain contains settings for the particular
	 *	widget instance (i.e. skin style).
	 *
	 *	Additionally, preferences can have default values that are returned
	 *	when there's no saved default in the first place. Defaults are set
	 *	programmatically.
	 *
	 *	Changing the plugin requires all preferences in the provider
	 *	domain to be reloaded. This is achieved with a hook in the code that
	 *	sets the preference values.
	 *
	 *	This is pretty of a twisted implementation. But is there a better
	 *	way to handle this? Can anyone advice?? ;)
	 */
	
	this._defaults = {};

	/**
	 *	This dictionary holds all preferences relative to the provider domain
	 */

	this._providerSpecific = {
		username: "",
		password: ""
	};

	/**
	 *	This dictionary holds all preferences relative to the global domain
	 */

	this._globals = {
		from: ""
	};

	/**
	 *	This dictionary holds all preferences relative to this particular
	 *	widget instance
	 */
	
	this._instanceSpecific = {
		skin: ""
	};

}


/**
 *	@method registerDefaults
 *	@abstract Sets the defaults dictionary.
 *	@discussion Preferences defaults are values used when a value
 *	for a given key has not been explicitly set.
 *	@param dict A dictionary of defaults.
 */
Preferences.prototype.registerDefaults = function(dict)
{
	this._defaults = dict;
};

/**
 *	@abstract Returns the defaults dictionary.
 *	@result A dictionary of defaults.
 */
Preferences.prototype.defaults = function()
{
	return this._defaults;
};

/**
 *	@method load
 *	@abstract Loads preferences for this instance from disk.
 */
Preferences.prototype.load = function()
{
	this._provider = widget.preferenceForKey(widget.identifier + ":provider") ||
		this._defaults["provider"];

	var value;
	
	var iterator = this._globals.keyIterator();
	for (var key; key = iterator.next();)
	{
		value = widget.preferenceForKey(key);
		this._globals[key] = (typeof(value) == "undefined") ? this._defaults[key] : value;
	}
	iterator = this._instanceSpecific.keyIterator();
	for (var key; key = iterator.next();)
	{
		value = widget.preferenceForKey(widget.identifier + ":" + key);
		this._instanceSpecific[key] = (typeof(value) == "undefined") ? this._defaults[key] : value;
	}
	iterator = this._providerSpecific.keyIterator();
	for (var key; key = iterator.next();)
	{
		if (key == 'password')
		{
			continue;
		}
		value = widget.preferenceForKey(this._provider + ":" + key);
		value = (typeof(value) == "undefined") ? this._defaults[key] : value;
		this._providerSpecific[key] = value;
	}
	this._providerSpecific['password'] = ABPlugin.passwordForServiceAccountName(
		this._provider,
		this._providerSpecific['username']);
};

/**
 *	@method save
 *	@abstract Saves preferences for this instance to disk.
 */
Preferences.prototype.save = function()
{
	if (this._timer)
	{
		clearInterval(this._timer);
		this._timer = null;
	}
	
	var value;

	var iterator = this._globals.keyIterator();
	for (var key; key = iterator.next();)
	{
		value = (typeof(this._globals[key]) != "undefined") ? this._globals[key] : null;
		widget.setPreferenceForKey(value, key);
	}
	iterator = this._instanceSpecific.keyIterator();
	for (var key; key = iterator.next();)
	{
		value = (typeof(this._instanceSpecific[key]) != "undefined") ? this._instanceSpecific[key] : null;
		widget.setPreferenceForKey(value, widget.identifier + ":" + key);
	}
	iterator = this._providerSpecific.keyIterator();
	for (var key; key = iterator.next();)
	{
		value = (typeof(this._providerSpecific[key]) != "undefined") ? this._providerSpecific[key] : null;
		if (key == "password" && value)
		{
			ABPlugin.setPasswordForServiceAccountName(value, this._provider, this._providerSpecific['username']);
			continue;
		}
		widget.setPreferenceForKey(value, this._provider + ":" + key);
	}
	this._saveProvider();
};

/**
 *	@method _saveProvider
 *	@abstract Saves the preference relative to the current provider.
 */
Preferences.prototype._saveProvider = function()
{
	widget.setPreferenceForKey(this._provider, widget.identifier + ":provider");
};

/**
 *	@method clear
 *	@abstract Clears the preferences in the instance domain.
 */	
Preferences.prototype.clear = function()
{
	var iterator = this._instanceSpecific.keyIterator();
	for (var key; key = iterator.next();)
	{
		widget.setPreferenceForKey(null, widget.identifier + ":" + key);
	}
	widget.setPreferenceForKey(null, widget.identifier + ":provider");
};

/**
 *	@method clearAll
 *	@abstract Clears the preferences in all domains.
 */	
Preferences.prototype.clearAll = function()
{
	var iterator = this._globals.keyIterator();
	for (var key; key = iterator.next();)
	{
		widget.setPreferenceForKey(null, key);
	}
	iterator = this._providerSpecific.keyIterator();
	for (var key; key = iterator.next();)
	{
		widget.setPreferenceForKey(null, this._provider + ":" + key);
	}
	this.clear();
};

/**
 *	@method preferenceForKey
 *	@abstract Returns the preference value for a given key. Returns <tt>null</tt> if
 *	no preference for the given key exists.
 *	@param key The key of the desired preference.
 *	@result The preference for the given key.
 */	
Preferences.prototype.preferenceForKey = function(key)
{
	if (key == "provider" && this._provider)
	{
		return this._provider;
	}
	return (typeof(this._globals[key]) != "undefined") ?
		this._globals[key] :
		(typeof(this._providerSpecific[key]) != "undefined") ?
			this._providerSpecific[key] :
			(typeof(this._instanceSpecific[key]) != "undefined") ?
				this._instanceSpecific[key] :
				(typeof(this._defaults[key]) != "undefined") ?
					this._defaults[key] :
					null;
};

/**
 *	@method setPreferenceForKey
 *	@abstract Sets the preference value for a given key.
 *	@discussion This method is responsible for choosing the appropriate domain for a
 *	given preference.
 *	Additionally, handles reloading of preferences in the provider domain
 *	when the provider has been changed.
 *	@param value The value of the preference to set.
 *	@param key The key of the preference to set.
 */	
Preferences.prototype.setPreferenceForKey = function(value, key)
{
	if (key == "provider")
	{
		if (this._provider != value)
		{
			this._provider = value;
			this._saveProvider();
			this.load();
		}
		return;
	}
	if (typeof(this._globals[key]) != "undefined")
		this._globals[key] = value;
	else if (typeof(this._providerSpecific[key]) != "undefined")
		this._providerSpecific[key] = value;
	else
		this._instanceSpecific[key] = value;
	this._deferSave();
};

/**
 *	@method _deferSave
 *	@abstract Performs a deferred saving of the receiver.
 *	@discussion Triggers the saving of preferences after a fixed amount of time.
  *	Subsequent calls to this method have no effect before the timer has fired.
 */
Preferences.prototype._deferSave = function()
{
	if (this._timer)
	{
		return;
	}
	this._timer = setTimeout(function(pref) {
		pref.save();
		pref._timer = null;
	},
	PREFERENCES_DEFER_SAVE_INTERVAL,
	this);
};

/**
 *	@method toString
 *	@abstract Returns a string representation of the receiver.
 *	@result A string representation of the receiver.
 */
Preferences.prototype.toString = function()
{
	var str = "Preferences {provider: " + this._provider + ", username: " +
		this._providerSpecific["username"] + ", password: " + this._providerSpecific["password"] + 
		", from: " + this._globals["from"] + ", skin: " + this._instanceSpecific["skin"] + "}";
	return str;
};
