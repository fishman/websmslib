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

function Range(location, length)
{
	this.location = location;
	this.length = length;
	// We use these for performance reasons
	this.start = location;
	this.end = location + length;
	
	return this;
}

Range.prototype.contains = function(val)
{
	return (this.location <= val &&
		val <= this.end);
};

Range.prototype.overlaps = function(range)
{
	// If the receiver overlaps <tt>range</tt>, one of its bounds
	// has to be contained into it, or viceversa.
	return (this.contains(range.start) ||
		this.contains(range.end) ||
		range.contains(this.start) ||
		range.contains(this.end));
};

Range.prototype.toString = function()
{
	return "Range(" + this.location + "," + this.length + ")";
};

function Point(x, y)
{
	this.x = x;
	this.y = y;
	
	return this;
}

Point.prototype.toString = function()
{
	return "Point(" + this.x + "," + this.y + ")";
};

function Size(width, height)
{
	this.width = width;
	this.height = height;
	
	return this;
}

Size.prototype = new Point();

function Rectangle(x, y, width, height)
{
	this.origin = new Point(x, y);
	this.size = new Size(width, height);
	
	return this;
}

Rectangle.prototype.contains = function(point)
{
	if (!(point instanceof Point))
	{
		throw point + " is not a Point";
	}
	return (new Range(this.origin.x, this.size.width).contains(point.x) ||
		new Range(this.origin.y, this.size.height).contains(point.y));
};

Rectangle.prototype.overlaps = function(rect)
{
	if (!(rect instanceof Rectangle))
	{
		throw rect + " is not a Rectangle";
	}
	return (this.contains(rect.origin) ||
		this.contains(new Point(rect.origin.x + rect.size.width, rect.origin.y)) ||
		this.contains(new Point(rect.origin.x, rect.origin.y + rect.size.height)) ||
		this.contains(new Point(rect.origin.x + rect.size.width, rect.origin.y + rect.size.height)) ||
		rect.contains(this.origin) ||
		rect.contains(new Point(this.origin.x + this.size.width, this.origin.y)) ||
		rect.contains(new Point(this.origin.x, this.origin.y + this.size.height)) ||
		rect.contains(new Point(this.origin.x + this.size.width, this.origin.y + this.size.height)));
};

Rectangle.prototype.intersectionWith = function(rect)
{
	if (!(rect instanceof Rectangle))
	{
		throw rect + " is not a Rectangle";
	}
	if (this.overlaps(rect))
	{
	}
	return null;
};
