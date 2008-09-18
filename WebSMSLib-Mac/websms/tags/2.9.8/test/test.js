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
 *	test.js
 *
 *	Unit test framework
 *	Testing is wonderful!
 */

var errorCount = 0;
var assertionFailed = 0;
var assertionPerformed = 0;
var testPerformed = 0;
var testStartedOn = null;

var testRunner = null;

function UnitTest()
{
	this._shouldStop = false;
	this._testCases = [];
	this._currentTestCase = 0;
	
	return this;
}

UnitTest.prototype.setUp = function()
{
	// All code that should run *before* the tests must go here
};

UnitTest.prototype.tearDown = function()
{
	// All code that should run *after* the tests must go here
};

UnitTest.prototype.pause = function()
{
	//this._updateStatusIndicator("");
	this._shouldStop = true;
};

UnitTest.prototype.resume = function()
{
	this._shouldStop = false;
	this._run();
};

UnitTest.prototype.run = function()
{
	this._init();
	
	testStartedOn = new Date().getTime();
	
	for (var i in this)
	{
		if (typeof(this[i]) == "function" && i.match(/^test/))
		{
			this._testCases.push({name: i, test: this[i]});
		}
	}
	this._updateStatusIndicator("test-running");
	
	this._run();
};

UnitTest.prototype._updateStatusIndicator = function(status)
{
	document.getElementsByTagName("h1")[0].className = status;
	return;
	setTimeout(function(status)
		{
			document.getElementsByTagName("h1")[0].className = status;
		},
		0,
		status);
};

UnitTest.prototype._init = function()
{
	testRunner = this;
	
	// Initialization of test suite
	var scripts = document.getElementsByTagName("script");
	for (var i = 0; i < scripts.length; i++)
	{
		if (scripts[i].src)
		{
			if (document.getElementById("scripts-list"))
				document.getElementById("scripts-list").appendChild(createScriptItem(scripts[i].src));
		}
	}
};

UnitTest.prototype._run = function()
{
	while (this._currentTestCase < this._testCases.length)
	{
		if (this._shouldStop)
		{
			return;
		}
		
		this._performTestCase();
		this._currentTestCase++;

		if (this._shouldStop)
		{
			return;
		}
	}
	
	this._showTestResults();
};

UnitTest.prototype._performTestCase = function()
{
	// Setup fixtures
	this.setUp();

	testOutputMessage("Running <a href=\"#\" onclick=\"alert(testRunner._testCases[" + this._currentTestCase + "].test); return false\">" + this._testCases[this._currentTestCase].name + "</a>");
	this._testCases[this._currentTestCase].test.apply(this);
	testPerformed++;
	
	// Release fixtures
	this.tearDown();
};

UnitTest.prototype._showTestResults = function()
{
	this._updateStatusIndicator(assertionFailed + errorCount ? "test-failed" : "test-succeeded");
	
	testOutputMessage("Finished in " + (new Date().getTime() - testStartedOn) / 1000 + " seconds");
	
	testOutputMessage("Performed " +
		testPerformed + " tests, " +
		assertionPerformed + " assertions, " +
		assertionFailed + " failed, " +
		errorCount + " errors.");
};

/**
 *	Assertions
 */

function assert(val, message)
{
	try
	{
		assertionPerformed++;
		if (!val)
		{
			testOutputMessage("Assertion failed: " + message);
			assertionFailed++;
			return;
		}
		testOutputMessage("*");
	}
	catch (e)
	{
		error(e);
	}
}

function assertFalse(val, message)
{
	try
	{
		assert(!val, message);
	}
	catch (e)
	{
		error(e);
	}
}

function assertEqual(obj, val, message)
{
	try
	{
		assert((obj == val), message + "; expecting " + val + " but found " + obj + " instead");
	}
	catch (e)
	{
		error(e);
	}
}

function assertEqualStrict(obj, val, message)
{
	try
	{
		assert((obj === val), message + "; expecting " + val + " but found " + obj + " instead");
	}
	catch (e)
	{
		error(e);
	}
}

function assertNull(obj, message)
{
	try
	{
		assertEqual(obj , null, message + "; not null");
	}
	catch (e)
	{
		error(e);
	}
}

function assertNotNull(obj, message)
{
	try
	{
		assert((obj != null), message + "; received null");
	}
	catch (e)
	{
		error(e);
	}
}

function assertInstanceOf(obj, aClass, message)
{
	try
	{
		assert((obj instanceof aClass), message + "; expecting " + aClass);
	}
	catch (e)
	{
		error(e);
	}
}

function assertTypeOf(obj, type, message)
{
	try
	{
		assertEqual(typeof(obj), type, message);
	}
	catch (e)
	{
		error(e);
	}
}

function assertTag(tagDict, message)
{
	try
	{
		var element = null;
		var collection = null;
		if (tagDict.id)
		{
			element = document.getElementById(tagDict.id);
			assertNotNull(element, "No element with given id");
		}
		if (tagDict.tag)
		{
			if (element)
			{
				assertTagNameEqual(element, tagDict.tag, "The element with given id has not the requested tag name");
			}
			else
			{
				assertNotNull(document.getElementsByTagName(tagDict.tag), "No elements with given tag name");
			}
		}
		if (tagDict.value)
		{
			if (element)
			{
				assertEqual(element.value, tagDict.value, "The element with given id has not the requested value");
			}
			else
			{
				var valued = null;
				for (var i = 0; i < collection.length; i++)
				{
					if (collection[i].value == tagDict.value)
						valued = collection[i];
				}
				assertNotNull(valued, "No elements with given tag name have the requested value");
			}
		}
		if (tagDict.attributes)
		{
			var iterator = tagDict.attributes.keyIterator();
			for (var attr; attr = iterator.next(); )
			{
				if (element)
				{
					assertEqual(element.getAttribute(attr), tagDict.attributes[attr], "The element with given id has not the requested attribute");
				}
				else
				{
					var valued = null;
					for (var i = 0; i < collection.length; i++)
					{
						if (collection[i].getAttribute(attr) == tagDict.attributes[attr])
							valued = collection[i];
					}
					assertNotNull(valued, "No elements with given tag name have the requested attribute");
				}

			}
		}

	}
	catch (e)
	{
		error(e);
	}
}

function assertTagNameEqual(element, tagname, message)
{
	try
	{
		assertEqual(element.tagName.toLowerCase(), tagname.toLowerCase(), message);
	}
	catch (e)
	{
		error(e);
	}
}

function error(e)
{
	testOutputMessage("Error: " + e);
	errorCount++;
}

function testOutputMessage(message)
{
	document.getElementById("test-messages").innerHTML += message + "<br />";
}

function __DEBUG(message)
{
	document.getElementById("debug-messages").innerHTML += message + "<br />";
}

function createScriptItem(src)
{
	var item = document.createElement("li");
	var link = document.createElement("a");
	link.setAttribute("href", src);
	link.appendChild(document.createTextNode(src.substring(src.lastIndexOf("/") + 1)));
	item.appendChild(link);
	return item;
}