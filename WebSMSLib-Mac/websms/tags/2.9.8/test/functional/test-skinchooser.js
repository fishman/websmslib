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
 *	test-skinchooser.js
 */

function simulateClick(img)
{
	var evt = document.createEvent("MouseEvents");
	evt.initMouseEvent("click", true, true, window,
	0, 0, 0, 0, 0, false, false, false, false, 0, null);
	var canceled = !img.dispatchEvent(evt);
}

/**
 *	Mock Objects
 */
 
var phone = 
{
	skin: null,
	setSkin: function(skin)
	{
		__DEBUG(skin);
		this.skin = skin;
	}
};

/**
 *	TestCase
 */

function SkinChooserTest()
{
	return this;
}

SkinChooserTest.prototype = new UnitTest();

/**
 *	Test cases
 */

SkinChooserTest.prototype.setUp = function()
{
	// All code that should run *before* the tests must go her
};

SkinChooserTest.prototype.testSetSkin = function()
{
	simulateClick(document.getElementById('red-skin'));
	assert(document.getElementById('red-skin').src.endsWith("-on.png"), "Image not swapped");
	assertEqual(phone.skin, "red", "Skin not loaded");
	
	simulateClick(document.getElementById('white-skin'));
	assert(document.getElementById('white-skin').src.endsWith("-on.png"), "Image not swapped");
	assert(document.getElementById('red-skin').src.endsWith("-off.png"), "Image not swapped");
	assertEqual(phone.skin, "white", "Skin not loaded");
};

SkinChooserTest.prototype.testUpdateWithSkin = function()
{
	SkinChooser.updateWithSkin('green');
	assert(document.getElementById('green-skin').src.endsWith("-on.png"), "Image not swapped");
	
	SkinChooser.updateWithSkin('purple');
	assert(document.getElementById('purple-skin').src.endsWith("-on.png"), "Image not swapped");
	assert(document.getElementById('green-skin').src.endsWith("-off.png"), "Image not swapped");

};

/**
 *	Autostart machinery
 */

window.addEventListener("load", function(e)
	{
		new SkinChooserTest().run();
	},
	true);