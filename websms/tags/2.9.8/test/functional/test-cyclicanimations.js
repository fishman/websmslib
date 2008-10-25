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
 *	test-cyclicanimations.js
 */

/**
 *	Mock Objects
 */

/**
 *	TestCase
 */

function CyclicAnimationsTest()
{
	return this;
}

CyclicAnimationsTest.prototype = new UnitTest();

/**
 *	Test cases
 */

CyclicAnimationsTest.prototype.setUp = function()
{
	// All code that should run *before* the tests must go here
};

CyclicAnimationsTest.prototype.testBlinker = function()
{
	var blinker = new Blinker({
			now: 0.0,
			to: 1.0,
			from: 0.0,
			duration: 1000,
			elements: {
				first: document.getElementById("blinking")
			},
			preflight: function()
			{
				testRunner.pause();
				assert(true, "This will be called before the start of blinking");
				assertEqual(document.getElementById("blinking").style.opacity, 0.0, "Bad opacity");
			},
			postflight: function()
			{
				assert(true, "This will be called at the end of blinking");
				assertEqual(document.getElementById("blinking").style.opacity, 1.0, "Bad opacity");
				testRunner.resume();
			}
	});
	blinker.run();
	setTimeout(function(animator) { animator.stop(); }, 1000, blinker);
};

CyclicAnimationsTest.prototype.testGlower = function()
{
	var glower = new Glower({
			now: 0.0,
			to: 1.0,
			from: 0.0,
			duration: 1000,
			elements: {
				first: document.getElementById("glowing")
			},
			preflight: function()
			{
				testRunner.pause();
				assert(true, "This will be called before the start of glowing");
				assertEqual(document.getElementById("glowing").style.opacity, 0.0, "Bad opacity");
			},
			postflight: function()
			{
				assert(true, "This will be called at the end of glowing");
				assert(document.getElementById("glowing").style.opacity > 0.9, "Bad opacity");
				testRunner.resume();
			}
	});
	glower.run();
	setTimeout(function(animator) { animator.stop(); }, 1000, glower);
};

/**
 *	Autostart machinery
 */

window.addEventListener("load", function(e)
	{
		document.getElementById("blinker").addEventListener("click",
			function(evt)
			{
				if (this.isBlinking)
				{
					this.animator.stop();
				}
				else
				{
					if (!this.animator)
						this.animator = new Blinker({
								now: 0.0,
								to: 0.0,
								from: 1.0,
								elements: {
									first: document.getElementById("blinking")
								},
								preflight: function()
								{
									document.getElementById("blinker").value = "Stop";
								},
								postflight: function()
								{
									document.getElementById("blinker").value = "Blink!";
								}
						});
					this.animator.run();
				}
				this.isBlinking = !this.isBlinking;
			},
			false);

		document.getElementById("glower").addEventListener("click",
			function(evt)
			{
				if (this.isGlowing)
				{
					this.animator.stop();
				}
				else
				{
					if (!this.animator)
						this.animator = new Glower({
								now: 0.0,
								to: 1.0,
								from: 0.0,
								duration: 1000,
								elements: {
									first: document.getElementById("glowing")
								},
								preflight: function()
								{
									document.getElementById("glower").value = "Stop";
								},
								postflight: function()
								{
									document.getElementById("glower").value = "Glow!";
								}
						});
					this.animator.run();
				}
				this.isGlowing = !this.isGlowing;
			},
			false);
			
		new CyclicAnimationsTest().run();
	},
	true);