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
 *	test-message.js
 */

/**
 *	Mock Objects
 */

var widget = 
{
	system: function(cmd, callback)
	{
		var result;
		if (cmd.indexOf("bin/save_message.sh ") == 0)
		{
			saveResult = true;
		}
		else if (cmd.indexOf("bin/load_message.sh ") == 0)
		{
			result = "To: +3912345678\rDate: 2008-02-04 10:27:12\rText: Hello again!";
		}

		this.outputString = result;
		if (callback)
		{
			callback(this);
		}
		else
		{
			return this;
		}
	},
	_result: null
};

var message;
var saveResult;

function MessageTest()
{
	return this;
}

MessageTest.prototype = new UnitTest();

/**
 *	Test cases
 */

MessageTest.prototype.setUp = function()
{
	// All code that should run *before* the tests must go here
	message = new Message();
};

MessageTest.prototype.testRecipient = function()
{
	message.setPropertyForKey("+39123456789", "to");
	assertEqual(message.propertyForKey("to"), "+39123456789", "Recipient should be +39123456789");
};

MessageTest.prototype.testSender = function()
{
	message.setPropertyForKey("+39987654321", "from");
	assertEqual(message.propertyForKey("from"), "+39987654321", "Sender should be +39987654321");
};

MessageTest.prototype.testBogusSender = function()
{
	//assertRaise(message.setPropertyForKey("+39abcdefg", "from"));
};

MessageTest.prototype.testWellFormedness = function()
{
	assert(!message.isWellFormed(), "Message should not be well formed");

	message.setPropertyForKey("+39123456789", "to");
	message.setPropertyForKey("+39987654321", "from");
	message.setPropertyForKey("hello world", "text");
	assert(message.isWellFormed(), "Message should be well formed");

	message.setMaxLength(10);
	assertEqual(message.propertyForKey("maxLength"), 10, "Max length should be 10");
	assertEqual(message.maxLength(), 10, "Max length should be 10");
	assert(!message.isWellFormed(), "Message should not be well formed");

	message.setPropertyForKey("hello", "text");
	assert(message.isWellFormed(), "Message should be well formed");
};

MessageTest.prototype.testSignPresence = function()
{
	assert(!message.isWellFormed(), "Message should not be well formed");

	message.setPropertyForKey("+39123456789", "to");
	message.setPropertyForKey("", "from");
	message.setPropertyForKey("hello world", "text");
	assert(message.isWellFormed(), "Message should be well formed");
};

MessageTest.prototype.testSave = function()
{
	message.setPropertyForKey("+39123456789", "to");
	message.setPropertyForKey("+39987654321", "from");
	message.setPropertyForKey("hello world", "text");
	message.save("bogus", new Date().getTime());	

	assert(saveResult, "Message has not been saved");
};

MessageTest.prototype.testLoad = function()
{
	message = Message.load("plugin", "123456789");

	assertEqual(message.propertyForKey("to"), "+3912345678", "Bad message property");
	assertEqual(message.propertyForKey("text"), "Hello again!", "Bad message property");
};

MessageTest.prototype.testToString = function()
{
	message = Message.load("plugin", "123456789");
	message.setPropertyForKey("adelmo", "from");
	message.setMaxLength(123);

	__DEBUG(message.toString());
	assertEqual(message.toString(), "to:+3912345678\nfrom:adelmo\ntext:Hello again!\nmaxLength:123", "Bad string representation");
};

MessageTest.prototype.tearDown = function()
{
	// All code that should run *after* the tests must go here
};


/**
 *	Autostart machinery
 */

window.addEventListener("load", function(e)
	{
		new MessageTest().run();
	},
	true);