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
 *	test-template.js
 *
 *	Template for Unit Test Case
 *
 */

function MyTest()
{
	return this;
}

MyTest.prototype = new UnitTest();

/**
 *	Test cases
 */

MyTest.prototype.setUp = function()
{
	// All code that should run *before* the tests must go here
};

MyTest.prototype.testFoobar = function()
{
	assert(true, "This should not fail");
	assert(false, "This will fail");
};

MyTest.prototype.tearDown = function()
{
	// All code that should run *after* the tests must go here
};


/**
 *	Autostart machinery
 */

window.addEventListener("load", function(e)
	{
		new MyTest().run();
	},
	true);