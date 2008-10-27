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
 *	test-colors.js
 */

function ColorsTest()
{
	return this;
}

ColorsTest.prototype = new UnitTest();

/**
 *	Test cases
 */

ColorsTest.prototype.setUp = function()
{
	// All code that should run *before* the tests must go here
};

ColorsTest.prototype.testCreation = function()
{
	var color = new Color(1, 2, 3);
	assertEqual(color.red(), 1, "Bad creation");
	assertEqual(color.green(), 2, "Bad creation");
	assertEqual(color.blue(), 3, "Bad creation");
	assertEqual(color.alpha(), 1.0, "Bad creation");
	
	var color = new Color(1, 2, 3, 0.5);
	assertEqual(color.red(), 1, "Bad creation");
	assertEqual(color.green(), 2, "Bad creation");
	assertEqual(color.blue(), 3, "Bad creation");
	assertEqual(color.alpha(), 0.5, "Bad creation");
	
	var color = new Color(1000, 2000, 3000, -1);
	assertEqual(color.red(), 0, "Bad creation");
	assertEqual(color.green(), 0, "Bad creation");
	assertEqual(color.blue(), 0, "Bad creation");
	assertEqual(color.alpha(), 1.0, "Bad creation");
	
	var color = Color.colorNamed("magenta");
	assertEqual(color.red(), 255, "Bad creation");
	assertEqual(color.green(), 0, "Bad creation");
	assertEqual(color.blue(), 255, "Bad creation");
	assertEqual(color.alpha(), 1.0, "Bad creation");
};

ColorsTest.prototype.testSetters = function()
{
	var color = new Color();

	color.setRed(128);
	assertEqual(color.red(), 128, "Bad setting");
	
	color.setRed(-1);
	assertEqual(color.red(), 128, "Bad setting");
	
	color.setRed(256);
	assertEqual(color.red(), 128, "Bad setting");
	
	color.setRed(0);
	assertEqual(color.red(), 0, "Bad setting");
	
	color.setAlpha(0.1);
	assertEqual(color.alpha(), 0.1, "Bad setting");
	
	color.setAlpha(0.9);
	assertEqual(color.alpha(), 0.9, "Bad setting");
	
	color.setAlpha(1.1);
	assertEqual(color.alpha(), 0.9, "Bad setting");
	
	color.setAlpha(-10);
	assertEqual(color.alpha(), 0.9, "Bad setting");
};

ColorsTest.prototype.testDec2Hex = function()
{
	assertEqual(dec2hex(16), "10", "Bad hex conversion");
	assertEqual(dec2hex(15), "f", "Bad hex conversion");
	assertEqual(dec2hex(255), "ff", "Bad hex conversion");
	assertEqual(dec2hex(204), "cc", "Bad hex conversion");
	assertEqual(dec2hex(9), "9", "Bad hex conversion");
	assertEqual(dec2hex(128), "80", "Bad hex conversion");
};

ColorsTest.prototype.testHex2Dec = function()
{
	assertEqual(hex2dec("ff"), 255, "Bad hex conversion");
	assertEqual(hex2dec("fa"), 250, "Bad hex conversion");
	assertEqual(hex2dec("cc"), 204, "Bad hex conversion");
	assertEqual(hex2dec("c0"), 192, "Bad hex conversion");
	assertEqual(hex2dec("1"), 1, "Bad hex conversion");
	assertEqual(hex2dec("0"), 0, "Bad hex conversion");
};

ColorsTest.prototype.testColorFromHex = function()
{
	var color = Color.fromHex("#ffcc00");
	
	assertEqual(color.red(), 255, "Bad color component");
	assertEqual(color.green(), 204, "Bad color component");
	assertEqual(color.blue(), 0, "Bad color component");
	assertEqual(color.alpha(), 1.0, "Bad color component");
	
	var color = Color.fromHex("#eee");
	
	assertEqual(color.red(), 238, "Bad color component");
	assertEqual(color.green(), 238, "Bad color component");
	assertEqual(color.blue(), 238, "Bad color component");
	assertEqual(color.alpha(), 1.0, "Bad color component");
	
	var color = Color.fromHex("#80ffff00");
	
	assertEqual(color.red(), 255, "Bad color component");
	assertEqual(color.green(), 255, "Bad color component");
	assertEqual(color.blue(), 0, "Bad color component");
	assertEqual(color.alpha(), 128/255, "Bad color component");
};

