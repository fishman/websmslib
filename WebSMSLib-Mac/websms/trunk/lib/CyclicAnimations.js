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
 */

/**
 *	CyclicAnimation class
 *
 *	This abstract class (that actually doesn't do anything) is the base class
 *	for all animations that consist in an uninterrupted, cyclic animation
 */

function CyclicAnimation(params)
{
	this.init(params);
	
	return this;
}

CyclicAnimation.prototype = new Animation();

/**
 *	The run() method simply starts the periodic calls to _animate()
 *	Subclasses don't need to override this method
 */

CyclicAnimation.prototype.run = function()
{
	if (this._animation.timer != null) {
		clearInterval(this._animation.timer);
		this._animation.timer = null;
	}

	if (this._animation.runned)
	{
		var to = this._animation.to;
		this._animation.to = this._animation.from;
		this._animation.from = to;
	}
	
	this.animationWillStart();

	this._animation.running = true;
	this._animation.runned = true;

	var starttime = new Date().getTime() - 13;

	this._animation.starttime = starttime;
	this._animation.timer = setInterval(function(animator)
		{
			animator._animate();
		},
		13,
		this);
		
	this._animate();
};

/**
 *	Call the stop() method when you want to stop the animation.
 *	CyclicAnimation class will never stop to call _animate() otherwise.
 */
 
CyclicAnimation.prototype.stop = function()
{
	clearInterval(this._animation.timer);
	this.animationDidEnd();
};

/**
 *	The _animate() method is the heart of the animation process.
 *	It contains the logic to calculate the current state of the animation.
 */

CyclicAnimation.prototype._animate = function()
{
	var T;
	var ease;
	var time = new Date().getTime();

	T = time - this._animation.starttime;
	
	ease = 0.5 - (0.5 * Math.cos(Math.PI * T / this._animation.duration));
	this._animation.now = computeNextFloat(this._animation.from, this._animation.to, ease);

	this.performAnimation();
};

/**
 *	The performAnimation() method is the place where the actual animation takes
 *	place. Subclassers have to override this method in order to perform custom effects.
 */

CyclicAnimation.prototype.performAnimation = function()
{
	//this._animation.elements.first.style.opacity = this._animation.now;
};

/**
 *	The animationWillStart() method is called before the actual animation starts.
 *	Subclassers may override it set up elements before animating.
 */

CyclicAnimation.prototype.animationWillStart = function()
{
	if (this._animation.preflight)
	{
		this._animation.preflight();
	}
};

/**
 *	The animationDidEnd() method is called after the animation has ended.
 *	Subclassers may override it restore elements after animating.
 */

CyclicAnimation.prototype.animationDidEnd = function()
{
	if (this._animation.postflight)
	{
		this._animation.postflight();
	}
};

function Blinker(params)
{
	this.init(params);
	
	return this;
}

Blinker.prototype = new CyclicAnimation();

Blinker.prototype.performAnimation = function()
{
	this._animation.elements.first.style.opacity = Math.round(this._animation.now);
};

function Glower(params)
{
	this.init(params);
	
	return this;
}

Glower.prototype = new CyclicAnimation();

Glower.prototype.performAnimation = function()
{
	this._animation.elements.first.style.opacity = this._animation.now;
};