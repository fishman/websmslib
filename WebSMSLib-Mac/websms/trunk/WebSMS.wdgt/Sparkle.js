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
 *	Constants
 */
/* XML Namespace for sparkle prefix */
var SPARKLE_XMLNS = 'http://andymatuschak.org/sparkle';
/* Asynchronous mode for XHR requests */
var SU_ASYNC = true;
/* HTTP method for XHR requests */
var SU_METHOD = 'GET';

/**
 *	@class SparkleUpdater
 *	@abstract Update checker for Sparkle appcasts.
 */
function SparkleUpdater()
{
	this.delegate = null;
}

/**
 *	@method checkUpdate
 *	@abstract Checks for availability of updates.
 *	@discussion The method fetches the Sparkle appcast RSS feed at the URL provided by the widget's
 *	<tt>SUFeedURL</tt> Info.plist key, checks if the latest version is higher than the installed
 *	version, and if affirmative, invokes <tt>advertiseUpdate</tt>.
 */
SparkleUpdater.prototype.checkUpdate = function()
{
	this.name = window.getInfoDictionaryValueForKey("CFBundleName").trim();
	this.version = window.getInfoDictionaryValueForKey("CFBundleVersion").trim();
	this.feedURL = window.getInfoDictionaryValueForKey("SUFeedURL").trim();

	var me = this;
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function()
	{
		if (xmlhttp.readyState == 4)
		{
			if (xmlhttp.status == 200)
			{
				var deliverable = new SparkleDeliverable(xmlhttp.responseXML);
				if (me.version.olderThan(deliverable.version))
				{
					__DEBUG('[SparkleUpdater] A new version of %s is available: %s (you have: %s)!'.sprintf(me.name, deliverable.version, me.version));
					
					me.advertiseUpdate(deliverable);
				}
				else
				{
					__DEBUG('[SparkleUpdater] Your version of %s is up to date.'.sprintf(me.name));
				}
			}
			else
			{
				__DEBUG('[SparkleUpdater] No response from server.');
			}
		}
	};
	xmlhttp.open(SU_METHOD, this.feedURL + "?" + {version:this.version}.toQueryString(), SU_ASYNC);
	xmlhttp.send(null);
};

/**
 *	@method setDelegate
 *	@abstract Sets the delegate of the receiver.
 *	@param delegate An object that responds to <tt>sparkleUpdateAvailable</tt>.
 */
SparkleUpdater.prototype.setDelegate = function(delegate)
{
	this.delegate = delegate;
};

/**
 *	@method advertiseUpdate
 *	@abstract Shows the presence of an update by invoking the delegate method <tt>sparkleUpdateAvailable</tt>.
 *	@param deliverable The deliverable to advertise.
 */
SparkleUpdater.prototype.advertiseUpdate = function(deliverable)
{
	// We should mimic Sparkle window here, by showing the release notes,
	// and providing buttons to apply the update, remind later or skip this version
	if (this.delegate &&
		typeof(this.delegate.sparkleUpdateAvailable) == 'function')
	{
		this.delegate.sparkleUpdateAvailable({
			version: this.version,
			latest: deliverable.version,
			releaseNotesLink: deliverable.releaseNotesLink});
	}
	else
	{
		// fall back to open release notes in default web browser
		widget.openURL(deliverable.releaseNotesLink);
	}
};

/**
 *	@class SparkleDeliverable
 *	@abstract Represents a deliverable for which an update is available.
 */
function SparkleDeliverable(xmlDoc)
{
	if (xmlDoc == null)
	{
		return null;
	}

	var item = xmlDoc.documentElement.getElementsByTagName('channel')[0].getElementsByTagName('item')[0];
	if (!item)
	{
		return null;
	}

	this.releaseNotesLink = item.getElementsByTagNameNS(SPARKLE_XMLNS, 'releaseNotesLink')[0].firstChild.nodeValue;
	
	var enclosure = item.getElementsByTagName('enclosure')[0];
	if (!enclosure)
	{
		return null;
	}
	
	this.url = enclosure.getAttribute('url');
	this.length = enclosure.getAttribute('length');
	this.md5Sum = enclosure.getAttributeNS(SPARKLE_XMLNS, 'md5Sum');
	this.version = enclosure.getAttributeNS(SPARKLE_XMLNS, 'version');
}

/**
 *	@method toString
 *	@abstract Returns a string representation of the receiver.
 */
SparkleDeliverable.prototype.toString = function()
{
	return this.releaseNotesLink + "\n" +
		this.length + "\n" +
		this.md5Sum + "\n" +
		this.version;
};