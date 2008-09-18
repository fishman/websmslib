SkinClasses = {
	blue: "",
	red: "red",
	yellow: "yellow",
	white: "white",
	green: "green",
	purple: "purple"
};
	
SkinChooser = {
	updateWithSkin: function(skin)
	{
		return;
		var styles = widget.getElementById("skinchooser").getElementsByTagName("img");
		var index = 0;
		for (var i = 0; i < styles.length; i++)
		{
			if (styles[i].id.indexOf(skin) == 0)
				index = i;
			styles[i].src = styles[i].src.replace("-on", "-off");
		}
		styles[index].src = styles[index].src.replace("-off", "-on");		
	},
	setSkin: function(el)
	{
		return;
		var styles = el.parentElement.getElementsByTagName("img");
		for (var i = 0; i < styles.length; i++)
		{
			if (styles[i] != el)
			{
				styles[i].src = styles[i].src.replace("-on", "-off");
			}
		}
		el.src = el.src.replace("-off", "-on");
		phone.setSkin(el.id.substr(0, el.id.indexOf("-")));
	}
};