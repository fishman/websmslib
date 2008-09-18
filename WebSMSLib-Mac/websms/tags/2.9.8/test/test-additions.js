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
 *	test-additions.js
 */

var olderVersion;
var newerVersion;
var sameNewerVersion;
var samplePlist;

function AdditionsTest()
{
	return this;
}

AdditionsTest.prototype = new UnitTest();

/**
 *	Test cases
 */

AdditionsTest.prototype.setUp = function()
{
	// All code that should run *before* the tests must go here
	olderVersion = "1.0";
	newerVersion = "1.1.1";
	sameNewerVersion = "1.1.1";
	
	samplePlist = FIXTURE_INFO_PLIST_DICTIONARY;
};

AdditionsTest.prototype.testAllKeys = function()
{
	var allKeys = FIXTURE_ADDITIONS_DICTIONARY.allKeys();
	assertEqual(allKeys[0], "foo", "Bad key");
	assertEqual(allKeys[1], "baz", "Bad key");
};

AdditionsTest.prototype.testAllValues = function()
{
	var allValues = FIXTURE_ADDITIONS_DICTIONARY.allValues();
	assertEqual(allValues[0], "bar", "Bad value");
	assertEqual(allValues[1], 1, "Bad value");
};

AdditionsTest.prototype.testKeyIterator = function()
{
	var iterator = FIXTURE_ADDITIONS_DICTIONARY.keyIterator();
	assertEqual(iterator.next(), "foo", "Bad value");
	assertEqual(iterator.next(), "baz", "Bad value");
	assertNull(iterator.next(), "Bad value");
};

AdditionsTest.prototype.testValueIterator = function()
{
	var iterator = FIXTURE_ADDITIONS_DICTIONARY.valueIterator();
	assertEqual(iterator.next(), "bar", "Bad value");
	assertEqual(iterator.next(), 1, "Bad value");
	assertNull(iterator.next(), "Bad value");
};

AdditionsTest.prototype.testKeyForValue = function()
{
	assertEqual(FIXTURE_ADDITIONS_DICTIONARY.keyForValue("bar"), "foo", "Bad dictionary key");
	assertEqual(FIXTURE_ADDITIONS_DICTIONARY.keyForValue(1), "baz", "Bad dictionary key");
	assertNull(FIXTURE_ADDITIONS_DICTIONARY.keyForValue("foo"), "Bad dictionary key");
};

AdditionsTest.prototype.testOlderThan = function()
{
	assert(olderVersion.olderThan(newerVersion), "1.0 is older than 1.1.1");
	assert(olderVersion.olderThan(sameNewerVersion), "1.0 is older than 1.1.1");
	assertFalse(newerVersion.olderThan(sameNewerVersion), "1.1.1 is not older than 1.1.1");
	assertFalse("1.1.1".olderThan("1.1.1"), "1.1.1 is not older than itself");
	assertFalse("1.1.1".olderThan("1.1.1"), "1.1.1 is not older than itself");
	assertFalse("1.1".olderThan("1.1.0"), "1.1 is not older than 1.1.0");
	assertFalse("1.1.0".olderThan("1.1"), "1.1.0 is not older than 1.1");
	assertFalse("1.0".olderThan("1"), "1.0 is not older than 1");
	assertFalse("1".olderThan("1.0"), "1 is not older than 1.0");
};

AdditionsTest.prototype.testArrayContains = function()
{
	assert([1,2,3].contains(1), "1 is contained in the array");
	assertFalse([1,2,3].contains(4), "4 is not contained in the array");
};

AdditionsTest.prototype.testArrayInsertUnique = function()
{
	var arr = [1,2,3];
	arr.insert_unique(1);
	assertEqual(arr.length, 3, "1 is already present in the array");
	arr.insert_unique(4);
	assertEqual(arr.length, 4, "4 should be added to the array");
	assert(arr.contains(4), "4 should be added to the array");
};

AdditionsTest.prototype.testRepeat = function()
{
	assertEqual("Tanto".repeat(3), "TantoTantoTanto", "Bad repetition");
	assertEqual("Tanto".repeat(1), "Tanto", "Bad repetition");
	assertEqual("Tanto".repeat(0), "", "Bad repetition");
};

AdditionsTest.prototype.testStartsWith = function()
{
	assert("Francamente".startsWith("Franca"), "Francamente starts with Franca");
	assertFalse("Pienamente".startsWith("Mario"), "Pienamente doesn't start with Mario");
};

AdditionsTest.prototype.testEndsWith = function()
{
	assert("Del Piero".endsWith("Piero"), "Del Piero ends with Piero");
	assertFalse("Roberto Baggio".endsWith("Roberto"), "Roberto Baggio doesn't end with Roberto");
};

AdditionsTest.prototype.testSubstringFromString = function()
{
	assertEqual("The book is on the table".substringFromString("book"), "book is on the table", "Bad substring");
	assertEqual("The book is on the table".substringFromString("table"), "table", "Bad substring");
};

