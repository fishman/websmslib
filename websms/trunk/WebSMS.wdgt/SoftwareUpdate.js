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
 *	Changelog
 *	---------
 *  2007-11-06	Improved UI effects (auto scrolling, exclude plugins already updated from update)
 *
 */


var SU_CHECK_AT_STARTUP_KEY = "Check at startup";
var SU_PLUGIN_REPOSITORY_URL = "http://tetra.emeraldion.it/websms/plugins/%s.conf.js";

var SUUpdater = {
	updatePool: [],
	checkPool: [],
	updateButton: null,
	checkButton: null,
	init: function()
	{		
		this._clear();
		this._populate();

		if (widget.preferenceForKey(SU_CHECK_AT_STARTUP_KEY))
			this.checkUpdates();
	},
	checkUpdates: function()
	{
		// Disable check button
		this.checkButton.setEnabled(false);
		this._clear();
		this._populate();
		var iterator = Plugins.keyIterator();
		for (var plugin; plugin = iterator.next(); )
		{
			this.checkPool.push(plugin);
		}
		this.checkPlugin(this.checkPool.shift());
	},
	checkPlugin: function(plugin)
	{
		var cmd = "/usr/bin/curl -s " + SU_PLUGIN_REPOSITORY_URL.sprintf(plugin) + " | /usr/bin/grep version:";
		//var cmd = "bin/checkplugin.sh " + plugin;
		
		var task = widget.system(cmd, function()
		{
			if (task.status != 0)
			{
				__DEBUG("[SUUpdater] curl status:" + task.status + ", error: " + task.errorString);

				// Disable checkbox
				document.getElementById("su_" + plugin + "_checkbox").disabled = true;
				// Update list
				document.getElementById("su_" + plugin + "_latestversion").innerHTML =
					'<span style="color:red">%s</span>'.sprintf(getLocalizedString("N/A"));
				// Set latest version to curren plugin version
				Plugins[plugin].latestVersion = Plugins[plugin].version;
			}
			else
			{
				latest = task.outputString.match(/\d+(\.\d+)*/)[0];
			
				__DEBUG("[SUUpdater] Latest version of plugin " + plugin + " is " + latest);
			
				// Update plugin
				Plugins[plugin].latestVersion = latest;

				// Update list
				document.getElementById("su_" + plugin + "_latestversion").innerHTML =
					latest;

				var shouldUpdate = Plugins[plugin].version.olderThan(latest);
				// Enable the update button
				SUUpdater.updateButton.setEnabled(SUUpdater.updateButton.enabled || shouldUpdate);

				// Enable checkbox
				document.getElementById("su_" + plugin + "_checkbox").disabled = !shouldUpdate;
				// Mark for update
				document.getElementById("su_" + plugin + "_checkbox").checked = shouldUpdate;
			}
			// Bring the plugin item into view
			document.getElementById("su_" + plugin + "_label").scrollIntoView(false);
			// Proceed to next
			if (SUUpdater.checkPool.length > 0)
			{
				SUUpdater.checkPlugin(SUUpdater.checkPool.shift());
			}
			else
			{
				// Enable check button
				SUUpdater.checkButton.setEnabled(true);
			}				
		});
	},
	performUpdate: function()
	{
		var iterator = Plugins.keyIterator();
		for (var plugin; plugin = iterator.next(); )
		{
			if (Plugins[plugin].version.olderThan(Plugins[plugin].latestVersion) &&
				document.getElementById("su_" + plugin + "_checkbox").checked)
			{
				__DEBUG("[SUUpdater] Going to update " + plugin);
				this.updatePool.push(plugin);
			}
		}
		if (this.updatePool.length > 0)
		{
			this.updatePlugin(this.updatePool.shift());
		}
	},
	updatePlugin: function(plugin)
	{
		var task = widget.system("bin/suupdater.sh " + plugin, function()
		{
			// Visual feedback
			// Force evaluation of plugin code
			var cmd = widget.system("/bin/cat plugins/" + plugin + ".conf.js", function()
			{
				try
				{
					// Evaluate new plugin
					eval(cmd.outputString);

					// Update current version
					document.getElementById("su_" + plugin + "_version").innerHTML =
						Plugins[plugin].version;
				}
				catch (e)
				{
					__DEBUG(e);

					document.getElementById("su_" + plugin + "_version").innerHTML =
						'<span style="color:red">%s</span>'.sprintf(getLocalizedString("Error"));
				}
				// Bring the plugin item into view
				document.getElementById("su_" + plugin + "_label").scrollIntoView(false);
				// Proceed to next
				if (SUUpdater.updatePool.length > 0)
				{
					SUUpdater.updatePlugin(SUUpdater.updatePool.shift());
				}
				else
				{
					// Disable the update button
					SUUpdater.updateButton.setEnabled(false);
					// Check for more updates
					SUUpdater.checkUpdates();
				}
				
			});				
		});
	},
	_clear: function()
	{
		var suTBody = document.getElementById("suTable").getElementsByTagName("tbody")[0];
		while (suTBody.childNodes.length > 0)
		{
			suTBody.removeChild(suTBody.childNodes[0]);
		}
	},
	_populate: function()
	{
		var suTable = document.getElementById("suTable");
		var suTBody = suTable.getElementsByTagName("tbody")[0];
		var iterator = Plugins.keyIterator();
		for (var i = 0, plugin; plugin = iterator.next(); i++)
		{
			var suTr = document.createElement("tr");
			suTr.className = "row" + (i % 2);
			suTr.id = "su_" + plugin;
			
			var suChk = document.createElement("input");
			suChk.type = "checkbox";
			suChk.disabled = true;
			suChk.id = "su_" + plugin + "_checkbox";
			
			var suTd;
			suTd = document.createElement("td");
			suTd.appendChild(suChk);
			suTr.appendChild(suTd);

			var txt = Plugins[plugin].name.shrinkToLength(10);
			
			suTd = document.createElement("td");
			suTd.id = "su_" + plugin + "_label";
			suTd.appendChild(document.createTextNode(txt));
			suTr.appendChild(suTd);
			if (txt != Plugins[plugin].name)
			{
				// Set full plugin name as tooltip if the innerHTML is clipped
				suTd.setAttribute("title", Plugins[plugin].name);
			}

			suTd = document.createElement("td");
			suTd.id = "su_" + plugin + "_version";
			suTd.className = "right-aligned";
			suTd.appendChild(document.createTextNode(Plugins[plugin].version));
			suTr.appendChild(suTd);

			suTd = document.createElement("td");
			suTd.id = "su_" + plugin + "_latestversion";
			suTd.className = "right-aligned";
			suTr.appendChild(suTd);
			
			suTBody.appendChild(suTr);
		}
	}
};