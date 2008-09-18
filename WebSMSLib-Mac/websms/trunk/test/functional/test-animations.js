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
 *	test-animations.js
 */

/**
 *	Mock Objects
 */

/**
 *	TestCase
 */

function AnimationsTest()
{
	return this;
}

AnimationsTest.prototype = new UnitTest();

/**
 *	Test cases
 */

AnimationsTest.prototype.setUp = function()
{
	// All code that should run *before* the tests must go here
};

AnimationsTest.prototype.testFader = function()
{
	new Fader({
			now: 0.0,
			to: 1.0,
			from: 0.0,
			duration: 1000,
			elements: {
				first: document.getElementById("fading0")
			},
			preflight: function()
			{
				testRunner.pause();
				assert(true, "This will be called before the start of fading");
				assertEqual(document.getElementById("fading0").style.opacity, 0.0, "Bad opacity");
			},
			postflight: function()
			{
				assert(true, "This will be called at the end of fading");
				assertEqual(document.getElementById("fading0").style.opacity, 1.0, "Bad opacity");
				testRunner.resume();
			}
	}).run();
};

AnimationsTest.prototype.testShrinker = function()
{
	new Shrinker({
			now: 0.0,
			to: 1.0,
			from: 0.0,
			duration: 1000,
			elements: {
				first: document.getElementById("shrinking0")
			},
			startwidth: document.getElementById("shrinking0").offsetWidth,
			preflight: function()
			{
				testRunner.pause();
				assert(true, "This will be called before the start of shrinking");
			},
			postflight: function()
			{
				assert(true, "This will be called at the end of shrinking");
				assertEqual(document.getElementById("shrinking0").style.width, px(0), "Bad width");
				testRunner.resume();
			}
	}).run();
};

AnimationsTest.prototype.testCrossBlinds = function()
{
	var final_width = document.getElementById("crossblind0").offsetWidth;
	new CrossBlinds({
			elements:
			{
				first: document.getElementById("crossblind0"),
				second: document.getElementById("crossblind1")
			},
			width: final_width,
			preflight: function()
			{
				testRunner.pause();
				assert(true, "This will be called before the start of crossblinding");
			},
			postflight: function()
			{
				assert(true, "This will be called at the end of crossblinding");
				assertEqual(document.getElementById("crossblind0").style.clip, "rect(auto, auto, auto, auto)", "Bad clip style");
				assertEqual(document.getElementById("crossblind0").style.display, "none", "Bad display style");
				assertEqual(document.getElementById("crossblind1").style.clip, "rect(auto, " + px(final_width) + ", auto, auto)", "Bad clip style");
				assertEqual(document.getElementById("crossblind1").style.display, "block", "Bad display style");
				testRunner.resume();
			}
	}).run();
};

AnimationsTest.prototype.testCrossFade = function()
{
	new CrossFade({
			elements:
			{
				first: document.getElementById("crossfade0"),
				second: document.getElementById("crossfade1")
			},
			preflight: function()
			{
				testRunner.pause();
				assert(true, "This will be called before the start of crossfading");
			},
			postflight: function()
			{
				assert(true, "This will be called at the end of crossfading");
				assertEqual(document.getElementById("crossfade0").style.opacity, 0.0, "Bad opacity style");
				assertEqual(document.getElementById("crossfade0").style.display, "none", "Bad display style");
				assertEqual(document.getElementById("crossfade1").style.opacity, 1.0, "Bad opacity style");
				assertEqual(document.getElementById("crossfade1").style.display, "block", "Bad display style");
				testRunner.resume();
			}
	}).run();
};

AnimationsTest.prototype.testChameleon = function()
{
	new Chameleon({
			startcolor: new Color(255, 0, 255),
			endcolor: new Color(255, 255, 0),
			elements:
			{
				first: document.getElementById("chameleon0")
			},
			key: "backgroundColor",
			preflight: function()
			{
				testRunner.pause();
				assert(true, "This will be called before the start of chameleon");
			},
			postflight: function()
			{
				assert(true, "This will be called at the end of chameleon");
				assertEqual(Color.fromRGB(document.getElementById("chameleon0").style.backgroundColor).red(), 255, "Bad final color");
				assertEqual(Color.fromRGB(document.getElementById("chameleon0").style.backgroundColor).green(), 255, "Bad final color");
				assertEqual(Color.fromRGB(document.getElementById("chameleon0").style.backgroundColor).blue(), 0, "Bad final color");

				document.getElementById("chameleon0").style.border = "6px solid rgb(255, 255, 0)";
				new Chameleon({
						startcolor: new Color(255, 255, 0, 255),
						endcolor: new Color(192, 40, 0, 128),
						elements:
						{
							first: document.getElementById("chameleon0")
						},
						key: "borderColor",
						preflight: function()
						{
							assert(true, "This will be called before the start of chameleon");
						},
						postflight: function()
						{
							assert(true, "This will be called at the end of chameleon");
							assertEqual(Color.fromRGB(document.getElementById("chameleon0").style.borderColor).red(), 192, "Bad final color");
							assertEqual(Color.fromRGB(document.getElementById("chameleon0").style.borderColor).green(), 40, "Bad final color");
							assertEqual(Color.fromRGB(document.getElementById("chameleon0").style.borderColor).blue(), 0, "Bad final color");
							document.getElementById("chameleon0").style.border = "none";
							testRunner.resume();
						}
				}).run();
			}
	}).run();
};

/**
 *	Autostart machinery
 */

window.addEventListener("load", function(e)
	{
		document.getElementById("fader0").addEventListener("click",
			function(evt)
			{
				if (!this.animator)
					this.animator = new Fader({now: 0.0, to: 1.0, from: 0.0, elements: {first: document.getElementById("fading0")}});
				this.animator.run();
			},
			false);
		document.getElementById("shrinker0").addEventListener("click",
			function(evt)
			{
				if (!this.animator)
					this.animator = new Shrinker({elements: {first: document.getElementById("shrinking0")}, startwidth: document.getElementById("shrinking0").offsetWidth});
				this.animator.run();
			},
			false);
		document.getElementById("crosser0").addEventListener("click",
			function(evt)
			{
				if (!this.animator)
					this.animator = new CrossBlinds(
						{
							elements:
							{
								first: document.getElementById("crossblind0"),
								second: document.getElementById("crossblind1")
							},
							width: document.getElementById("crossblind0").offsetWidth
						});
				this.animator.run();
			},
			false);
		document.getElementById("crosser1").addEventListener("click",
			function(evt)
			{
				if (!this.animator)
					this.animator = new CrossFade(
						{
							elements:
							{
								first: document.getElementById("crossfade0"),
								second: document.getElementById("crossfade1")
							}
						});
				this.animator.run();
			},
			false);
		
		new AnimationsTest().run();
	},
	true);