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

var flipShown = false,
	animation = {duration:0, starttime:0, to:1.0, now:0.0, from:0.0, firstElement:null, secondElement:null, timer:null};


function animate() { // shows a glowing effect
	var T;
	var ease;
	var time = (new Date).getTime();


	T = clampTo(time-animation.starttime, 0, animation.duration);

	if (T >= animation.duration) {
		clearInterval (animation.timer);
		animation.timer = null;
		animation.now = animation.to;
	}
	else {
		ease = 0.5 - (0.5 * Math.cos(Math.PI * T / animation.duration));
		animation.now = computeNextFloat (animation.from, animation.to, ease);
	}

	animation.firstElement.style.opacity = animation.now;
	animation.secondElement.style.opacity = animation.now;
}

function mousemove (event) {
	if (!flipShown) {
		if (animation.timer != null) {
			clearInterval (animation.timer);
			animation.timer  = null;
		}

		var starttime = (new Date).getTime() - 13;

		animation.duration = 500;
		animation.starttime = starttime;
		animation.firstElement = document.getElementById ("flip");
		animation.secondElement = document.getElementById ("huh");
		animation.timer = setInterval ("animate();", 13);
		animation.from = animation.now;
		animation.to = 1.0;
		animate();
		flipShown = true;
	}
}

function mouseexit (event) {
	if (flipShown) {
		// fade in the info button
		if (animation.timer != null) {
			clearInterval (animation.timer);
			animation.timer  = null;
		}

		var starttime = (new Date).getTime() - 13;

		animation.duration = 500;
		animation.starttime = starttime;
		animation.firstElement = document.getElementById ("flip");
		animation.secondElement = document.getElementById ("huh");
		animation.timer = setInterval ("animate();", 13);
		animation.from = animation.now;
		animation.to = 0.0;
		animate();
		flipShown = false;
	}
}

function clampTo(value, min, max) { // constrains a value between two limits
	return value < min ? min : value > max ? max : value;
}

function computeNextFloat (from, to, ease) { // self explaining
	return from + (to - from) * ease;
}