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
 *	2008-08-03	Fixed issue with '0' in autocompletion.
 */

/**
 *	@class Autocompletion
 *	@abstract Automatic completion manager for a HTML text field.
 *	@discussion The automatic completion manager reacts to keyup events fired by the text field,
 *	requests a dictionary lookup by calling its <tt>lookupCallback</tt> member function, and updates
 *	the value of the field with the value returned.
 *	This should allow this class to be highly flexible, since all you need is a function that returns
 *	a suitable completion for the current value.
 */
function Autocompletion(field)
{
	this._field = field;
	this.lookupCallback = null;
	this.onCompleteCallback = null;
	field.addEventListener('keyup',
		this._keyup.makeCallbackTarget(this),
		true);
}

/**
 *	@method _keyup
 *	@abstract Keyup event handler.
 *	@param e The keyup event object.
 *	@discussion The <tt>_keyup</tt> event handler requests a dictionary lookup by calling
 *	the <tt>lookupCallback</tt> member function with the altered value, and updates
 *	the value of the field with the value returned.
 *	Control keys, arrows etc. are filtered out.
 */
Autocompletion.prototype._keyup = function(e)
{
	if (typeof(this.lookupCallback) != 'function')
		return;

	// 48 is the character '0' (zero). Ignore anything before.
	//__DEBUG(e.keyCode);
	if (e.keyCode < 48)
		return;

	e.preventDefault();
	e.stopPropagation();
	var selection = {
		start: this._field.selectionStart,
		end: this._field.selectionEnd
	};
	this._field.value = this.lookupCallback(this._field.value.substr(0, selection.end));
	this._field.selectionStart = selection.start;
	this._field.selectionEnd = selection.end;

	if (typeof(this.onCompleteCallback) == 'function')
	{
		this.onCompleteCallback(this._field);
	}
};
