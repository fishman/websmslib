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
 *	2008-02-09	Documented.
 *	2007-11-06	Message has now its own file. Easier to test and maintain.
 *
 */

/**
 *	Message model object
 *
 *	A message represents a short text message. It has a sender number, a recipient number,
 *	a text. It has no (...no what?)
 *
 */

var MESSAGE_MAX_LENGTH = 999;

/**
 *	@class Message
 *	@abstract Represents an SMS message.
 */
function Message()
{
	this._to = null;
	this._from = null;
	this._text = null;
	this._maxLength = MESSAGE_MAX_LENGTH;
	
	return this;
}

/**
 *	@method setPropertyForKey
 *	@abstract Sets the value of the property whose name is <tt>key</tt>.
 *	@param value The value to set for the key.
 *	@param key The key of the property to alter.
 */
Message.prototype.setPropertyForKey = function(value, key)
{
	if (typeof(this["set" + key.capitalize()]) == "function")
	{
		// Use setter method
		this["set" + key.capitalize()](value);
	}
	else
	{			
		this["_" + key] = value;
	}
};

/**
 *	@method propertyForKey
 *	@abstract Returns the value of the property whose name is <tt>key</tt>.
 *	@param key The key of the property to return.
 *	@result The value of the property named <tt>key</tt>.
 */
Message.prototype.propertyForKey = function(key)
{
	if (typeof(this["_" + key]) != 'undefined')
	{			
		return this["_" + key];
	}
	return null;
};

	/*
Message.prototype.setTo = function(to)
	{
		if (to.match(/^\+?\d+$/))
			this._to = to;
		else
			throw "Recipient should be a number in the format +123456789";
	};
Message.prototype.setFrom = function(from)
	{
		if (from.match(/^\+?\d+$/))
			this._from = from;
		else
			throw "Sender should be a number in the format +123456789";
	};
	*/
	
/**
 *	@method maxLength
 *	@abstract Returns the maximum length of the receiver.
 *	@result The maximum length of the receiver.
 */
Message.prototype.maxLength = function()
{
	return this._maxLength;
};

/**
 *	@method setMaxLength
 *	@abstract Sets the maximum length of the receiver.
 *	@param len The maximum length.
 */
Message.prototype.setMaxLength = function(len)
{
	this._maxLength = len;
};

/**
 *	@method isWellFormed
 *	@abstract Checks the validity of the receiver.
 *	@discussion This method returns <tt>true</tt> if all the required properties of the message object
 *	have a valid value, <tt>false</tt> otherwise.
 *	@result <tt>true</tt> if all the required properties of the message object
 *	have a valid value, <tt>false</tt> otherwise.
 */
Message.prototype.isWellFormed = function()
{
	// Valida il messaggio
	if (!this._to ||
		!this._text ||
		this._text.length > this._maxLength)
	{
		return false;
	}
	return true;
};

/**
 *	@method save
 *	@abstract Saves the receiver to disk.
 *	@discussion This method saves the message to a file named <tt>session_id</tt>,
 *	under <tt>~/Library/SMS/</tt>, in a directory named <tt>plugin_name</tt>.
 *	@param plugin_name The name of the plugin.
 *	@param session_id A unique identifier to use as a filename.
 */
Message.prototype.save = function(plugin_name, session_id)
{
	var out = getLocalizedString("To:") + " " + this.propertyForKey("to") + "\r" +
		getLocalizedString("Date:") + " " + new Date(session_id).toString() + "\r" +
		this.propertyForKey("text") + " " +
		this.propertyForKey("from");

	widget.system("bin/save_message.sh " + plugin_name.shellEscape() + " " +
		session_id + '.txt "' +
		out.addSlashes() + '"', null);
};

/**
 *	@method load
 *	@abstract Loads a previously saved message from disk.
 *	@discussion This method loads the message from a file named <tt>session_id</tt>,
 *	under <tt>~/Library/SMS/</tt>, in a directory named <tt>plugin_name</tt>.
 *	@param plugin_name The name of the plugin.
 *	@param session_id A unique identifier to use as a filename.
 *	@result A message object.
 */
Message.load = function(plugin_name, session_id)
{
	var message_parts = widget.system("bin/load_message.sh " + plugin_name.shellEscape() + " " +
		session_id + ".txt", null).outputString.split("\r");
	
	var message = new Message();
	message.setPropertyForKey(message_parts[0].substringAfterString(": "), "to");
	message.setPropertyForKey(message_parts[2].substringAfterString(": "), "text");
	
	return message;
};

/**
 *	@method toString
 *	@abstract Returns a string representation of the receiver.
 *	@result A string representation of the receiver.
 */
Message.prototype.toString = function()
{
	var comps = [];
	var iterator = this.keyIterator();
	for (var key; key = iterator.next(); )
	{
		comps.push(key.substringAfterString("_") + ":" + this[key]);
	}
	return comps.join("\n");
};
