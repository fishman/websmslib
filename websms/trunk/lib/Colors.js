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
 *	@class Color
 *	@abstract A color in the RGBA color space.
 */
function Color(red, green, blue, alpha)
{
	this._components = [0, 0, 0, 1.0];
	
	this._setComponentAtIndex(red, 0);
	this._setComponentAtIndex(green, 1);
	this._setComponentAtIndex(blue, 2);
	this._setComponentAtIndex(alpha, 3);
}

/**
 *	@method red
 *	@abstract Returns the red component of the receiver.
 *	@result The red component of the receiver.
 */
Color.prototype.red = function()
{
	return this._componentAtIndex(0);
};

/**
 *	@method green
 *	@abstract Returns the green component of the receiver.
 *	@result The green component of the receiver.
 */
Color.prototype.green = function()
{
	return this._componentAtIndex(1);
};

/**
 *	@method blue
 *	@abstract Returns the blue component of the receiver.
 *	@result The blue component of the receiver.
 */
Color.prototype.blue = function()
{
	return this._componentAtIndex(2);
};

/**
 *	@method alpha
 *	@abstract Returns the alpha component of the receiver.
 *	@result The alpha component of the receiver.
 */
Color.prototype.alpha = function()
{
	return this._componentAtIndex(3);
};

/**
 *	@method _componentAtIndex
 *	@abstract Returns the <tt>index</tt>-th component of the receiver.
 *	@param index An integer between 0 and 3.
 *	@result The <tt>index</tt>-th component of the receiver.
 */
Color.prototype._componentAtIndex = function(index)
{
	if ([0,1,2,3].contains(index))
		return this._components[index];
	return null;
};

/**
 *	@method setRed
 *	@abstract Sets the red component of the receiver.
 *	@param val The red component of the receiver.
 */
Color.prototype.setRed = function(val)
{
	this._setComponentAtIndex(val, 0);
};

/**
 *	@method setGreen
 *	@abstract Sets the green component of the receiver.
 *	@param val The green component of the receiver.
 */
Color.prototype.setGreen = function(val)
{
	this._setComponentAtIndex(val, 1);
};

/**
 *	@method setBlue
 *	@abstract Sets the blue component of the receiver.
 *	@param val The blue component of the receiver.
 */
Color.prototype.setBlue = function(val)
{
	this._setComponentAtIndex(val, 2);
};

/**
 *	@method setAlpha
 *	@abstract Sets the alpha component of the receiver.
 *	@param val The alpha component of the receiver.
 */
Color.prototype.setAlpha = function(val)
{
	this._setComponentAtIndex(val, 3);
};

/**
 *	@method _setComponentAtIndex
 *	@abstract Sets the <tt>index</tt>-th component of the receiver to <tt>val</tt>.
 *	@param val The value of the <tt>index</tt>-th component of the receiver.
 *	@param index The index of the component to set.
 */
Color.prototype._setComponentAtIndex = function(val, index)
{
	if (([0,1,2].contains(index) &&
		val >= 0 &&
		val <= 255) ||
		(index == 3 &&
		val >= 0.0 &&
		val <= 1.0))
		this._components[index] = val;
};

/**
 *	@method toRGB
 *	@abstract Returns a CSS <tt>rgb(red, green, blue)</tt> representation of the receiver.
 *	@result A CSS <tt>rgb(red, green, blue)</tt> representation of the receiver.
 */
Color.prototype.toRGB = function()
{
	return "rgb(" + this._components.slice(0,3).join(",") + ")";
};

/**
 *	@method toRGBA
 *	@abstract Returns a CSS3 <tt>rgba(red, green, blue, alpha)</tt> representation of the receiver.
 *	@result A CSS3 <tt>rgba(red, green, blue, alpha)</tt> representation of the receiver.
 */
Color.prototype.toRGBA = function()
{
	if (!window.widget && navigator.userAgent.indexOf("Safari") == -1)
	{
		// Outside Dashboard & Safari
		return this.toRGB();
	}
	return "rgba(" + this._components.join(",") + ")";
};

/**
 *	@method fromRGBA
 *	@abstract Returns a Color object from the given <tt>rgb</tt> color representation.
 *	@param rgb A CSS3 <tt>rgba(red, green, blue, alpha)</tt> color representation.
 *	@result A Color object.
 */
Color.fromRGBA = function(rgb)
{
	var color = null;
	if (rgb.match(/^rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*[01]\.\d+\s*\)$/))
	{
		color = new Color();
		var components = rgb.substringAfterString("rgba(").substringToString(")").split(",").perform("trim");
		color.setRed(components[0]);
		color.setGreen(components[1]);
		color.setBlue(components[2]);
		color.setAlpha(components[3]);
	}
	return color;
};

/**
 *	@method fromRGB
 *	@abstract Returns a Color object from the given <tt>rgb</tt> color representation.
 *	@param rgb A CSS <tt>rgb(red, green, blue)</tt> color representation.
 *	@result A Color object.
 */
