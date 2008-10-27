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
 *	test-autocompletion.js
 */
 
function simulateKeyUp(field)
{
	// Adapted from YUI library
	var evt;
	var charCode = field.value.substring(field.value.length - 1).charCodeAt(0);
	try
	{
		//try to create key event
                evt = document.createEvent("KeyEvents");
                evt.initKeyEvent("keyup", true, true, window, false, false, false, false, charCode, charCode);       
	}
	catch (ex)
	{
                try
		{
			//try to create generic event - will fail in Safari 2.x
			evt = document.createEvent("Events");
                }
		catch (uierror)
		{
			//the above failed, so create a UIEvent for Safari 2.x
			evt = document.createEvent("UIEvents");
		}
		finally
		{
			evt.initEvent("keyup", true, true);
			//initialize
			evt.view = window;
			evt.altKey = false;
			evt.ctrlKey = false;
			evt.shiftKey = false;
			evt.metaKey = false;
			evt.keyCode = charCode;
			evt.charCode = charCode;
		}
	}
	var canceled = !field.dispatchEvent(evt);
}

/**
 *	Mock Objects
 */

/**
 *	TestCase
 */

function AutocompletionTest()
{
	this.field = document.getElementById("the_field");
	return this;
}

AutocompletionTest.prototype = new UnitTest();

/**
 *	Test cases
 */

AutocompletionTest.prototype.setUp = function()
{
	// All code that should run *before* the tests must go her
};

AutocompletionTest.prototype.testCompletion = function()
{
	this.field.value = "Cocoa";
	simulateKeyUp(this.field);
	assertEqual(this.field.value, "Cocoalicious", "Bad autocompletion");
	assertEqual(this.field.selectionStart, "Cocoa".length, "Bad autocompletion");
	assertEqual(this.field.selectionEnd, this.field.selectionStart, "Bad autocompletion");

	this.field.value = "Paranzio";
	simulateKeyUp(this.field);
	assertEqual(this.field.value, "Paranziolicious", "Bad autocompletion");
	assertEqual(this.field.selectionStart, "Paranzio".length, "Bad autocompletion");
	assertEqual(this.field.selectionEnd, this.field.selectionStart, "Bad autocompletion");
};

// Testing is also useful to avoid regression
AutocompletionTest.prototype.testZeroKey = function()
{
	this.field.value = "0";
	simulateKeyUp(this.field);
	assertEqual(this.field.value, "0licious", "Bad autocompletion");
	assertEqual(this.field.selectionStart, "0".length, "Bad autocompletion");
	assertEqual(this.field.selectionEnd, this.field.selectionStart, "Bad autocompletion");	
};

/**
 *	Autostart machinery
 */

window.addEventListener("load", function(e)
	{
		var field = document.getElementById("the_field");
		field.autocompletion = new Autocompletion(field);
		field.autocompletion.lookupCallback = function(val)
		{
			// Adds "licious" to everything it is passed
			// Cheers for the Delicious generation!
			return val + "licious";
		};
		
		new AutocompletionTest().run();
	},
	true);
