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
 *	2008-04-09	Workaround for bogus widget.system() truncating data: reloading plugin until
 *				succeeded. Yeah, I know this may cause an infinite loop.
 */

/**
 *	The Plugins dictionary holds all plugins that can be used with WebSMS.
 *	Currently, a plugin registers with WebSMS by adding itself to this dictionary.
 *	Since this sucks, a wiser registration mechanism will be introduced in the future.
 */
var Plugins = {};

/**
 *	The PluginManager singleton handles all plugin related tasks like
 *	loading the plugins found in the <tt>plugins</tt> folder, populating
 *	the plugin options preference pane and so on.
 */
var PluginManager = 
{
	_oncomplete: null,
	_pluginQueue: [],
	/**
	 *	Creates fields for plugin-specific additional parameters
	 */
	populatePluginParametersPane: function(pname)
	{
		// Get current plugin
		var plugin = Plugins[pname];
		// Clear settings pane
		var pPane = document.getElementById("pluginParamsPreferences");
		if (pPane)
		{
			while (pPane.childNodes.length)
			{
				pPane.removeChild(pPane.childNodes[0]);
			}
			if (plugin.parameters)
			{
				// Populate settings
				for (var i = 0; i < plugin.parameters.length; i++)
				{
					var param = plugin.parameters[i];
			
					var pPara = document.createElement("p");
			
					var pLabel = document.createElement("label");
					pLabel.appendChild(document.createTextNode(param.name + ":"));
					pLabel.setAttribute("id", param.name + "Label");
					pLabel.setAttribute("for", param.name + param.type.capitalize());

					var pField = null;
					switch (param.type)
					{
						case "text":
							pField = document.createElement("input");
							pField.setAttribute("type", "text");
							pField.setAttribute("value", param.defaultValue || "");
							break;
						case "list":
							if (!param.values || !param.values.length)
							{
								alert("[PluginManager] Critical: expecting a list of values but found " + param.values + " instead");
								return;
							}
							pField = document.createElement("select");
							for (var j = 0; j < param.values.length; j++)
							{
								pField.options[j] = new Option(param.values[j], param.values[j]);
								if (param.values[j] == param.defaultValue)
								{
									pField.selectedIndex = j;
								}
							}
							break;
					}
					pField.setAttribute("id", param.name + param.type.capitalize());
					
					pPara.appendChild(pLabel);
					pPara.appendChild(pField);
					pPane.appendChild(pPara);
				}
			}
		}
	},
	// Loads the contents of the plugin files and evaluates it,
	// then fills the providers list in
	loadPlugins: function(oncomplete)
	{
		if (typeof(oncomplete) == 'function')
		{
			this._oncomplete = oncomplete;
		}

		var cmd = "/usr/bin/find plugins -name *conf.js";
		//__DEBUG(cmd);
		
		var task = widget.system(cmd, function(tsk)
		{
			PluginManager._pluginQueue = tsk.outputString.trim().split("\n");
			
			if (PluginManager._pluginQueue.length > 0)
			{
				// Load the first plugin
				PluginManager._loadPlugin();
			}
			else
			{
				// No plugins to load. Skip to oncomplete (if any).
				if (typeof(PluginManager._oncomplete) == 'function')
				{
					PluginManager._oncomplete();
				}
			}
		});
	},
	// Loads the first plugin in _pluginQueue, then calls itself
	// recursively, until the queue is empty
	_loadPlugin: function()
	{
		var plugin = PluginManager._pluginQueue.shift();
		
		var cmd = "/bin/cat -u " + plugin;
		//__DEBUG(cmd);
		
		var task2 = widget.system(cmd, function(tsk)
		{
			//__DEBUG(tsk.outputString);
			try
			{
				eval(tsk.outputString);
			}
			catch (e)
			{
				alert('[PluginManager] Exception while loading plugin %s: %s'.sprintf(plugin,
					e));
				// The only possible workaround here is to try to reload the truncated file.
				PluginManager._pluginQueue.unshift(plugin);
			}
			
			if (PluginManager._pluginQueue.length > 0)
			{
				// More plugins to load. Load next
				PluginManager._loadPlugin();
			}
			else
			{
				// No more plugins to load. Skip to complete
				PluginManager._complete();
			}
		});
		
	},
	// Loads the provider selection list, then calls an eventual
	// _oncomplete function
	_complete: function()
	{
		var pSel = document.getElementById("providersList");
		var iterator = Plugins.keyIterator();
		for (var i = 0, plugin; plugin = iterator.next(); i++)
		{
			pSel.options[i] = new Option(Plugins[plugin].name,
				plugin);
		}

		// Call _oncomplete (if any).
		if (typeof(this._oncomplete) == 'function')
		{
			this._oncomplete();
		}
	}
};