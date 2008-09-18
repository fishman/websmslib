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
 *	Animation class
 *
 *	This abstract class (that actually doesn't do anything) is the base class
 *	for all animations that consist in some kind of transition between two states.
 */

function Animation(params)
{
	this.init(params);
	
	return this;
}
	
Animation.prototype.init = function(params)
{
	this._animation = {
		from: 0.0,
		to: 1.0,
		now: 1.0,
		duration: 500,
		starttime: null,
		running: false,
		runned: false,
		elements: {}
	};
	for (var i in params)
	{
		this._animation[i] = params[i];
	}
};

/**
 *	The run() method simply starts the periodic calls to _animate()
 *	Subclasses don't need to override this method
 */

Animation.prototype.run = function()
{
	if (this._animation.timer != null) {
		clearInterval(this._animation.timer);
		this._animation.timer = null;
	}

	if (this._animation.runned)
	{
		this._animation.to = 1 - this._animation.to;
		//__DEBUG("this._animation.to:" + this._animation.to);
		this._animation.from = this._animation.now;
		//__DEBUG("this._animation.from:" + this._animation.from);
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
 *	The _animate() method is the heart of the animation process.
 *	It contains the logic to calculate the current state of the animation.
 */

Animation.prototype._animate = function()
{
	var T;
	var ease;
	var time = new Date().getTime();


	T = clampTo(time - this._animation.starttime, 0, this._animation.duration);

	if (T >= this._animation.duration)
	{
		clearInterval(this._animation.timer);
		this._animation.timer = null;
		this._animation.now = this._animation.to;
		this._animation.running = false;
	}
	else
	{
		ease = 0.5 - (0.5 * Math.cos(Math.PI * T / this._animation.duration));
		this._animation.now = computeNextFloat(this._animation.from, this._animation.to, ease);
	}
	this.performAnimation();
	
	if (!this._animation.running)
		this.animationDidEnd();
};

/**
 *	The performAnimation() method is the place where the actual animation takes
 *	place. Subclassers have to override this method in order to perform custom effects.
 */

Animation.prototype.performAnimation = function()
{
	//this._animation.elements.first.style.opacity = this._animation.now;
};

/**
 *	The animationWillStart() method is called before the actual animation starts.
 *	Subclassers may override it set up elements before animating.
 */

Animation.prototype.animationWillStart = function()
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

Animation.prototype.animationDidEnd = function()
{
	if (this._animation.postflight)
	{
		this._animation.postflight();
	}
};

/**
 *	Fader animation subclass
 */

function Fader(params)
{
	this.init(params);
	
	return this;
}

Fader.prototype = new Animation();

Fader.prototype.performAnimation = function()
{
	this._animation.elements.first.style.opacity = this._animation.now;
};

Fader.prototype.animationDidEnd = function()
{
	this._animation.elements.first.style.opacity = this._animation.to;
	if (this._animation.postflight)
	{
		this._animation.postflight();
	}
};

/**
 *	Shrinker animation subclass
 */

function Shrinker(params)
{
	this.init(params);
	
	return this;
}

Shrinker.prototype = new Animation();

Shrinker.prototype.performAnimation = function()
{
	this._animation.elements.first.style.width = px(Math.round(this._animation.startwidth * (1 - this._animation.now)));
};

/**
 *	CrossFade animation subclass
 */

function CrossFade(params)
{
	/**
	 *	The CrossFade animation consists in two elements.
	 *
	 *	The first element reduces its opacity until it disappears,
	 *	while the second element increases its opacity until it completely
	 *	reveals itself.
	 */
	
	this.init(params);
	
	return this;
}

CrossFade.prototype = new Animation();

CrossFade.prototype.performAnimation = function()
{
	with (this._animation.elements.first.style)
	{
		opacity = 1.0 - this._animation.now;
	}
	with (this._animation.elements.second.style)
	{
		opacity = this._animation.now;
	}
};

CrossFade.prototype.animationWillStart = function()
{
	if (this._animation.preflight)
	{
		this._animation.preflight();
	}
	if (this._animation.to == 1.0)
	{
		this._animation.elements.second.style.display = "block";
	}
	else
	{
		this._animation.elements.first.style.display = "block";
	}
};

CrossFade.prototype.animationDidEnd = function()
{
	if (this._animation.to == 1.0)
	{
		this._animation.elements.first.style.display = "none";
	}
	else
	{
		this._animation.elements.second.style.display = "none";
	}
	if (this._animation.postflight)
	{
		this._animation.postflight();
	}
};

/**
 *	CrossBlinds animation subclass
 */

function CrossBlinds(params)
{
	/**
	 *	The CrossBlinds animation consists in two elements.
	 *
	 *	The first element reduces its width until it disappears on the left,
	 *	while the second element increases its width until it takes the
	 *	whole space left by the first one.
	 */

	this.init(params);
	
	return this;
}

CrossBlinds.prototype = new Animation();

CrossBlinds.prototype.performAnimation = function()
{
	// Size of first element
	var leftwidth = Math.round(this._animation.width * (1.0 - this._animation.now));
	// Size of second element
	var rightwidth = this._animation.width - leftwidth;
	
	with (this._animation.elements.first.style)
	{
		clip = "rect(auto auto auto " + px(rightwidth) + ")";
		left = px(-rightwidth);
	}
	with (this._animation.elements.second.style)
	{
		clip = "rect(auto " + px(rightwidth) + " auto auto)";
		left = px(leftwidth);
	}
	//__DEBUG(this._animation.to);
};

CrossBlinds.prototype.animationWillStart = function()
{
	if (this._animation.preflight)
	{
		this._animation.preflight();
	}
	if (this._animation.to == 1.0)
	{
		this._animation.elements.second.style.display = "block";
	}
	else
	{
		this._animation.elements.first.style.display = "block";
	}
};

CrossBlinds.prototype.animationDidEnd = function()
{
	if (this._animation.to == 0.0)
	{
		this._animation.elements.second.style.display = "none";
		this._animation.elements.second.style.clip = "auto";
	}
	else
	{
		this._animation.elements.first.style.display = "none";
		this._animation.elements.first.style.clip = "auto";
	}
	if (this._animation.postflight)
	{
		this._animation.postflight();
	}
};

/**
 *	Chameleon animation subclass
 */
 
function Chameleon(params)
{
	this.init(params);
	
	return this;
}

Chameleon.prototype = new Animation();

Chameleon.prototype.performAnimation = function()
{
	// Calculate color for this stage
	var color = Color.betweenColors(this._animation.startcolor, this._animation.endcolor, this._animation.now);
	
	this._animation.elements.first.style[this._animation.key] = color.toRGBA();
};

/**
 *	Utils
 */

function clampTo(value, min, max) { // constrains a value between two limits
	return value < min ? min : value > max ? max : value;
}

function computeNextFloat (from, to, ease) { // self explaining
	return from + (to - from) * ease;
}

function px(amt)
{
	return amt + "px";
}