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
 *	test-geometry.js
 *
 */

function GeometryTest()
{
	return this;
}

GeometryTest.prototype = new UnitTest();

/**
 *	Test cases
 */

GeometryTest.prototype.setUp = function()
{
	// All code that should run *before* the tests must go here
};

GeometryTest.prototype.testRangeCreation = function()
{
	var rng1 = new Range(1, 2);
	assertEqual(rng1.location, 1, "Bad range");
	assertEqual(rng1.length, 2, "Bad range");
	assertEqual(rng1.end, 3, "Bad range");
};

GeometryTest.prototype.testRangeContains = function()
{
	var rng1 = new Range(0, 10);
	assert(rng1.contains(0), "Bad range");
	assert(rng1.contains(5), "Bad range");
	assert(rng1.contains(10), "Bad range");
	assertFalse(rng1.contains(-1), "Bad range");
	assertFalse(rng1.contains(11), "Bad range");
	
	var rng2 = new Range(10, 10);
	assert(rng2.contains(10), "Bad range");
	assert(rng2.contains(15), "Bad range");
	assert(rng2.contains(20), "Bad range");
	assertFalse(rng2.contains(9), "Bad range");
	assertFalse(rng2.contains(21), "Bad range");
};

GeometryTest.prototype.testRangeOverlaps = function()
{
	var rng1 = new Range(0, 10);
	var rng2 = new Range(5, 2);
	assert(rng1.overlaps(rng1), "Ranges do overlap");
	
	assert(rng1.overlaps(rng2), "Ranges do overlap");
	assert(rng2.overlaps(rng1), "Ranges do overlap");

	var rng3 = new Range(8, 4);
	assertFalse(rng2.overlaps(rng3), "Ranges do not overlap");
	assertFalse(rng3.overlaps(rng2), "Ranges do not overlap");
	
	var rng4 = new Range(-100, 200);
	assert(rng4.overlaps(rng1), "Ranges do overlap");
	assert(rng4.overlaps(rng2), "Ranges do overlap");
	assert(rng4.overlaps(rng3), "Ranges do overlap");
	assert(rng1.overlaps(rng4), "Ranges do overlap");
	assert(rng2.overlaps(rng4), "Ranges do overlap");
	assert(rng3.overlaps(rng4), "Ranges do overlap");
};

GeometryTest.prototype.testRectangleCreation = function()
{
	var rect1 = new Rectangle(2, 4, 10, 20);
	assertEqual(rect1.origin.x, 2, "Bad rectangle");
	assertEqual(rect1.origin.y, 4, "Bad rectangle");
	assertEqual(rect1.size.width, 10, "Bad rectangle");
	assertEqual(rect1.size.height, 20, "Bad rectangle");
};

GeometryTest.prototype.testRectangleContains = function()
{
	var rect1 = new Rectangle(2, 4, 10, 20);
	var pt1 = new Point(4, 5);
	var pt2 = new Point(-1, 0);
	assert(rect1.contains(pt1), "Point is contained");
	assertFalse(rect1.contains(pt2), "Point is not contained");
};

GeometryTest.prototype.testRectangleOverlaps = function()
{
	var rect1 = new Rectangle(0, 0, 2, 2);
	var rect2 = new Rectangle(1, 1, 2, 2);
	var rect3 = new Rectangle(0, 0, 4, 4);
	var rect4 = new Rectangle(3, 3, 1, 1);
	
	assert(rect1.overlaps(rect1), "Rectangles do overlap");
	
	assert(rect1.overlaps(rect2), "Rectangles do overlap");
	assert(rect2.overlaps(rect1), "Rectangles do overlap");
	assert(rect1.overlaps(rect3), "Rectangles do overlap");
	assert(rect3.overlaps(rect1), "Rectangles do overlap");
	assert(rect3.overlaps(rect4), "Rectangles do overlap");
	assert(rect4.overlaps(rect3), "Rectangles do overlap");
	assertFalse(rect4.overlaps(rect1), "Rectangles do not overlap");
	assertFalse(rect1.overlaps(rect4), "Rectangles do not overlap");
};

GeometryTest.prototype.tearDown = function()
{
	// All code that should run *after* the tests must go here
};


/**
 *	Autostart machinery
 */

window.addEventListener("load", function(e)
	{
		new GeometryTest().run();
	},
	true);
