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
 *	Proxy singleton
 */

var Proxy = {
	proxyHost: "",
	proxyPort: 1080,
	proxyType: "none",
	proxyUsername: "",
	proxyPassword: "",
	proxyAuth: "basic",
	inUse: function()
	{
		return this.proxyType != 'none';
	},
	enable: function(enabled)
	{
		document.getElementById("proxyAuthList").disabled = !enabled;
		document.getElementById("proxyHostField").disabled = !enabled;
		document.getElementById("proxyPortField").disabled = !enabled;
		document.getElementById("proxyUsernameField").disabled = !enabled;
		document.getElementById("proxyPasswordField").disabled = !enabled;
	},
	update: function(sender)
	{
		var property = sender.id.match(/(.*)(List|Field)/)[1];
		this[property] = sender.value;
	},
	saveSettings: function()
	{
		for (var i in this)
		{
			if (i.indexOf('proxy') == 0)
			{
				widget.setPreferenceForKey(this[i], i);
			}
		}
	},
	loadSettings: function()
	{
		for (var i in this)
		{
			var pref;
			if (i.indexOf('proxy') == 0)
			{
				if (pref = widget.preferenceForKey(i))
				{
					this[i] = pref;
				}
			}
		}
		var list = document.getElementById("proxyAuthList");
		for (var i = 0; i < list.options.length; i++)
		{
			list.options[i].selected = (this.proxyAuth == list.options[i].value);
		}
		list = document.getElementById("proxyTypeList");
		for (var i = 0; i < list.options.length; i++)
		{
			list.options[i].selected = (this.proxyType == list.options[i].value);
		}
		document.getElementById("proxyHostField").value = this.proxyHost;
		document.getElementById("proxyPortField").value = this.proxyPort;
		document.getElementById("proxyUsernameField").value = this.proxyUsername;
		document.getElementById("proxyPasswordField").value = this.proxyPassword;
		this.enable(this.proxyType != 'none');
	},
	curlOptions: function()
	{
		var curlString = null;
		if (this.inUse())
		{
			curlString = ' --' + this.proxyType + ' ' + this.proxyHost + ':' + this.proxyPort;
			if (this.proxyUsername && this.proxyPassword)
			{
				curlString += ' --proxy-' + this.proxyAuth +
					' --proxy-user ' + this.proxyUsername + ':' + this.proxyPassword;
			}
		}
		return curlString;
	},
	toString: function()
	{
		return "proxyHost:" + this.proxyHost + "\n" + 
			"proxyPort: " + this.proxyPort + "\n" +
			"proxyType: " + this.proxyType + "\n" +
			"proxyUsername: " + this.proxyUsername + "\n" +
			"proxyPassword: " + this.proxyPassword + "\n" +
			"proxyAuth: " + this.proxyAuth;
	}
};