ColorsTest.prototype.testColorFromRGB = function()
{
	var color = Color.fromRGB("rgb(128,255,0)");
	
	assertEqual(color.red(), 128, "Bad color component");
	assertEqual(color.green(), 255, "Bad color component");
	assertEqual(color.blue(), 0, "Bad color component");
	
	var color = Color.fromRGB("rgb( 12, 15, 255)");
	
	assertEqual(color.red(), 12, "Bad color component");
	assertEqual(color.green(), 15, "Bad color component");
	assertEqual(color.blue(), 255, "Bad color component");
};

ColorsTest.prototype.testColorFromRGBA = function()
{
	var color = Color.fromRGBA("rgba(128,255,0,1.0)");
	
	assertEqual(color.red(), 128, "Bad color component");
	assertEqual(color.green(), 255, "Bad color component");
	assertEqual(color.blue(), 0, "Bad color component");
	assertEqual(color.alpha(), 1.0, "Bad color component");
	
	var color = Color.fromRGBA("rgba( 12, 15, 255, 0.2)");
	
	assertEqual(color.red(), 12, "Bad color component");
	assertEqual(color.green(), 15, "Bad color component");
	assertEqual(color.blue(), 255, "Bad color component");
	assertEqual(color.alpha(), 0.2, "Bad color component");
};

ColorsTest.prototype.testToRGB = function()
{
	assertEqual(Color.fromHex("#ffcc00").toRGB(), "rgb(255,204,0)", "Bad color representation");
	assertEqual(Color.fromHex("#eee").toRGB(), "rgb(238,238,238)", "Bad color representation");
};

ColorsTest.prototype.testToRGBA = function()
{
	assertEqual(Color.fromHex("#ffcc00").toRGBA(), "rgba(255,204,0,1)", "Bad color representation");
	assertEqual(new Color(128, 255, 0, 0.5).toRGBA(), "rgba(128,255,0,0.5)", "Bad color representation");
};

ColorsTest.prototype.testToHex = function()
{
	assertEqual(Color.fromHex("#ffcc00").toHex(), "#ffcc00", "Bad color representation");
	assertEqual(Color.fromHex("#eee").toHex(), "#eeeeee", "Bad color representation");
};

ColorsTest.prototype.testColorNamed = function()
{
	assertEqual(Color.colorNamed("aqua").toHex(), "#00ffff", "Bad color representation");
	assertEqual(Color.colorNamed("lime").red(), 0, "Bad color representation");
	assertEqual(Color.colorNamed("teal").blue(), 128, "Bad color representation");
};

ColorsTest.prototype.testColorBetweenColors = function()
{
	assertEqual(Color.betweenColors(Color.fromHex("#404040"), Color.fromHex("#808080"), 0.5).toHex(), "#606060", "Bad color");
	assertEqual(Color.betweenColors(Color.fromHex("#404040"), Color.fromHex("#808080"), 1.0).toHex(), "#808080", "Bad color");
	assertEqual(Color.betweenColors(Color.fromHex("#404040"), Color.fromHex("#808080"), 0.0).toHex(), "#404040", "Bad color");
	assertEqual(Color.betweenColors(Color.fromHex("#404040"), Color.fromHex("#808080"), 0.25).toHex(), "#505050", "Bad color");
	
	var color = Color.betweenColors(new Color(128, 54, 10, 1.0), new Color(0, 0, 0, 0.0), 0.5);
	assertEqual(color.red(), 64, "Bad color");
	assertEqual(color.green(), 27, "Bad color");
	assertEqual(color.blue(), 5, "Bad color");
	assertEqual(color.alpha(), 0.5, "Bad color");
};

ColorsTest.prototype.testParse = function()
{
	assertEqual(Color.parse("#f0f").blue(), 255, "Bad color parsing");
	assertEqual(Color.parse("#80ff00ff").alpha(), 128/255.0, "Bad color parsing");
	assertEqual(Color.parse("rgba(128,255,0,0.5)").red(), 128, "Bad color parsing");
	assertNull(Color.parse("#ff"), "Bad color parsing");
	assertNull(Color.parse("rgb()"), "Bad color parsing");
	assertNull(Color.parse("rgba(1,2,3)"), "Bad color parsing");
};

/**
 *	Autostart machinery
 */

window.addEventListener("load", function(e)
	{
		new ColorsTest().run();
	},
	true);