AdditionsTest.prototype.testSubstringToString = function()
{
	assertEqual("The book is on the table".substringToString("book"), "The ", "Bad substring");
	assertEqual("The book is on the table".substringToString("table"), "The book is on the ", "Bad substring");
};

AdditionsTest.prototype.testSubstringAfterString = function()
{
	assertEqual("The book is on the table".substringAfterString("book"), " is on the table", "Bad substring");
	assertEqual("The book is on the table".substringAfterString("table"), "", "Bad substring");
};

AdditionsTest.prototype.testSprintf = function()
{
	assertEqual("%s world".sprintf("hello"), "hello world", "should greet the world");
	assertEqual("the answer is %s2".sprintf(4), "the answer is 42", "the anser is always 42");
};

AdditionsTest.prototype.testNl2br = function()
{
	assertEqual("hello\nworld!".nl2br(), "hello<br />world!", "Newlines should be replaced with <br />'s");
};

AdditionsTest.prototype.testTrim = function()
{
	assertEqual("a great day    ".trim(), "a great day", "All trailing space should be trimmed");
	assertEqual("    a great day".trim(), "a great day", "All initial space should be trimmed");
};

AdditionsTest.prototype.testCapitalize = function()
{
	assertEqual("test".capitalize(), "Test", "Ciao should be capitalized");
	assertEqual("ciao".capitalize(), "Ciao", "Ciao should be capitalized");
	assertEqual("ciao mondo".capitalize(), "Ciao Mondo", "Ciao Mondo should be capitalized");
};

AdditionsTest.prototype.testPlistToDictionary = function()
{
	var dict = samplePlist.plistToDictionary();
	assertEqual(dict["CloseBoxInsetY"], 13, "CloseBoxInsetY should be 13");
	assertEqual(dict["MainHTML"], "WebSMS.html", "MainHTML should be WebSMS.html");
};

AdditionsTest.prototype.testToQueryString = function()
{
	var qs = FIXTURE_ADDITIONS_DICTIONARY.toQueryString();
	assertEqual(qs, "foo=bar&baz=1", "Malformed query string");
};

AdditionsTest.prototype.testRot13 = function()
{
	assertEqual("condividete".rot13(), "pbaqvivqrgr", "Malformed ROT13 string");
	assertEqual("diffondere".rot13(), "qvssbaqrer", "Malformed ROT13 string");
	assertEqual("DiffonDERe".rot13(), "QvssbaQREr", "Malformed ROT13 string");
	assertEqual("123".rot13(), "123", "Malformed ROT13 string");
};

AdditionsTest.prototype.testRot13 = function()
{
	assertEqual("condividete".rot13(), "pbaqvivqrgr", "Malformed ROT13 string");
	assertEqual("diffondere".rot13(), "qvssbaqrer", "Malformed ROT13 string");
	assertEqual("DiffonDERe".rot13(), "QvssbaQREr", "Malformed ROT13 string");
	assertEqual("123".rot13(), "123", "Malformed ROT13 string");
	assertEqual("fryrpgf vafregrq bowrpgf".rot13(), "selects inserted objects", "Bad ROT13 decoding");
};

AdditionsTest.prototype.testStripTags = function()
{
	assertEqual("there are no tags here".striptags(), "there are no tags here", "Bad tag stripping");
	assertEqual("there are <strong>a lot</strong> of tags<br> <a href=\"http://here\">here</a>".striptags(), "there are a lot of tags here", "Bad tag stripping");
};

AdditionsTest.prototype.testClipToLength = function()
{
	assertEqual("a short string".clipToLength(15), "a short string", "Bad string clipping");
	assertEqual("a very very long long string".clipToLength(10), "a very ver...", "Bad string clipping");
};

AdditionsTest.prototype.testShrinkToLength = function()
{
	assertEqual("a short string".shrinkToLength(15), "a short string", "Bad string shrinking");
	assertEqual("a very very long long string".shrinkToLength(10), "a ver...tring", "Bad string shrinking");
	assertEqual("a very very long long string".shrinkToLength(11), "a ver...tring", "Bad string shrinking");
	assertEqual("a very very long long string".shrinkToLength(12), "a very...string", "Bad string shrinking");
};

AdditionsTest.prototype.testBatchReplace = function()
{
	var dict = {foo: "bar", baz: 1};
	assertEqual("a=foo&b=baz".batchReplace(dict), "a=bar&b=1", "Bad replacement");
};


AdditionsTest.prototype.testMakeCallbackTarget = function()
{
	var greet = {
		hail: function()
		{
			this.meet();
		}
	};
	var cheers = {
	 	meet: function()
		{
			assert(true, "Wrong callback results");
		}
	};
	(greet.hail.makeCallbackTarget(cheers))();
};

/**
 *	Autostart machinery
 */

window.addEventListener("load", function(e)
	{
		new AdditionsTest().run();
	},
	true);