/**
 *	VersionChecker class
 *
 *	© Claudio Procida 2005
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
 *	Variables
 */

var vc_req = null,
	vc_onUpdate = null,
	vc_version = null,
	vc_latestVersion = null,
	vc_name = null;

/**
 *	Constants
 */

var VC_ASYNC = true,
	VC_METHOD = "GET",
	VC_URL = "http://www.emeraldion.it/software/widgets/versioncheck?name=";

/**
 *	Functions
 */
	
function VersionChecker() {

	vc_version = trim(getWidgetProperty("CFBundleVersion"));
	vc_name = getName(trim(getWidgetProperty("CFBundleIdentifier")));
	vc_onUpdate = defaultAction;

	this.async = VC_ASYNC;
	this.method = VC_METHOD;
	this.url = VC_URL + vc_name;


	this.callback = function() {
		if (req.readyState == 4) {
			if (req.status == 200) {
				vc_latestVersion = parseFloat(req.responseText);
				//__DEBUG("vc_latestVersion");
				vc_onUpdate(vc_latestVersion > vc_version, vc_name, vc_latestVersion);
			}
			else {
				alert("No response from server.");
			}
		}
	};
	
	this.onUpdateCall = function (action) {
		vc_onUpdate = action;
	};

	this.checkUpdate = function () {
		req = new XMLHttpRequest();
		req.onreadystatechange = this.callback;
		req.open(this.method, this.url, this.async);
		req.send(null);
	};
	return this;
}

function defaultAction(updateAvailable, item, version) {
	if (updateAvailable) {
		document.getElementById("updateAvailable").style.visibility = "visible";
		alert("Update available!");
	}
}

function getWidgetProperty(property) { // retrieves property from Info.plist file
	command = '/bin/sh -c "defaults read `pwd`/Info ' + property + '"';
	//__DEBUG("command");
	if (window.widget) {
		oString = widget.system(command, null).outputString;
		//__DEBUG("oString");
		return oString;
	}
	else {
		return null;
	}
}

function getName(identifier) { // extracts mywidget from com.domain.mywidget
	return identifier.substring(identifier.lastIndexOf(".") + 1);
}

function trim(str) { // removes garbage from string str
	return (new String(str)).replace(/[\r\n\s]+/g, "");
}

function __DEBUG(variable) {
	alert("<" + variable + "> : <" + eval(variable) + ">");
}