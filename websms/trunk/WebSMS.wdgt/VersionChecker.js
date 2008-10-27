/**
 *	VersionChecker class
 *
 *	© Claudio Procida 2005-2008
 *	http://www.emeraldion.it
 *
 *	Disclaimer
 *
 *	The VersionChecker class software (from now, the "Software") and the accompanying materials
 *	are provided “AS IS” without warranty of any kind. IN NO EVENT SHALL THE AUTHOR(S) BE
 *	LIABLE TO ANY PARTY FOR DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES,
 *	INCLUDING LOST PROFITS, ARISING OUT OF THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN
 *	IF THE AUTHOR(S) HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. The entire risk as to
 *	the results and performance of this software is assumed by you. If the software is
 *	defective, you, and not the author, assume the entire cost of all necessary servicing,
 *	repairs and corrections. If you do not agree to these terms and conditions, you may not
 *	install or use this software.
 */

/**
 *	Variables
 */

/**
 *	Constants
 */

var VC_ASYNC = true;
var VC_METHOD = "GET";
var VC_URL = "http://www.emeraldion.it/software/widgets/versioncheck/";

/**
 *	VersionChecker class
 */

function VersionChecker()
{
	this.version = window.getInfoDictionaryValueForKey("CFBundleVersion").trim();
	this.name = window.getInfoDictionaryValueForKey("CFBundleIdentifier").match(/\.([^\.]+)$/)[1].trim();
	this.didFetchLatestVersion = didFetchLatestVersionCallback;

	this.checkUpdate = function ()
	{
		var xmlhttp = new XMLHttpRequest();
		var me = this;
		xmlhttp.onreadystatechange = function()
		{
			if (xmlhttp.readyState == 4)
			{
				if (xmlhttp.status == 200)
				{
					var matches = xmlhttp.responseText.match(/^\d+(\.\d+)*$/);
					if (matches[0])
					{
						me.latestVersion = matches[0];
						__DEBUG('[VersionChecker] Latest version is %s'.sprintf(me.latestVersion));
						me.didFetchLatestVersion(me.version.olderThan(me.latestVersion),
							me.name,
							me.latestVersion);
					}
					else
					{
						alert("[VersionChecker] Bad version number");
					}
				}
				else {
					alert("[VersionChecker] No response from server.");
				}
			}
		};
		xmlhttp.open(VC_METHOD, VC_URL + this.name + "?" + {version:this.version}.toQueryString(), VC_ASYNC);
		xmlhttp.send(null);
	};
	return this;
}

/**
 *	Callback functions should have the following signature
 */

function didFetchLatestVersionCallback(updateAvailable, item, version)
{
	if (updateAvailable)
	{
		alert("Update available!");
	}
}