Color.fromRGB = function(rgb)
{
	var color = null;
	if (rgb.match(/^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/))
	{
		color = new Color();
		var components = rgb.substringAfterString("rgb(").substringToString(")").split(",").perform("trim");
		color.setRed(components[0]);
		color.setGreen(components[1]);
		color.setBlue(components[2]);
	}
	return color;
};

/**
 *	@method fromHex
 *	@abstract Returns a Color object from the given <tt>hex</tt> color representation.
 *	@param hex A HTML hexadecimal <tt>#RRGGBB</tt> color representation.
 *	@result A Color object.
 */
Color.fromHex = function(hex)
{
	var color = null;
	if (hex.match(/#?[0-9a-f]{3,8}$/))
	{
		color = new Color();
		if (hex.startsWith("#"))
		{
			hex = hex.substr(1);
		}
		switch (hex.length)
		{
			case 3:
				color.setRed(hex2dec(hex.substr(0,1).repeat(2)));
				color.setGreen(hex2dec(hex.substr(1,1).repeat(2)));
				color.setBlue(hex2dec(hex.substr(2,1).repeat(2)));
				break;
			case 6:
				color.setRed(hex2dec(hex.substr(0,2)));
				color.setGreen(hex2dec(hex.substr(2,2)));
				color.setBlue(hex2dec(hex.substr(4,2)));
				break;
			case 8:
				// Alpha component is the first byte
				color.setAlpha(hex2dec(hex.substr(0,2)) / 255.0);
				color.setRed(hex2dec(hex.substr(2,2)));
				color.setGreen(hex2dec(hex.substr(4,2)));
				color.setBlue(hex2dec(hex.substr(6,2)));
				break;
		}
	}
	return color;
};

/**
 *	@method toHex
 *	@abstract Returns a HTML hexadecimal <tt>#RRGGBB</tt> color representation of the receiver.
 *	@result A HTML hexadecimal <tt>#RRGGBB</tt> color representation of the receiver.
 */
Color.prototype.toHex = function()
{
	return "#" + this._components.slice(0,3).map(dec2hex).map(function(val){if (!val) return "00"; return val; }).join("");
};

/**
 *	@property namedcolors
 *	@abstract A translation table of color names to hex representations.
 */
Color.prototype.namedcolors = {
	aliceblue: 'f0f8ff',
	antiquewhite: 'faebd7',
	aqua: '00ffff',
	aquamarine: '7fffd4',
	azure: 'f0ffff',
	beige: 'f5f5dc',
	bisque: 'ffe4c4',
	black: '000000',
	blanchedalmond: 'ffebcd',
	blue: '0000ff',
	blueviolet: '8a2be2',
	brown: 'a52a2a',
	burlywood: 'deb887',
	cadetblue: '5f9ea0',
	chartreuse: '7fff00',
	chocolate: 'd2691e',
	coral: 'ff7f50',
	cornflowerblue: '6495ed',
	cornsilk: 'fff8dc',
	crimson: 'dc143c',
	cyan: '00ffff',
	darkblue: '00008b',
	darkcyan: '008b8b',
	darkgoldenrod: 'b8860b',
	darkgray: 'a9a9a9',
	darkgrey: 'a9a9a9',
	darkgreen: '006400',
	darkkhaki: 'bdb76b',
	darkmagenta: '8b008b',
	darkolivegreen: '556b2f',
	darkorange: 'ff8c00',
	darkorchid: '9932cc',
	darkred: '8b0000',
	darksalmon: 'e9967a',
	darkseagreen: '8fbc8f',
	darkslateblue: '483d8b',
	darkslategray: '2f4f4f',
	darkslategrey: '2f4f4f',
	darkturquoise: '00ced1',
	darkviolet: '9400d3',
	deeppink: 'ff1493',
	deepskyblue: '00bfff',
	dimgray: '696969',
	dimgrey: '696969',
	dodgerblue: '1e90ff',
	firebrick: 'b22222',
	floralwhite: 'fffaf0',
	forestgreen: '228b22',
	fuchsia: 'ff00ff',
	gainsboro: 'dcdcdc',
	ghostwhite: 'f8f8ff',
	gold: 'ffd700',
	goldenrod: 'daa520',
	gray: '808080',
	grey: '808080',
	green: '008000',
	greenyellow: 'adff2f',
	honeydew: 'f0fff0',
	hotpink: 'ff69b4',
	indianred: 'cd5c5c',
	indigo: '4b0082',
	ivory: 'fffff0',
	khaki: 'f0e68c',
	lavender: 'e6e6fa',
	lavenderblush: 'fff0f5',
	lawngreen: '7cfc00',
	lemonchiffon: 'fffacd',
	lightblue: 'add8e6',
	lightcoral: 'f08080',
	lightcyan: 'e0ffff',
	lightgoldenrodyellow: 'fafad2',
	lightgray: 'd3d3d3',
	lightgrey: 'd3d3d3',
	lightgreen: '90ee90',
	lightpink: 'ffb6c1',
	lightsalmon: 'ffa07a',
	lightseagreen: '20b2aa',
	lightskyblue: '87cefa',
	lightslategray: '778899',
	lightslategrey: '778899',
	lightsteelblue: 'b0c4de',
	lightyellow: 'ffffe0',
	lime: '00ff00',
	limegreen: '32cd32',
	linen: 'faf0e6',
	magenta: 'ff00ff',
	maroon: '800000',
	mediumaquamarine: '66cdaa',
	mediumblue: '0000cd',
	mediumorchid: 'ba55d3',
	mediumpurple: '9370d8',
	mediumseagreen: '3cb371',
	mediumslateblue: '7b68ee',
	mediumspringgreen: '00fa9a',
	mediumturquoise: '48d1cc',
	mediumvioletred: 'c71585',
	midnightblue: '191970',
	mintcream: 'f5fffa',
	mistyrose: 'ffe4e1',
	moccasin: 'ffe4b5',
	navajowhite: 'ffdead',
	navy: '000080',
	oldlace: 'fdf5e6',
	olive: '808000',
	olivedrab: '6b8e23',
	orange: 'ffa500',
	orangered: 'ff4500',
	orchid: 'da70d6',
	palegoldenrod: 'eee8aa',
	palegreen: '98fb98',
	paleturquoise: 'afeeee',
	palevioletred: 'd87093',
	papayawhip: 'ffefd5',
	peachpuff: 'ffdab9',
	peru: 'cd853f',
	pink: 'ffc0cb',
	plum: 'dda0dd',
	powderblue: 'b0e0e6',
	purple: '800080',
	red: 'ff0000',
	rosybrown: 'bc8f8f',
	royalblue: '4169e1',
	saddlebrown: '8b4513',
	salmon: 'fa8072',
	sandybrown: 'f4a460',
	seagreen: '2e8b57',
	seashell: 'fff5ee',
	sienna: 'a0522d',
	silver: 'c0c0c0',
	skyblue: '87ceeb',
	slateblue: '6a5acd',
	slategray: '708090',
	slategrey: '708090',
	snow: 'fffafa',
	springgreen: '00ff7f',
	steelblue: '4682b4',
	tan: 'd2b48c',
	teal: '008080',
	thistle: 'd8bfd8',
	tomato: 'ff6347',
	turquoise: '40e0d0',
	violet: 'ee82ee',
	wheat: 'f5deb3',
	white: 'ffffff',
	whitesmoke: 'f5f5f5',
	yellow: 'ffff00',
	yellowgreen: '9acd32'
};

/**
 *	@method colorNamed
 *	@abstract Returns a Color object for the named color <tt>name</tt>.
 *	@param name A valid HTML or CSS color name.
 *	@result A Color object for the named color <tt>name</tt>.
 */
Color.colorNamed = function(name)
{
	var hex = this.prototype.namedcolors[name.toLowerCase()];
	if (hex != 'undefined')
	{
		return Color.fromHex(hex);
	}
	return new Color();
};

/**
 *	@method betweenColors
 *	@abstract Returns a Color object representing an intermediate color between <tt>first</tt> and
 *	<tt>second</tt>.
 *	When <tt>position</tt> is 0, <tt>first</tt> will be returned, while when <tt>position</tt> is 1,
 *	<tt>second</tt> will be returned.
 *	@param position A float value between 0 and 1.
 *	@result A Color object representing an intermediate color between <tt>first</tt> and
 *	<tt>second</tt>.
 */
Color.betweenColors = function(first, second, position)
{
	var between = new Color();
	
	between.setRed(Math.round(first.red() * (1 - position) + second.red() * position));
	between.setGreen(Math.round(first.green() * (1 - position) + second.green() * position));
	between.setBlue(Math.round(first.blue() * (1 - position) + second.blue() * position));
	between.setAlpha(first.alpha() * (1 - position) + second.alpha() * position);
	
	return between;
};

/**
 *	@method parse
 *	@abstract Parsest the <tt>str</tt> color representation and returns a Color object.
 *	Valid color representations are hexadecimal (<tt>#RRGGBB</tt>, <tt>#RGB</tt>) and
 *	CSS (<tt>rgb(red, green, blue)</tt>, <tt>rgba(red, green, blue, alpha)</tt>).
 *	@param str A valid color representation.
 */
Color.parse = function(str)
{
	if (str.startsWith("#"))
	{
		return Color.fromHex(str);
	}
	else if (str.startsWith("rgb("))
	{
		return Color.fromRGB(str);
	}
	else if (str.startsWith("rgba("))
	{
		return Color.fromRGBA(str);
	}
	else
	{
		return null;
	}
};

var hexdigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

/**
 *	Converts a hexadecimal number to decimal
 */
function hex2dec(hex)
{
	var weight = 1;
	var dec = 0;
	while (hex.length > 0)
	{
		dec += weight * hexdigits.indexOf(hex.substring(hex.length - 1));
		weight *= 16;
		hex = hex.substr(0, hex.length - 1);
	}
	return dec;
}

/**
 *	Converts a decimal number to hexadecimal
 */
function dec2hex(dec)
{
	var hex = [];
	while (dec >= 1)
	{
		hex.unshift(hexdigits[dec % 16]);
		dec = Math.floor(dec / 16);
	}
	return hex.join("");
}