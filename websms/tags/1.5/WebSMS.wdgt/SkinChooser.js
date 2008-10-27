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
		var styles = document.getElementById("skinchooser").getElementsByTagName("img");
		var index = 0;
		for (var i = 0; i < styles.length; i++)
		{
			if (styles[i].id.indexOf(skin) == 0)
				index = i;
			styles[i].src = styles[i].src.replace("-on", "");
		}
		styles[index].src = styles[index].src.replace(".png", "-on.png");		
	},
	setSkin: function(el)
	{
		var styles = el.parentElement.getElementsByTagName("img");
		for (var i = 0; i < styles.length; i++)
		{
			if (styles[i] != el)
			{
				styles[i].src = styles[i].src.replace("-on", "");
			}
		}
		el.src = el.src.replace(".png", "-on.png");
		phone.setSkin(el.id.substr(0, el.id.indexOf("-")));
	}
};